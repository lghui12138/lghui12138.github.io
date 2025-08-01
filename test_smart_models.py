import requests
import time

def test_all_models():
    """测试所有可用模型"""
    print("🧪 智能模型测试工具")
    print("=" * 60)
    
    api_key = "sk-dhseqxecuwwotodiskfdgwdjahnbexcgdotkfsovbgajxnis"
    api_url = "https://api.siliconflow.cn/v1/chat/completions"
    
    # 模型列表（按您的要求）
    models = [
        # 主推模型
        "deepseek-ai/DeepSeek-V3",
        "deepseek-ai/DeepSeek-R1",
        
        # Qwen系列
        "Qwen/Qwen2.5-7B-Instruct",
        "Qwen/Qwen2.5-14B-Instruct", 
        "Qwen/Qwen2.5-32B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct",
        
        # 视觉模型
        "Qwen/Qwen2.5-VL-32B-Instruct",
        "Qwen/Qwen2.5-VL-72B-Instruct",
        
        # 特殊模型
        "Qwen/QVQ-72B-Preview",
        "Qwen/QwQ-32B"
    ]
    
    # 测试消息（不同复杂度）
    test_messages = [
        {
            "content": "你好",
            "complexity": "简单",
            "expected_model": "7B或14B"
        },
        {
            "content": "请详细解释量子力学的基本原理和应用",
            "complexity": "复杂",
            "expected_model": "72B或DeepSeek"
        },
        {
            "content": "帮我分析一下这个投资方案的优缺点",
            "complexity": "中等",
            "expected_model": "32B或DeepSeek-V3"
        }
    ]
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    available_models = []
    
    print("🔍 正在测试模型可用性...")
    
    for i, model in enumerate(models, 1):
        print(f"\n📡 测试模型 {i}/{len(models)}: {model}")
        
        data = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": "你好，请回复'测试成功'"
                }
            ],
            "max_tokens": 50,
            "temperature": 0.7
        }
        
        try:
            start_time = time.time()
            response = requests.post(api_url, headers=headers, json=data, timeout=30)
            end_time = time.time()
            
            response_time = end_time - start_time
            
            if response.status_code == 200:
                result = response.json()
                reply = result['choices'][0]['message']['content']
                usage = result.get('usage', {})
                
                model_info = {
                    "name": model,
                    "status": "✅ 可用",
                    "response_time": response_time,
                    "reply": reply,
                    "tokens": usage.get('total_tokens', 0)
                }
                
                available_models.append(model_info)
                
                print(f"   ✅ 可用 - {response_time:.2f}秒")
                print(f"   🤖 回复: {reply}")
                print(f"   📊 Token: {usage.get('total_tokens', 0)}")
                
            else:
                print(f"   ❌ 不可用 - HTTP {response.status_code}")
                error_data = response.json() if response.content else {}
                if 'message' in error_data:
                    print(f"   📝 错误: {error_data['message']}")
                    
        except requests.exceptions.Timeout:
            print("   ⏰ 请求超时")
        except Exception as e:
            print(f"   ❌ 异常: {e}")
        
        # 避免频率限制
        time.sleep(1)
    
    # 总结报告
    print("\n" + "=" * 60)
    print("📊 测试总结报告")
    print("=" * 60)
    
    print(f"✅ 可用模型: {len(available_models)}/{len(models)}")
    
    if available_models:
        print("\n🏆 推荐配置:")
        
        # 按响应时间分类
        fast_models = [m for m in available_models if m['response_time'] < 5]
        medium_models = [m for m in available_models if 5 <= m['response_time'] < 15]
        slow_models = [m for m in available_models if m['response_time'] >= 15]
        
        if fast_models:
            print("\n🏃 快速模型（简单对话）:")
            for model in fast_models[:3]:
                print(f"   - {model['name']} ({model['response_time']:.1f}s)")
        
        if medium_models:
            print("\n🚶 中速模型（一般问题）:")
            for model in medium_models[:3]:
                print(f"   - {model['name']} ({model['response_time']:.1f}s)")
        
        if slow_models:
            print("\n🧠 深度模型（复杂推理）:")
            for model in slow_models[:3]:
                print(f"   - {model['name']} ({model['response_time']:.1f}s)")
        
        # 特殊推荐
        print("\n⭐ 特别推荐:")
        deepseek_models = [m for m in available_models if 'DeepSeek' in m['name']]
        if deepseek_models:
            print("   🤖 DeepSeek系列（推理能力强）:")
            for model in deepseek_models:
                print(f"     - {model['name']}")
        
        qwen_large = [m for m in available_models if 'Qwen' in m['name'] and ('72B' in m['name'] or '32B' in m['name'])]
        if qwen_large:
            print("   🧪 Qwen大模型（综合能力强）:")
            for model in qwen_large:
                print(f"     - {model['name']}")
    
    return available_models

