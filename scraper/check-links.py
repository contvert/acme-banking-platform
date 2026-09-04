"""Verify every internal href in the app resolves to a real route."""
import re
from pathlib import Path

root = Path('.')

routes = {'/'}
for f in root.glob('app/**/page.tsx'):
    rel = f.parent.relative_to('app').as_posix()
    routes.add('/' if rel == '.' else '/' + rel)

hrefs = {}
patterns = list(root.glob('lib/**/*.ts')) + list(root.glob('components/**/*.tsx')) + \
           list(root.glob('app/**/*.tsx'))
for f in patterns:
    text = f.read_text(encoding='utf-8')
    for h in re.findall(r"href[=:]\s*['\"](/[^'\"?#]*)", text):
        key = h.rstrip('/') or '/'
        hrefs.setdefault(key, set()).add(f.as_posix())

def matches(href):
    if href in routes:
        return True
    # dynamic segments: /a/[id]/b matches /a/anything/b
    hp = href.strip('/').split('/')
    for r in routes:
        rp = r.strip('/').split('/')
        if len(rp) != len(hp):
            continue
        if all(rs.startswith('[') or rs == hs for rs, hs in zip(rp, hp)):
            return True
    return False


missing = sorted(h for h in hrefs if not matches(h))

print(f'ROUTES ({len(routes)}):')
for r in sorted(routes):
    print('  ', r)

print(f'\nBROKEN LINKS ({len(missing)}):')
for m in missing:
    print('  ', m, '<-', ', '.join(sorted(hrefs[m])))
