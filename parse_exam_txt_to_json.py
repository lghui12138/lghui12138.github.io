import re
import json
from tqdm import tqdm
import os
import requests
import time

INPUT_FILE = '真题文件.txt'
OUTPUT_FILE = 'question-banks/真题_中国海洋大学_2000-2021.json'

# 分类关键词（可扩展）
CATEGORIES = {
    '边界层': ['边界层', '排移厚度', '动量厚度', 'Prandtl', '普朗特'],
    '雷诺数': ['雷诺数', 'Reynolds', 'Re'],
    '管道流动': ['管道', '圆管', '明渠', '流量', '流速', '压力损失', '达西', '魏斯巴赫'],
    '粘性': ['粘性', '粘性系数', '粘性流体', '剪切应力'],
    '势流': ['势流', '速度势', '流函数', '复势'],
    '涡度': ['涡度', '点涡', '涡旋', '环流'],
    '能量方程': ['能量', '伯努利', '能量方程', 'Bernoulli'],
    '自由面': ['自由面', '水面', '明渠', '堰', '液面'],
    '实验与量纲': ['量纲', '相似', '实验', '模型', '无量纲', '斯托克斯', '阻力系数'],
    '流体性质': ['密度', '连续介质', '不可压缩', '正压', '牛顿流体', '非牛顿流体'],
    '湍流': ['湍流', '层流', '流态', '湍流理论'],
    '流线轨迹': ['流线', '轨迹', '迹线', '脉线'],
    '动量方程': ['动量', '动量方程', '拉格朗日', '欧拉'],
    '压力': ['压力', '压强', '静压', '动压'],
    '流体力学基础': ['流体', '流体力学', '基本性质', '定义'],
}

# 题型关键词
TYPE_MAP = {
    '名词解释': '名词解释',
    '简答题': '简答题',
    '简述': '简答题',
    '计算题': '计算题',
    '证明题': '证明题',
    '选择题': '选择题',
    '填空题': '填空题',
    '问': '问答题',
    '说明': '简答题',
    '写出': '简答题',
    '推导': '推导题',
    '分析': '分析题',
    '画': '作图题',
    '求': '计算题',
}

# 题目分割正则
QUESTION_SPLIT = re.compile(r'^(\d+)[.．、\s]+[（(]?(\d+)?分[)）]?', re.MULTILINE)
# 年份分割正则
YEAR_SPLIT = re.compile(r'中国海洋大学(\d{4})年硕士研究生招生考试试题')
# 答案区分割正则
ANSWER_SPLIT = re.compile(r'中国海洋大学(\d{4})年硕士研究生招生考试试题参考答案')

# 读取全部文本
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 按年份分割题目区和答案区
questions_by_year = {}
answers_by_year = {}

# 题目区
for m in YEAR_SPLIT.finditer(content):
    year = int(m.group(1))
    start = m.end()
    next_m = YEAR_SPLIT.search(content, start)
    end = next_m.start() if next_m else len(content)
    questions_by_year[year] = content[start:end].strip()

# 答案区
for m in ANSWER_SPLIT.finditer(content):
    year = int(m.group(1))
    start = m.end()
    next_m = ANSWER_SPLIT.search(content, start)
    end = next_m.start() if next_m else len(content)
    answers_by_year[year] = content[start:end].strip()

