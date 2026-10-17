#!/usr/bin/env python3
"""Package exactly the reviewed resource manifest; no GitHub or product actions."""
import hashlib
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'public-manifest.json').read_text(encoding='utf-8'))
scope = json.loads((root / 'PUBLIC-SCOPE.json').read_text(encoding='utf-8'))
files = []
for entry in manifest['files']:
    name = entry['path']
    candidate = root / name
    if name not in scope['files'] or candidate.is_symlink() or not candidate.is_file() or root not in candidate.resolve().parents:
        raise SystemExit(f'Not an approved regular resource: {name}')
    data = candidate.read_bytes()
    if hashlib.sha256(data).hexdigest() != entry['sha256'] or len(data) != entry['bytes']:
        raise SystemExit(f'Manifest changed; review and regenerate first: {name}')
    files.append(name)
files.append('public-manifest.json')
if set(files) != set(scope['files']):
    raise SystemExit('Scope and package manifest differ.')
out = root / '.release'
out.mkdir(exist_ok=True)

def archive(name, selected, prefix):
    destination = out / name
    with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as package:
        for file in sorted(selected):
            info = zipfile.ZipInfo(prefix + file, (2026, 10, 17, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            package.writestr(info, (root / file).read_bytes())
    print(f'{destination.name}: {destination.stat().st_size} bytes, sha256={hashlib.sha256(destination.read_bytes()).hexdigest()}')

archive('aimegeo-resources-0.1.0-review.zip', files, 'aimegeo-resources-0.1.0/')
for slug in ['aimegeo-setup', 'aimegeo-content', 'aimegeo-publish-monitor']:
    selected = [file for file in files if file.startswith(f'skills/{slug}/')]
    destination = out / f'{slug}-0.1.0-review.zip'
    with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as package:
        for file in sorted(selected):
            package.write(root / file, file.removeprefix('skills/'))
        for file in ['LICENSE', 'NOTICE.md']:
            package.write(root / file, f'{slug}/{file}')
    print(f'{destination.name}: {destination.stat().st_size} bytes')
print('Local review packages only. No repository, release or installer was published.')