def test_intelligent_selection():
    """测试智能模型选择逻辑"""
    print("\n🧠 智能选择测试")
    print("=" * 40)
    
    # 模拟不同复杂度的消息
    test_cases = [
        {
            "message": "你好",
            "expected_complexity": "simple",
            "description": "简单问候"
        },
        {
            "message": "今天天气怎么样？",
            "expected_complexity": "simple", 
            "description": "日常询问"
        },
        {
            "message": "请帮我分析一下这个商业计划书的可行性",
            "expected_complexity": "medium",
            "description": "分析类问题"
        },
        {
            "message": "能详细解释一下深度学习中的反向传播算法原理吗？包括数学推导过程",
            "expected_complexity": "complex",
            "description": "复杂技术问题"
        },
        {
            "message": "为什么量子计算机能够实现指数级加速？请从物理原理角度深入分析",
            "expected_complexity": "complex", 
            "description": "深度科学问题"
        }
    ]
    
    for i, case in enumerate(test_cases, 1):
        message = case["message"]
        expected = case["expected_complexity"]
        description = case["description"]
        
        print(f"\n测试 {i}: {description}")
        print(f"消息: {message}")
        
        # 简化的复杂度分析逻辑
        complexity = analyze_message_complexity_simple(message)
        
        print(f"预期复杂度: {expected}")
        print(f"分析结果: {complexity}")
        print(f"匹配度: {'✅ 正确' if complexity == expected else '❌ 需要调整'}")

def analyze_message_complexity_simple(message):
    """简化版消息复杂度分析"""
    if not message or len(message) < 5:
        return "simple"
    
    complex_keywords = [
        "为什么", "怎么", "如何", "分析", "解释", "原理", "机制",
        "推理", "逻辑", "证明", "计算", "详细", "深入", "专业",
        "算法", "数学", "物理", "化学", "量子", "深度学习"
    ]
    
    medium_keywords = [
        "什么", "哪个", "建议", "推荐", "比较", "区别", "选择",
        "方法", "步骤", "介绍", "说明", "总结", "分析"
    ]
    
    message_lower = message.lower()
    
    complex_count = sum(1 for word in complex_keywords if word in message_lower)
    medium_count = sum(1 for word in medium_keywords if word in message_lower)
    
    if complex_count > 0 or len(message) > 100:
        return "complex"
    elif medium_count > 0 or len(message) > 50:
        return "medium"
    else:
        return "simple"

def main():
    print("🤖 智能模型测试套件")
    print("=" * 50)
    
    choice = input("选择测试:\n1. 测试所有模型可用性\n2. 测试智能选择逻辑\n3. 全面测试\n请选择 (1-3): ")
    
    if choice == "1":
        available_models = test_all_models()
        
        if available_models:
            print(f"\n✅ 测试完成！发现 {len(available_models)} 个可用模型")
            print("💡 您现在可以使用智能微信机器人了")
        else:
            print("\n❌ 没有找到可用模型，请检查网络和API配置")
            
    elif choice == "2":
        test_intelligent_selection()
        
    elif choice == "3":
        print("🚀 开始全面测试...")
        available_models = test_all_models()
        test_intelligent_selection()
        
        print("\n🎉 全面测试完成!")
        if available_models:
            print(f"✅ 系统就绪，发现 {len(available_models)} 个可用模型")
        
    else:
        print("❌ 无效选择")

if __name__ == "__main__":
    main() 