def parse_questions(text, year):
    items = []
    # 标准分割
    splits = list(QUESTION_SPLIT.finditer(text))
    if splits and (year < 2022):
        for i, m in enumerate(splits):
            qnum = int(m.group(1))
            score = int(m.group(2)) if m.group(2) else None
            start = m.end()
            end = splits[i+1].start() if i+1 < len(splits) else len(text)
            qtext = text[start:end].strip()
            # 题型自动识别
            qtype = None
            for k, v in TYPE_MAP.items():
                if k in qtext[:20]:
                    qtype = v
                    break
            if not qtype:
                if '选择' in qtext or '下列' in qtext:
                    qtype = '选择题'
                elif '证明' in qtext:
                    qtype = '证明题'
                elif '计算' in qtext or '求' in qtext:
                    qtype = '计算题'
                else:
                    qtype = '综合题'
            title = qtext.replace('\n', ' ').replace('  ', ' ')
            tags = []
            for cat, kws in CATEGORIES.items():
                if any(kw in title for kw in kws):
                    tags.append(cat)
            items.append({
                'id': f'ocean-{year}-{qnum:02d}',
                'title': title,
                'year': year,
                'school': '中国海洋大学',
                'score': score,
                'type': qtype,
                'category': '历年真题',
                'tags': tags,
                'options': [],
                'answer': '',
                'explanation': ''
            })
    else:
        # 2022-2024回忆版：按空行或每行分段
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        # 尝试按空行分段
        blocks = []
        block = []
        for line in lines:
            if line == '' or line.isspace():
                if block:
                    blocks.append(' '.join(block))
                    block = []
            else:
                block.append(line)
        if block:
            blocks.append(' '.join(block))
        # 若分段过少，按每行一个题
        if len(blocks) < 3:
            blocks = lines
        for idx, qtext in enumerate(blocks):
            qtype = None
            for k, v in TYPE_MAP.items():
                if k in qtext[:20]:
                    qtype = v
                    break
            if not qtype:
                if '选择' in qtext or '下列' in qtext:
                    qtype = '选择题'
                elif '证明' in qtext:
                    qtype = '证明题'
                elif '计算' in qtext or '求' in qtext:
                    qtype = '计算题'
                else:
                    qtype = '综合题'
            title = qtext.replace('\n', ' ').replace('  ', ' ')
            tags = []
            for cat, kws in CATEGORIES.items():
                if any(kw in title for kw in kws):
                    tags.append(cat)
            items.append({
                'id': f'ocean-{year}-{idx+1:02d}',
                'title': title,
                'year': year,
                'school': '中国海洋大学',
                'score': None,
                'type': qtype,
                'category': '历年真题',
                'tags': tags,
                'options': [],
                'answer': '',
                'explanation': ''
            })
    return items

def parse_answers(text):
    # 按题号分割
    ans = {}
    splits = list(QUESTION_SPLIT.finditer(text))
    for i, m in enumerate(splits):
        qnum = int(m.group(1))
        start = m.end()
        end = splits[i+1].start() if i+1 < len(splits) else len(text)
        atext = text[start:end].strip()
        # 按小问分割
        subq = re.split(r'\([A-Da-d1-9]\)[.、\s]', atext)
        if len(subq) > 1:
            # 有小问，合并为字符串
            atext = '\n'.join([s for s in subq if s.strip()])
        ans[qnum] = atext
    return ans

all_questions = []
for year in tqdm(sorted(questions_by_year.keys())):
    qlist = parse_questions(questions_by_year[year], year)
    ansmap = parse_answers(answers_by_year.get(year, ''))
    for q in qlist:
        qnum = int(q['id'].split('-')[-1])
        if qnum in ansmap:
            q['answer'] = ansmap[qnum]
            q['explanation'] = ansmap[qnum]
    all_questions.extend(qlist)

# 新增：AI补全所有缺失答案
def ai_complete_answer(question_text):
    url = "https://api.siliconflow.cn/v1/chat/completions"
    headers = {
        "Authorization": "Bearer sk-dhseqxecuwwotodiskfdgwdjahnbexcgdotkfsovbgajxnis",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-ai/DeepSeek-V2.5",
        "messages": [
            {"role": "user", "content": f"请为以下流体力学考研真题生成标准答案和简要解析：题目：{question_text}"}
        ],
        "max_tokens": 512,
        "temperature": 0.2
    }
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        if resp.status_code == 200:
            result = resp.json()
            return result["choices"][0]["message"]["content"].strip()
        else:
            print("AI补全失败:", resp.status_code, resp.text)
            return ""
    except Exception as e:
        print(f'AI补全异常: {e}')
        return ""

def batch_ai_complete(questions):
    for q in tqdm(questions):
        if not q['answer']:
            ans = ai_complete_answer(q['title'])
            q['answer'] = ans
            q['explanation'] = ans
            time.sleep(1.5)  # 防止API限流

batch_ai_complete(all_questions)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(all_questions, f, ensure_ascii=False, indent=2)

# 分类题库自动生成
def save_category_banks(questions, categories):
    cat_map = {cat: [] for cat in categories}
    for q in questions:
        for tag in q.get('tags', []):
            if tag in cat_map:
                cat_map[tag].append(q)
    for cat, qs in cat_map.items():
        if qs:
            fname = f'question-banks/分类_{cat}.json'
            with open(fname, 'w', encoding='utf-8') as f:
                json.dump(qs, f, ensure_ascii=False, indent=2)
            print(f'已生成分类题库：{fname}，共{len(qs)}题')

save_category_banks(all_questions, CATEGORIES.keys())

print(f'已生成题库：{OUTPUT_FILE}，共{len(all_questions)}题') 