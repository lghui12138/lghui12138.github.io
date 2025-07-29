import re

with open('modules/question-bank-module.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 只保留不以 diff/patch 标记开头的行
cleaned = []
in_html = False
for line in lines:
    # 跳过 diff/patch 标记行
    if re.match(r'^[-+@]|^diff |^index |^\(\s*cd ', line):
        continue
    # 检测到 HTML 开头，开始保留
    if '<!DOCTYPE html>' in line:
        in_html = True
    if in_html:
        # 去除行首的 diff 标记（如 - 或 +）
        cleaned.append(re.sub(r'^[-+]', '', line))
# 写回文件
with open('modules/question-bank-module.html', 'w', encoding='utf-8') as f:
    f.writelines(cleaned)