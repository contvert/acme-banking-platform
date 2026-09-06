import { NextResponse } from 'next/server';
import { createUser, findByUsername, normaliseUsername, checkUsername } from '@/lib/auth/store';
import {
  checkBearer,
  provisioningSecret,
  generatePassword,
  enqueueCredentials,
  findJobByUserId,
} from '@/lib/provisioning/store';

export const dynamic = 'force-dynamic';

/**
 * Provisions a client access on behalf of an external funnel (the LT winner
 * flow). Not part of the signed-in administration surface: it authenticates
 * with a shared bearer secret instead of a session, and it is the one entry
 * that may create an access without an administrator present.
 *
 * The access is created immediately with a generated password; the credentials
 * email is not sent now but parked in the queue and dispatched a few hours
 * later. This gives an administrator a window to review the new access before
 * the client is told how to sign in.
 *
 * Idempotent by sign-in address: calling twice for the same email does not
 * create a second access or a second delayed email.
 */
export async function POST(request: Request) {
  if (!provisioningSecret()) {
    // Fail closed: without a configured secret the endpoint would be an open
    // door onto account creation.
    return NextResponse.json({ error: 'Provisioning is not configured.' }, { status: 503 });
  }
  if (!checkBearer(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  let body: { email?: string; firstName?: string; lastName?: string; displayName?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  const email = normaliseUsername(body.email ?? '');
  const badEmail = checkUsername(email);
  if (badEmail || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const displayName =
    (body.displayName ?? `${body.firstName ?? ''} ${body.lastName ?? ''}`).trim();
  const source = (body.source ?? 'external').slice(0, 64);

  // Idempotency: if the access already exists we do not touch its password —
  // resending it would change what a pending job promised to deliver.
  const existing = await findByUsername(email);
  if (existing) {
    const job = await findJobByUserId(existing.id);
    return NextResponse.json(
      {
        status: 'exists',
        userId: existing.id,
        queued: Boolean(job),
        sendAfter: job?.sendAfter ?? null,
      },
      { status: 200 },
    );
  }

  const password = generatePassword();
  const created = await createUser({
    username: email,
    password,
    displayName,
    role: 'client',
    accountIds: [],
  });
  if ('error' in created) {
    return NextResponse.json({ error: created.error }, { status: 400 });
  }

  const job = await enqueueCredentials({
    userId: created.user.id,
    email,
    displayName: displayName || email,
    password,
    source,
  });

  return NextResponse.json(
    { status: 'created', userId: created.user.id, sendAfter: job.sendAfter },
    { status: 201 },
  );
}
