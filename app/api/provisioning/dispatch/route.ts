import { NextResponse } from 'next/server';
import { checkBearer, provisioningSecret, dueJobs, markSent, markFailed } from '@/lib/provisioning/store';
import { sendClientCredentialsEmail } from '@/lib/email/resend';

export const dynamic = 'force-dynamic';

/** Client sign-in page the credentials email points at. */
function loginUrl(): string {
  return (
    process.env.PROVISIONING_LOGIN_URL?.trim() || 'http://client.localhost:3210/login'
  );
}

/**
 * Sends every credentials email whose delay has elapsed. Meant to be called on
 * a schedule (Windows Task Scheduler / cron) via the shared bearer secret. A
 * job that fails to send is left pending so the next run retries it; a job that
 * succeeds is marked sent and its escrowed password scrubbed.
 */
async function dispatch(request: Request) {
  if (!provisioningSecret()) {
    return NextResponse.json({ error: 'Provisioning is not configured.' }, { status: 503 });
  }
  if (!checkBearer(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const jobs = await dueJobs();
  let sent = 0;
  let failed = 0;

  for (const job of jobs) {
    if (!job.password) {
      // Nothing to deliver — treat as done rather than retrying forever.
      await markSent(job.id);
      continue;
    }
    try {
      await sendClientCredentialsEmail({
        to: job.email,
        displayName: job.displayName,
        username: job.email,
        password: job.password,
        loginUrl: loginUrl(),
      });
      await markSent(job.id);
      sent += 1;
    } catch (err) {
      await markFailed(job.id, err instanceof Error ? err.message : String(err));
      failed += 1;
    }
  }

  return NextResponse.json({ processed: jobs.length, sent, failed });
}

export async function POST(request: Request) {
  return dispatch(request);
}

// GET is accepted too, so a bare scheduled `curl` with the bearer header works.
export async function GET(request: Request) {
  return dispatch(request);
}
