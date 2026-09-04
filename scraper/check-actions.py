"""Flag page header actions that do nothing when clicked.

A `PageAction` with neither `href` nor `onClick` renders as a bare <button> and
is inert. Some are inert on purpose (Export, Save, Download — there is nothing
to navigate to in a static clone), so those are listed under ALLOWED_INERT and
must be named explicitly rather than passing silently.
"""
import re
from pathlib import Path

# Actions that legitimately do not navigate in this clone.
ALLOWED_INERT = {
    'Export', 'Export all', 'Save', 'Save changes', 'Add note', 'Download receipt',
    'Download loan agreement', 'Set as default view', 'Add category', 'Add rule',
    'Add webhook', 'Create an API token', 'Connect HR system', 'Invite via email',
    'Upload GL codes', 'Edit autopay', 'Manage', 'Tax Year: ${TAX_YEAR}',
    'Upload bill', 'Send money', 'Feedback',
}

inert = []
wired = 0

for f in sorted(Path('app').rglob('page.tsx')):
    route = '/' + f.parent.relative_to('app').as_posix()
    if route == '/.':
        route = '/'
    text = f.read_text(encoding='utf-8')

    for block in re.finditer(r'actions=\{\[(.*?)\]\}', text, re.S):
        body = block.group(1)
        # split the array into its object literals
        for obj in re.finditer(r'\{[^{}]*\}', body):
            o = obj.group(0)
            m = re.search(r"label:\s*'([^']+)'|label:\s*`([^`]+)`", o)
            if not m:
                continue
            label = m.group(1) or m.group(2)
            has_target = 'href:' in o or 'onClick:' in o
            if has_target:
                wired += 1
            elif label not in ALLOWED_INERT:
                inert.append((route, label))

print(f'{wired} header actions have a destination or handler')
print(f'{len(inert)} inert action(s) not on the allow-list:\n')
for route, label in inert:
    print(f'  {route:<46} {label!r}')

raise SystemExit(1 if inert else 0)
