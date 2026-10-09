from pathlib import Path

root = Path('.')
files = list(root.rglob('*.ts')) + list(root.rglob('*.tsx'))
replacements = [
    ('Aboriginal Jobs Canada', 'Youth Employment Canada'),
    ('Aboriginal Jobs', 'Youth Employment'),
    ('aboriginaljobscanada.ca', 'youthemploymentcanada.ca'),
    ("Canada's Indigenous Job Platform", "Canada's Youth Employment Network"),
    ('Indigenous job seekers', 'young Canadians'),
    ('inclusive employers across Canada', 'inclusive employers nationwide'),
]
changed = 0
for file in files:
    text = file.read_text(encoding='utf-8')
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        file.write_text(text, encoding='utf-8')
        changed += 1
print(f'Updated {changed} files')
