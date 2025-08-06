// 练习题库数据
const practiceBank = {
    basic: {
        title: "基础知识题",
        description: "地理基本概念、原理和规律",
        questions: [
            {
                id: 1,
                type: "single",
                question: "地球自转的方向是（　）",
                options: [
                    { label: "A", text: "自东向西" },
                    { label: "B", text: "自西向东" },
                    { label: "C", text: "自南向北" },
                    { label: "D", text: "自北向南" }
                ],
                answer: "B",
                explanation: "地球自转方向是自西向东，这可以通过观察太阳东升西落的现象得出。"
            },
            {
                id: 2,
                type: "single",
                question: "下列关于等高线的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "等高线可以相交" },
                    { label: "B", text: "等高线密集表示坡度缓" },
                    { label: "C", text: "等高线闭合表示山峰或洼地" },
                    { label: "D", text: "等高线数值相同的点海拔不同" }
                ],
                answer: "C",
                explanation: "等高线闭合时，如果中心数值高于周围，表示山峰；如果中心数值低于周围，表示洼地。"
            },
            {
                id: 3,
                type: "single",
                question: "世界上面积最大的高原是（　）",
                options: [
                    { label: "A", text: "青藏高原" },
                    { label: "B", text: "巴西高原" },
                    { label: "C", text: "东非高原" },
                    { label: "D", text: "伊朗高原" }
                ],
                answer: "B",
                explanation: "巴西高原是世界上面积最大的高原，面积约500万平方千米。青藏高原是世界上海拔最高的高原。"
            },
            {
                id: 4,
                type: "multiple",
                question: "影响气候的主要因素包括（　）",
                options: [
                    { label: "A", text: "纬度位置" },
                    { label: "B", text: "海陆位置" },
                    { label: "C", text: "地形地势" },
                    { label: "D", text: "洋流" }
                ],
                answer: ["A", "B", "C", "D"],
                explanation: "影响气候的主要因素包括：纬度位置（决定太阳辐射量）、海陆位置（影响温度和降水）、地形地势（影响气温和降水分布）、洋流（调节沿岸气候）等。"
            },
            {
                id: 5,
                type: "single",
                question: "北回归线穿过我国的省区有（　）",
                options: [
                    { label: "A", text: "3个" },
                    { label: "B", text: "4个" },
                    { label: "C", text: "5个" },
                    { label: "D", text: "6个" }
                ],
                answer: "B",
                explanation: "北回归线穿过我国4个省区：台湾、广东、广西、云南。"
            },
            {
                id: 6,
                type: "single",
                question: "下列关于经纬网的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "所有经线长度相等" },
                    { label: "B", text: "所有纬线长度相等" },
                    { label: "C", text: "经线指示东西方向" },
                    { label: "D", text: "纬线指示南北方向" }
                ],
                answer: "A",
                explanation: "所有经线都是半圆，长度相等。纬线长度不等，赤道最长。经线指示南北方向，纬线指示东西方向。"
            },
            {
                id: 7,
                type: "single",
                question: "地球上最大的淡水资源是（　）",
                options: [
                    { label: "A", text: "河流水" },
                    { label: "B", text: "湖泊水" },
                    { label: "C", text: "冰川水" },
                    { label: "D", text: "地下水" }
                ],
                answer: "C",
                explanation: "冰川水是地球上最大的淡水资源，约占淡水总量的68.7%，主要分布在南极和格陵兰岛。"
            },
            {
                id: 8,
                type: "single",
                question: "下列地形区与其主要成因对应正确的是（　）",
                options: [
                    { label: "A", text: "喜马拉雅山—火山作用" },
                    { label: "B", text: "东非大裂谷—地壳断裂" },
                    { label: "C", text: "长江中下游平原—风力沉积" },
                    { label: "D", text: "黄土高原—冰川沉积" }
                ],
                answer: "B",
                explanation: "东非大裂谷是由地壳断裂形成的。喜马拉雅山是板块碰撞形成，长江中下游平原是流水沉积形成，黄土高原是风力沉积形成。"
            },
            {
                id: 9,
                type: "single",
                question: "关于板块构造学说的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "板块内部地壳稳定" },
                    { label: "B", text: "板块边界地壳活跃" },
                    { label: "C", text: "全球分为六大板块" },
                    { label: "D", text: "以上都正确" }
                ],
                answer: "D",
                explanation: "板块构造学说认为：板块内部地壳相对稳定，板块边界地壳活跃，全球岩石圈分为六大板块。"
            },
            {
                id: 10,
                type: "single",
                question: "下列关于洋流的叙述，错误的是（　）",
                options: [
                    { label: "A", text: "洋流按性质分为暖流和寒流" },
                    { label: "B", text: "洋流能够调节全球热量分布" },
                    { label: "C", text: "所有洋流都是由风力驱动的" },
                    { label: "D", text: "洋流对沿岸气候有重要影响" }
                ],
                answer: "C",
                explanation: "洋流的成因多样，包括风力、密度差异、地转偏向力等，不是所有洋流都由风力驱动。"
            },
            {
                id: 11,
                type: "single",
                question: "关于气候类型的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "热带雨林气候全年干湿季分明" },
                    { label: "B", text: "地中海气候夏季多雨冬季干燥" },
                    { label: "C", text: "温带海洋性气候冬暖夏凉" },
                    { label: "D", text: "热带沙漠气候降水丰富" }
                ],
                answer: "C",
                explanation: "温带海洋性气候受西风带和暖流影响，具有冬暖夏凉、年较差小、降水均匀的特点。"
            },
            {
                id: 12,
                type: "single",
                question: "影响河流水文特征的主要因素不包括（　）",
                options: [
                    { label: "A", text: "气候条件" },
                    { label: "B", text: "地形地貌" },
                    { label: "C", text: "植被覆盖" },
                    { label: "D", text: "人口密度" }
                ],
                answer: "D",
                explanation: "影响河流水文特征的主要因素包括气候条件、地形地貌、植被覆盖、土壤类型等自然因素。人口密度不是直接影响因素。"
            },
            {
                id: 13,
                type: "single",
                question: "下列关于地形对气候影响的叙述，错误的是（　）",
                options: [
                    { label: "A", text: "海拔高度影响气温" },
                    { label: "B", text: "山脉走向影响降水分布" },
                    { label: "C", text: "地形起伏影响风向" },
                    { label: "D", text: "地形对气候没有影响" }
                ],
                answer: "D",
                explanation: "地形对气候有重要影响：海拔影响气温（海拔每升高1000米，气温下降6℃），山脉阻挡气流影响降水分布，地形起伏影响局地风向等。"
            },
            {
                id: 14,
                type: "single",
                question: "关于季风气候的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "只分布在亚洲地区" },
                    { label: "B", text: "由海陆热力性质差异形成" },
                    { label: "C", text: "全年风向不变" },
                    { label: "D", text: "降水季节分布均匀" }
                ],
                answer: "B",
                explanation: "季风气候是由海陆热力性质差异形成的，夏季风从海洋吹向陆地，冬季风从陆地吹向海洋，降水主要集中在夏季。"
            },
            {
                id: 15,
                type: "single",
                question: "下列地理现象与地球自转有关的是（　）",
                options: [
                    { label: "A", text: "四季更替" },
                    { label: "B", text: "昼夜更替" },
                    { label: "C", text: "昼夜长短变化" },
                    { label: "D", text: "正午太阳高度变化" }
                ],
                answer: "B",
                explanation: "昼夜更替是地球自转产生的现象。四季更替、昼夜长短变化、正午太阳高度变化都是地球公转产生的现象。"
            },
            {
                id: 16,
                type: "single",
                question: "世界人口分布最稠密的地区是（　）",
                options: [
                    { label: "A", text: "东亚" },
                    { label: "B", text: "南亚" },
                    { label: "C", text: "欧洲" },
                    { label: "D", text: "北美洲东北部" }
                ],
                answer: "A",
                explanation: "东亚地区包括中国东部、朝鲜半岛、日本等，是世界人口分布最稠密的地区，人口密度超过200人/平方公里。"
            },
            {
                id: 17,
                type: "single",
                question: "关于城市化的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "城市化只表现为城市人口增加" },
                    { label: "B", text: "城市化水平越高越好" },
                    { label: "C", text: "城市化是社会经济发展的必然结果" },
                    { label: "D", text: "城市化不会带来环境问题" }
                ],
                answer: "C",
                explanation: "城市化是社会经济发展的必然结果，是人类社会发展的重要标志。但城市化需要合理规划，过快的城市化会带来各种问题。"
            },
            {
                id: 18,
                type: "single",
                question: "影响工业布局的主要因素不包括（　）",
                options: [
                    { label: "A", text: "原料和燃料" },
                    { label: "B", text: "市场和交通" },
                    { label: "C", text: "劳动力和技术" },
                    { label: "D", text: "宗教信仰" }
                ],
                answer: "D",
                explanation: "影响工业布局的主要因素包括原料和燃料、市场和交通、劳动力和技术、政策和环境等。宗教信仰一般不是影响工业布局的主要因素。"
            },
            {
                id: 19,
                type: "single",
                question: "可再生资源包括（　）",
                options: [
                    { label: "A", text: "石油、天然气" },
                    { label: "B", text: "煤炭、铁矿" },
                    { label: "C", text: "森林、水能" },
                    { label: "D", text: "铜矿、铝土矿" }
                ],
                answer: "C",
                explanation: "可再生资源是指在自然界中能够循环再生的资源，如森林、水能、风能、太阳能等。石油、煤炭、矿物等属于非可再生资源。"
            },
            {
                id: 20,
                type: "single",
                question: "关于可持续发展的叙述，错误的是（　）",
                options: [
                    { label: "A", text: "既满足当代人需要，又不损害后代人利益" },
                    { label: "B", text: "经济发展与环境保护相协调" },
                    { label: "C", text: "只注重经济效益，不考虑环境影响" },
                    { label: "D", text: "实现人与自然和谐发展" }
                ],
                answer: "C",
                explanation: "可持续发展要求经济发展与环境保护、社会进步相协调，既满足当代人需要，又不损害后代人满足其需要的能力。不能只注重经济效益而忽视环境影响。"
            }
        ]
    },
    comprehensive: {
        title: "综合分析题",
        description: "图表分析、案例研究、综合应用",
        questions: [
            {
                id: 1,
                type: "comprehensive",
                question: "读"某地区等高线地形图"，回答下列问题：",
                image: `
                    <svg width="100%" height="250" viewBox="0 0 400 250" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 等高线 -->
                        <ellipse cx="200" cy="125" rx="150" ry="80" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <text x="200" y="130" text-anchor="middle" font-size="12">500m</text>
                        
                        <ellipse cx="200" cy="125" rx="100" ry="50" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <text x="200" y="110" text-anchor="middle" font-size="12">600m</text>
                        
                        <ellipse cx="200" cy="125" rx="50" ry="25" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <text x="200" y="95" text-anchor="middle" font-size="12">700m</text>
                        
                        <!-- 河流 -->
                        <path d="M 50 200 Q 150 180 250 160 Q 300 150 350 140" stroke="#4169E1" stroke-width="3" fill="none"/>
                        <text x="300" y="135" font-size="10" fill="#4169E1">河流</text>
                        
                        <!-- 方向标 -->
                        <g transform="translate(50, 50)">
                            <circle r="20" fill="white" stroke="#333"/>
                            <line x1="0" y1="-15" x2="0" y2="15" stroke="#333" stroke-width="2"/>
                            <line x1="-15" y1="0" x2="15" y2="0" stroke="#333" stroke-width="2"/>
                            <text x="0" y="-25" text-anchor="middle" font-size="10">N</text>
                        </g>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "该地形区的地形类型是什么？",
                        answer: "山地（或丘陵）。从等高线分布可以看出，中心海拔高，向外逐渐降低，且等高线闭合，表明这是一个山地地形。"
                    },
                    {
                        question: "河流的流向是什么？判断依据是什么？",
                        answer: "河流大致从西南向东北流。判断依据：河流总是从高处向低处流，根据等高线数值，西南部海拔较高，东北部海拔较低。"
                    }
                ]
            },
            {
                id: 2,
                type: "comprehensive",
                question: "读"某城市热岛效应示意图"，分析城市热岛效应的成因及影响：",
                image: `
                    <svg width="100%" height="200" viewBox="0 0 400 200" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 城市轮廓 -->
                        <rect x="150" y="120" width="100" height="60" fill="#666" opacity="0.7"/>
                        <text x="200" y="155" text-anchor="middle" fill="white" font-size="12">城市</text>
                        
                        <!-- 郊区 -->
                        <rect x="50" y="140" width="80" height="40" fill="#228B22" opacity="0.7"/>
                        <text x="90" y="165" text-anchor="middle" fill="white" font-size="10">郊区</text>
                        
                        <rect x="270" y="140" width="80" height="40" fill="#228B22" opacity="0.7"/>
                        <text x="310" y="165" text-anchor="middle" fill="white" font-size="10">郊区</text>
                        
                        <!-- 温度曲线 -->
                        <path d="M 50 100 Q 100 110 150 90 Q 200 70 250 90 Q 300 110 350 100" 
                              stroke="#FF4500" stroke-width="3" fill="none"/>
                        
                        <!-- 温度标注 -->
                        <text x="90" y="95" text-anchor="middle" font-size="10" fill="#FF4500">24°C</text>
                        <text x="200" y="60" text-anchor="middle" font-size="10" fill="#FF4500">28°C</text>
                        <text x="310" y="95" text-anchor="middle" font-size="10" fill="#FF4500">24°C</text>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "什么是城市热岛效应？",
                        answer: "城市热岛效应是指城市气温明显高于周围郊区的现象，形成一个相对的高温区域，就像海洋中的岛屿一样。"
                    },
                    {
                        question: "城市热岛效应的主要成因有哪些？",
                        answer: "主要成因：①人工热源多（工业、交通、生活用能）；②下垫面性质改变（水泥、沥青吸热快、散热快）；③绿地减少，蒸发降温作用弱；④大气污染严重，大气逆辐射强。"
                    }
                ]
            },
            {
                id: 3,
                type: "comprehensive",
                question: "读"某地区气候资料图"，分析该地区的气候特征：",
                image: `
                    <svg width="100%" height="300" viewBox="0 0 500 300" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 坐标轴 -->
                        <line x1="50" y1="250" x2="450" y2="250" stroke="#333" stroke-width="2"/>
                        <line x1="50" y1="50" x2="50" y2="250" stroke="#333" stroke-width="2"/>

                        <!-- 月份标注 -->
                        <text x="80" y="270" text-anchor="middle" font-size="10">1</text>
                        <text x="110" y="270" text-anchor="middle" font-size="10">2</text>
                        <text x="140" y="270" text-anchor="middle" font-size="10">3</text>
                        <text x="170" y="270" text-anchor="middle" font-size="10">4</text>
                        <text x="200" y="270" text-anchor="middle" font-size="10">5</text>
                        <text x="230" y="270" text-anchor="middle" font-size="10">6</text>
                        <text x="260" y="270" text-anchor="middle" font-size="10">7</text>
                        <text x="290" y="270" text-anchor="middle" font-size="10">8</text>
                        <text x="320" y="270" text-anchor="middle" font-size="10">9</text>
                        <text x="350" y="270" text-anchor="middle" font-size="10">10</text>
                        <text x="380" y="270" text-anchor="middle" font-size="10">11</text>
                        <text x="410" y="270" text-anchor="middle" font-size="10">12</text>

                        <!-- 温度曲线 -->
                        <path d="M 80 200 Q 140 180 200 160 Q 260 140 320 160 Q 380 180 410 200"
                              stroke="#FF4500" stroke-width="3" fill="none"/>
                        <text x="420" y="200" font-size="12" fill="#FF4500">温度(°C)</text>

                        <!-- 降水柱状图 -->
                        <rect x="75" y="240" width="10" height="10" fill="#4169E1"/>
                        <rect x="105" y="235" width="10" height="15" fill="#4169E1"/>
                        <rect x="135" y="220" width="10" height="30" fill="#4169E1"/>
                        <rect x="165" y="200" width="10" height="50" fill="#4169E1"/>
                        <rect x="195" y="180" width="10" height="70" fill="#4169E1"/>
                        <rect x="225" y="160" width="10" height="90" fill="#4169E1"/>
                        <rect x="255" y="150" width="10" height="100" fill="#4169E1"/>
                        <rect x="285" y="160" width="10" height="90" fill="#4169E1"/>
                        <rect x="315" y="180" width="10" height="70" fill="#4169E1"/>
                        <rect x="345" y="210" width="10" height="40" fill="#4169E1"/>
                        <rect x="375" y="230" width="10" height="20" fill="#4169E1"/>
                        <rect x="405" y="240" width="10" height="10" fill="#4169E1"/>
                        <text x="420" y="240" font-size="12" fill="#4169E1">降水(mm)</text>

                        <!-- 数值标注 -->
                        <text x="30" y="160" font-size="10">25</text>
                        <text x="30" y="200" font-size="10">15</text>
                        <text x="30" y="240" font-size="10">5</text>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "根据图中信息，判断该地区的气候类型，并说明判断依据。",
                        answer: "该地区为地中海气候。判断依据：①夏季（6-8月）高温少雨；②冬季（12-2月）温和多雨；③年降水量适中，雨热不同期。"
                    },
                    {
                        question: "分析该气候类型的形成原因。",
                        answer: "形成原因：①纬度位置：30°-40°之间；②海陆位置：大陆西岸；③大气环流：夏季受副热带高压控制，冬季受西风带控制；④地形：沿海平原或丘陵。"
                    }
                ]
            },
            {
                id: 4,
                type: "comprehensive",
                question: "读"某河流流域示意图"，分析河流的水文特征：",
                image: `
                    <svg width="100%" height="250" viewBox="0 0 400 250" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 河流 -->
                        <path d="M 50 200 Q 150 180 250 160 Q 300 150 350 140" stroke="#4169E1" stroke-width="4" fill="none"/>
                        <text x="200" y="135" text-anchor="middle" font-size="12" fill="#4169E1">主河道</text>

                        <!-- 支流 -->
                        <path d="M 100 220 Q 120 200 140 180" stroke="#4169E1" stroke-width="2" fill="none"/>
                        <path d="M 200 200 Q 220 180 240 160" stroke="#4169E1" stroke-width="2" fill="none"/>

                        <!-- 山地 -->
                        <polygon points="80,100 100,60 120,100" fill="#8B4513"/>
                        <polygon points="180,120 200,80 220,120" fill="#8B4513"/>
                        <polygon points="280,100 300,60 320,100" fill="#8B4513"/>
                        <text x="200" y="50" text-anchor="middle" font-size="12">山地</text>

                        <!-- 平原 -->
                        <rect x="50" y="200" width="100" height="30" fill="#90EE90" opacity="0.7"/>
                        <text x="100" y="220" text-anchor="middle" font-size="10">平原</text>

                        <!-- 城市 -->
                        <circle cx="300" cy="150" r="8" fill="#FF6347"/>
                        <text x="300" y="135" text-anchor="middle" font-size="10">城市</text>

                        <!-- 流向箭头 -->
                        <defs>
                            <marker id="riverArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#4169E1"/>
                            </marker>
                        </defs>
                        <path d="M 320 145 L 340 142" stroke="#4169E1" stroke-width="2" marker-end="url(#riverArrow)"/>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "分析该河流的补给类型及其季节变化特点。",
                        answer: "补给类型：主要为雨水补给，部分山区有冰雪融水补给。季节变化：夏季降水多，河流水位高，流量大；冬季降水少，水位低，流量小。"
                    },
                    {
                        question: "该河流在不同河段的开发利用方式有何不同？",
                        answer: "上游山区：水力发电、水源涵养；中游丘陵：农业灌溉、水土保持；下游平原：航运、城市供水、农业灌溉。"
                    }
                ]
            },
            {
                id: 5,
                type: "comprehensive",
                question: "读"某地区等高线地形图"，分析地形特征：",
                image: `
                    <svg width="100%" height="300" viewBox="0 0 400 300" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 等高线 -->
                        <ellipse cx="200" cy="150" rx="150" ry="100" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <ellipse cx="200" cy="150" rx="120" ry="80" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <ellipse cx="200" cy="150" rx="90" ry="60" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <ellipse cx="200" cy="150" rx="60" ry="40" fill="none" stroke="#8B4513" stroke-width="2"/>
                        <ellipse cx="200" cy="150" rx="30" ry="20" fill="none" stroke="#8B4513" stroke-width="2"/>

                        <!-- 海拔标注 -->
                        <text x="350" y="150" font-size="12" fill="#8B4513">100m</text>
                        <text x="320" y="150" font-size="12" fill="#8B4513">200m</text>
                        <text x="290" y="150" font-size="12" fill="#8B4513">300m</text>
                        <text x="260" y="150" font-size="12" fill="#8B4513">400m</text>
                        <text x="230" y="150" font-size="12" fill="#8B4513">500m</text>

                        <!-- 河流 -->
                        <path d="M 50 200 Q 150 180 250 160 Q 300 150 350 140" stroke="#4169E1" stroke-width="3" fill="none"/>
                        <text x="200" y="135" text-anchor="middle" font-size="10" fill="#4169E1">河流</text>

                        <!-- 指北针 -->
                        <g transform="translate(50, 50)">
                            <circle cx="0" cy="0" r="20" fill="white" stroke="#333" stroke-width="1"/>
                            <path d="M 0 -15 L 5 0 L 0 15 L -5 0 Z" fill="#e74c3c"/>
                            <text x="0" y="-25" text-anchor="middle" font-size="10" fill="#333">N</text>
                        </g>

                        <!-- 比例尺 -->
                        <g transform="translate(50, 250)">
                            <line x1="0" y1="0" x2="50" y2="0" stroke="#333" stroke-width="2"/>
                            <text x="25" y="15" text-anchor="middle" font-size="10" fill="#333">0 1km</text>
                        </g>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "根据等高线特征，判断该地形类型并说明判断依据。",
                        answer: "该地形为山地（丘陵）。判断依据：①等高线呈封闭状；②等高线数值从外向内递增；③海拔在100-500米之间；④等高线较密集，坡度较陡。"
                    },
                    {
                        question: "分析河流的流向，并说明河流发育的有利条件。",
                        answer: "河流流向：从东南向西北流。有利条件：①地势东南高西北低，提供流水动力；②山地为河流提供水源；③地形起伏大，利于径流汇集。"
                    }
                ]
            },
            {
                id: 6,
                type: "comprehensive",
                question: "读"某城市热岛效应示意图"，分析城市气候特征：",
                image: `
                    <svg width="100%" height="250" viewBox="0 0 400 250" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 城市轮廓 -->
                        <rect x="150" y="150" width="100" height="80" fill="#666" opacity="0.7"/>
                        <text x="200" y="195" text-anchor="middle" font-size="12" fill="white">城市中心</text>

                        <!-- 郊区 -->
                        <rect x="50" y="180" width="80" height="50" fill="#90EE90" opacity="0.7"/>
                        <text x="90" y="210" text-anchor="middle" font-size="10" fill="#2c3e50">郊区</text>
                        <rect x="270" y="180" width="80" height="50" fill="#90EE90" opacity="0.7"/>
                        <text x="310" y="210" text-anchor="middle" font-size="10" fill="#2c3e50">郊区</text>

                        <!-- 温度曲线 -->
                        <path d="M 50 120 Q 100 110 150 90 Q 200 70 250 90 Q 300 110 350 120"
                              stroke="#FF4500" stroke-width="3" fill="none"/>

                        <!-- 温度标注 -->
                        <text x="90" y="105" text-anchor="middle" font-size="10" fill="#FF4500">24°C</text>
                        <text x="200" y="60" text-anchor="middle" font-size="10" fill="#FF4500">28°C</text>
                        <text x="310" y="105" text-anchor="middle" font-size="10" fill="#FF4500">24°C</text>

                        <!-- 风向箭头 -->
                        <defs>
                            <marker id="windArrow2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#4169E1"/>
                            </marker>
                        </defs>
                        <path d="M 120 140 L 170 140" stroke="#4169E1" stroke-width="2" marker-end="url(#windArrow2)"/>
                        <path d="M 280 140 L 230 140" stroke="#4169E1" stroke-width="2" marker-end="url(#windArrow2)"/>
                        <text x="200" y="135" text-anchor="middle" font-size="10" fill="#4169E1">城市风</text>

                        <text x="200" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#2c3e50">城市热岛效应示意图</text>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "什么是城市热岛效应？",
                        answer: "城市热岛效应是指城市气温明显高于周围郊区的现象，形成一个相对的高温区域，就像海洋中的岛屿一样。"
                    },
                    {
                        question: "城市热岛效应的主要成因有哪些？",
                        answer: "主要成因：①人工热源多（工业、交通、生活用能）；②下垫面性质改变（水泥、沥青吸热快、散热快）；③绿地减少，蒸发降温作用弱；④大气污染严重，大气逆辐射强。"
                    }
                ]
            },
            {
                id: 7,
                type: "comprehensive",
                question: "读"某区域人口密度分布图"，分析人口分布特点：",
                image: `
                    <svg width="100%" height="280" viewBox="0 0 400 280" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 区域轮廓 -->
                        <rect x="50" y="50" width="300" height="180" fill="#e8f5e9" stroke="#4caf50" stroke-width="2"/>

                        <!-- 山地 -->
                        <polygon points="80,80 120,60 160,80 140,120 100,120" fill="#8d6e63" opacity="0.8"/>
                        <text x="120" y="95" text-anchor="middle" font-size="10" fill="white">山地</text>
                        <text x="120" y="105" text-anchor="middle" font-size="8" fill="white">50人/km²</text>

                        <!-- 平原 -->
                        <rect x="180" y="100" width="120" height="80" fill="#4caf50" opacity="0.8"/>
                        <text x="240" y="135" text-anchor="middle" font-size="10" fill="white">平原</text>
                        <text x="240" y="145" text-anchor="middle" font-size="8" fill="white">300人/km²</text>

                        <!-- 河流 -->
                        <path d="M 200 100 Q 220 140 240 180 Q 260 200 280 220" stroke="#2196f3" stroke-width="4" fill="none"/>
                        <text x="250" y="195" font-size="8" fill="#2196f3">河流</text>

                        <!-- 城市 -->
                        <circle cx="250" cy="150" r="15" fill="#f44336" opacity="0.8"/>
                        <text x="250" y="155" text-anchor="middle" font-size="8" fill="white">城市</text>
                        <text x="250" y="175" text-anchor="middle" font-size="8" fill="#f44336">1000人/km²</text>

                        <!-- 沙漠 -->
                        <ellipse cx="320" cy="120" rx="40" ry="30" fill="#ff9800" opacity="0.8"/>
                        <text x="320" y="120" text-anchor="middle" font-size="10" fill="white">沙漠</text>
                        <text x="320" y="130" text-anchor="middle" font-size="8" fill="white">5人/km²</text>

                        <!-- 图例 -->
                        <g transform="translate(60, 250)">
                            <text x="0" y="0" font-size="12" font-weight="bold">人口密度图例：</text>
                            <circle cx="0" cy="15" r="5" fill="#f44336"/>
                            <text x="10" y="20" font-size="9">城市(>500人/km²)</text>
                            <rect x="80" y="10" width="10" height="10" fill="#4caf50"/>
                            <text x="95" y="20" font-size="9">平原(200-500人/km²)</text>
                            <polygon points="180,10 190,15 185,25" fill="#8d6e63"/>
                            <text x="195" y="20" font-size="9">山地(50-200人/km²)</text>
                            <ellipse cx="285" cy="15" rx="8" ry="5" fill="#ff9800"/>
                            <text x="300" y="20" font-size="9">沙漠(<50人/km²)</text>
                        </g>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "描述该区域人口分布的特点。",
                        answer: "人口分布特点：①分布不均，差异显著；②城市人口密度最高，达1000人/km²；③平原地区人口较稠密，为300人/km²；④山地人口密度中等，为50人/km²；⑤沙漠地区人口稀少，仅5人/km²。"
                    },
                    {
                        question: "分析影响该区域人口分布的主要因素。",
                        answer: "影响因素：①地形：平原地形平坦，适宜居住和农业发展，人口稠密；山地地形崎岖，人口较少；②水源：河流沿岸水源充足，有利于人口集聚；③气候：沙漠地区气候干旱，不适宜人类居住；④经济发展：城市经济发达，就业机会多，人口集中。"
                    }
                ]
            },
            {
                id: 8,
                type: "comprehensive",
                question: "读"某工业区布局示意图"，分析工业布局特点：",
                image: `
                    <svg width="100%" height="300" viewBox="0 0 400 300" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px;">
                        <!-- 海岸线 -->
                        <path d="M 0 150 Q 100 140 200 150 Q 300 160 400 150" stroke="#2196f3" stroke-width="3" fill="none"/>
                        <text x="350" y="140" font-size="10" fill="#2196f3">海岸线</text>

                        <!-- 港口 -->
                        <rect x="180" y="140" width="40" height="20" fill="#607d8b"/>
                        <text x="200" y="155" text-anchor="middle" font-size="8" fill="white">港口</text>

                        <!-- 钢铁厂 -->
                        <rect x="160" y="100" width="80" height="30" fill="#795548"/>
                        <text x="200" y="120" text-anchor="middle" font-size="10" fill="white">钢铁厂</text>

                        <!-- 化工厂 -->
                        <rect x="260" y="110" width="60" height="25" fill="#9c27b0"/>
                        <text x="290" y="127" text-anchor="middle" font-size="9" fill="white">化工厂</text>

                        <!-- 电子厂 -->
                        <rect x="100" y="80" width="50" height="20" fill="#2196f3"/>
                        <text x="125" y="95" text-anchor="middle" font-size="8" fill="white">电子厂</text>

                        <!-- 居民区 -->
                        <rect x="80" y="180" width="100" height="60" fill="#4caf50" opacity="0.7"/>
                        <text x="130" y="215" text-anchor="middle" font-size="10" fill="white">居民区</text>

                        <!-- 铁路 -->
                        <line x1="50" y1="200" x2="350" y2="200" stroke="#424242" stroke-width="3"/>
                        <text x="200" y="190" text-anchor="middle" font-size="8" fill="#424242">铁路</text>

                        <!-- 河流 -->
                        <path d="M 120 50 Q 150 100 180 150" stroke="#03a9f4" stroke-width="3" fill="none"/>
                        <text x="140" y="70" font-size="8" fill="#03a9f4">河流</text>

                        <!-- 风向 -->
                        <defs>
                            <marker id="windArrow3" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#ff5722"/>
                            </marker>
                        </defs>
                        <path d="M 50 30 L 100 30" stroke="#ff5722" stroke-width="2" marker-end="url(#windArrow3)"/>
                        <text x="75" y="25" text-anchor="middle" font-size="8" fill="#ff5722">主导风向</text>

                        <text x="200" y="20" text-anchor="middle" font-size="14" font-weight="bold">某工业区布局示意图</text>
                    </svg>
                `,
                subQuestions: [
                    {
                        question: "分析该工业区的布局特点。",
                        answer: "布局特点：①临海布局：钢铁厂、化工厂靠近海岸和港口，便于原料运输和产品外运；②沿交通线分布：各工厂沿铁路分布，交通便利；③考虑风向：污染较重的钢铁厂、化工厂位于居民区的下风向；④靠近水源：工厂靠近河流，便于取水和排污。"
                    },
                    {
                        question: "评价该工业区布局的合理性。",
                        answer: "合理性评价：①优点：交通便利，靠近港口利于对外贸易；工厂集中便于协作和管理；②不足：污染企业距离居民区较近，可能影响环境质量；河流上游布局工厂可能污染水源；③改进建议：加强环保措施，合理规划工业区与居民区距离。"
                    }
                ]
            }
        ]
    },
    teaching: {
        title: "教学设计题",
        description: "教学方法、课程设计、教学评价",
        questions: [
            {
                id: 1,
                type: "comprehensive",
                question: "请为"水循环"这一课题设计一个完整的教学方案：",
                subQuestions: [
                    {
                        question: "确定教学目标（知识目标、能力目标、情感目标）",
                        answer: `知识目标：理解水循环的概念、过程和地理意义
能力目标：能够分析水循环示意图，解释水循环各环节的相互关系
情感目标：树立保护水资源的意识，认识人与自然和谐发展的重要性`
                    },
                    {
                        question: "选择合适的教学方法并说明理由",
                        answer: `主要教学方法：
1. 图示法：利用水循环示意图，直观展示水循环过程
2. 实验演示法：模拟水循环过程，增强学生理解
3. 案例分析法：结合具体地区分析水循环特点
4. 讨论法：引导学生讨论人类活动对水循环的影响
理由：水循环是抽象概念，需要直观教学手段帮助理解`
                    },
                    {
                        question: "设计课堂活动方案",
                        answer: `活动方案：
1. 导入活动：播放降雨视频，提问"雨水从哪里来？"
2. 探究活动：小组合作绘制水循环示意图
3. 实验活动：用烧杯、热水等模拟水循环过程
4. 讨论活动：分析人类活动对水循环的影响
5. 总结活动：学生总结水循环的地理意义`
                    }
                ]
            },
            {
                id: 2,
                type: "comprehensive",
                question: "请为"气压带和风带"这一课题设计教学活动：",
                subQuestions: [
                    {
                        question: "设计一个导入活动，激发学生学习兴趣",
                        answer: `导入活动设计：
1. 播放台风形成视频，提问"台风为什么会旋转？"
2. 展示世界风向图，让学生观察风向规律
3. 提出问题：为什么不同地区风向不同？
4. 引出课题：气压带和风带的分布规律
目的：通过直观现象引发思考，激发探究欲望`
                    },
                    {
                        question: "设计教学重点突破方法",
                        answer: `重点突破方法：
1. 制作三圈环流模型，动态演示气流运动
2. 分组讨论：每组负责一个环流圈的分析
3. 绘制气压带风带分布图，加深理解
4. 角色扮演：学生扮演气流，模拟运动过程
5. 对比分析：南北半球气压带风带的异同`
                    },
                    {
                        question: "设计课堂练习题，检验学习效果",
                        answer: `课堂练习设计：
1. 判断题：赤道地区盛行上升气流（√）
2. 选择题：北半球信风的风向（东北风）
3. 填图题：在空白图上标注七个气压带
4. 分析题：解释为什么副热带地区多沙漠
5. 应用题：分析某地风向与当地气候的关系`
                    }
                ]
            },
            {
                id: 3,
                type: "comprehensive",
                question: "针对"地球的运动"这一单元，设计单元教学计划：",
                subQuestions: [
                    {
                        question: "制定单元教学目标（知识、能力、情感目标）",
                        answer: `单元教学目标：
知识目标：掌握地球自转和公转的基本规律，理解地球运动的地理意义
能力目标：能够运用地球运动规律解释地理现象，提高空间思维能力
情感目标：培养科学探究精神，增强对宇宙和地球的敬畏之心`
                    },
                    {
                        question: "安排课时分配和教学内容",
                        answer: `课时安排（共6课时）：
第1课时：地球自转的基本规律
第2课时：地球自转的地理意义
第3课时：地球公转的基本规律
第4课时：地球公转的地理意义
第5课时：地球运动的综合应用
第6课时：单元复习与检测`
                    },
                    {
                        question: "设计单元评价方案",
                        answer: `评价方案：
1. 过程性评价（40%）：课堂参与、作业完成、小组合作
2. 阶段性评价（30%）：单元测试、实验报告
3. 终结性评价（30%）：期末考试相关内容
评价方式：自评、互评、师评相结合
评价工具：评价量表、学习档案袋`
                    }
                ]
            },
            {
                id: 4,
                type: "comprehensive",
                question: "请为"水循环"这一课题设计完整的教学方案：",
                subQuestions: [
                    {
                        question: "设计教学目标（知识目标、能力目标、情感目标）",
                        answer: `教学目标设计：
知识目标：①理解水循环的概念和过程；②掌握水循环的类型和地理意义；③了解人类活动对水循环的影响
能力目标：①能够绘制水循环示意图；②能够分析水循环各环节的相互关系；③提高读图分析能力
情感目标：①树立水资源保护意识；②培养可持续发展观念；③增强环境保护责任感`
                    },
                    {
                        question: "设计教学重难点及突破方法",
                        answer: `教学重点：水循环的过程和地理意义
教学难点：水循环各环节的相互关系
突破方法：
1. 制作水循环动态演示模型
2. 分组讨论各环节的作用
3. 绘制水循环示意图
4. 案例分析：长江流域水循环
5. 实验演示：蒸发和凝结过程`
                    },
                    {
                        question: "设计教学活动和教学方法",
                        answer: `教学活动设计：
1. 导入：播放水循环动画视频
2. 新课：小组合作探究水循环过程
3. 练习：绘制水循环示意图
4. 拓展：讨论人类活动对水循环的影响
5. 总结：构建知识网络图
教学方法：讲授法、讨论法、演示法、实验法`
                    }
                ]
            },
            {
                id: 5,
                type: "comprehensive",
                question: "针对"地理信息技术"设计探究性学习活动：",
                subQuestions: [
                    {
                        question: "设计探究主题和探究问题",
                        answer: `探究主题：地理信息技术在城市规划中的应用
探究问题：
1. 如何利用遥感技术获取城市土地利用信息？
2. GIS在城市规划中发挥什么作用？
3. GPS技术如何为城市交通提供服务？
4. "3S"技术如何协同工作？`
                    },
                    {
                        question: "设计探究活动流程",
                        answer: `探究活动流程：
第一阶段：问题提出（1课时）
- 展示城市规划案例，提出探究问题
第二阶段：资料收集（2课时）
- 分组收集相关资料和案例
第三阶段：实践体验（2课时）
- 使用GIS软件进行简单操作
- 体验GPS导航功能
第四阶段：成果展示（1课时）
- 各组汇报探究成果
- 制作展示海报`
                    },
                    {
                        question: "设计评价方案",
                        answer: `评价方案：
1. 过程评价（60%）：
   - 参与度和合作精神（20%）
   - 资料收集和整理（20%）
   - 实践操作能力（20%）
2. 成果评价（40%）：
   - 汇报内容质量（20%）
   - 展示效果（10%）
   - 创新性（10%）
评价主体：自评、互评、师评相结合`
                    }
                ]
            }
        ]
    },
    mock: {
        title: "模拟试卷",
        description: "完整的模拟考试，检验学习效果",
        questions: [
            {
                id: 1,
                type: "single",
                question: "关于地球运动的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "地球自转产生了四季变化" },
                    { label: "B", text: "地球公转产生了昼夜更替" },
                    { label: "C", text: "地球自转的周期是365.25天" },
                    { label: "D", text: "黄赤交角的存在是四季变化的根本原因" }
                ],
                answer: "D",
                explanation: "黄赤交角（23.5°）的存在导致太阳直射点在南北回归线之间移动，是四季变化的根本原因。"
            },
            {
                id: 2,
                type: "single",
                question: "下列地理现象与地转偏向力有关的是（　）",
                options: [
                    { label: "A", text: "昼夜更替" },
                    { label: "B", text: "信风方向" },
                    { label: "C", text: "四季变化" },
                    { label: "D", text: "潮汐现象" }
                ],
                answer: "B",
                explanation: "地转偏向力影响地球上运动物体的方向，信风在地转偏向力作用下形成东北信风和东南信风。"
            },
            {
                id: 3,
                type: "single",
                question: "下列关于水循环的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "海洋内循环对人类意义最大" },
                    { label: "B", text: "陆地内循环水量最大" },
                    { label: "C", text: "海陆间循环是陆地淡水的主要来源" },
                    { label: "D", text: "三种循环相互独立进行" }
                ],
                answer: "C",
                explanation: "海陆间循环是陆地淡水的主要来源，对人类意义最大。海洋内循环水量最大，但三种循环相互联系。"
            },
            {
                id: 4,
                type: "single",
                question: "关于板块构造学说的叙述，错误的是（　）",
                options: [
                    { label: "A", text: "板块内部地壳稳定" },
                    { label: "B", text: "板块边界地壳活跃" },
                    { label: "C", text: "全球分为七大板块" },
                    { label: "D", text: "板块在不断运动" }
                ],
                answer: "C",
                explanation: "全球岩石圈分为六大板块，不是七大板块。其他选项都是正确的。"
            },
            {
                id: 5,
                type: "single",
                question: "影响气候的主要因素不包括（　）",
                options: [
                    { label: "A", text: "纬度位置" },
                    { label: "B", text: "海陆位置" },
                    { label: "C", text: "人口密度" },
                    { label: "D", text: "地形地势" }
                ],
                answer: "C",
                explanation: "影响气候的主要因素包括纬度位置、海陆位置、地形地势、洋流等自然因素。人口密度不是影响气候的主要因素。"
            },
            {
                id: 6,
                type: "multiple",
                question: "地球自转产生的地理现象包括（　）",
                options: [
                    { label: "A", text: "昼夜更替" },
                    { label: "B", text: "地方时差异" },
                    { label: "C", text: "地转偏向力" },
                    { label: "D", text: "四季变化" }
                ],
                answer: ["A", "B", "C"],
                explanation: "地球自转产生昼夜更替、地方时差异和地转偏向力。四季变化是地球公转产生的现象。"
            },
            {
                id: 7,
                type: "comprehensive",
                question: "读材料，回答问题：",
                material: "某地区夏季炎热干燥，冬季温和多雨，年降水量600-1000mm，主要集中在冬季。该地区盛产柑橘、葡萄等水果。",
                subQuestions: [
                    {
                        question: "判断该地区的气候类型，并分析其形成条件。",
                        answer: "地中海气候。形成条件：①纬度30°-40°；②大陆西岸；③夏季受副热带高压控制，冬季受西风带控制。"
                    },
                    {
                        question: "分析该气候对农业生产的影响。",
                        answer: "有利影响：①光热充足，适合果树生长；②冬季降水，满足作物需水。不利影响：①夏季干旱，需要灌溉；②降水变率大，易发生旱涝灾害。"
                    }
                ]
            },
            {
                id: 8,
                type: "single",
                question: "关于地理信息技术的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "GIS只能处理空间数据" },
                    { label: "B", text: "遥感技术需要直接接触目标" },
                    { label: "C", text: "GPS定位需要至少4颗卫星" },
                    { label: "D", text: "三种技术相互独立工作" }
                ],
                answer: "C",
                explanation: "GPS定位需要至少4颗卫星信号才能实现三维定位。GIS能处理空间和属性数据，遥感是非接触式技术，三种技术相互配合。"
            },
            {
                id: 9,
                type: "single",
                question: "影响城市热岛效应强度的主要因素是（　）",
                options: [
                    { label: "A", text: "城市规模" },
                    { label: "B", text: "天气状况" },
                    { label: "C", text: "季节变化" },
                    { label: "D", text: "以上都是" }
                ],
                answer: "D",
                explanation: "影响城市热岛效应强度的因素包括：城市规模（规模越大效应越强）、天气状况（晴朗无风时效应明显）、季节变化（夏季比冬季明显）等。"
            },
            {
                id: 10,
                type: "multiple",
                question: "下列关于气候类型的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "热带雨林气候全年高温多雨" },
                    { label: "B", text: "地中海气候夏干冬雨" },
                    { label: "C", text: "温带大陆性气候年较差大" },
                    { label: "D", text: "苔原气候分布在高纬地区" }
                ],
                answer: ["A", "B", "C", "D"],
                explanation: "所有选项都正确：热带雨林气候全年高温多雨；地中海气候夏季炎热干燥，冬季温和多雨；温带大陆性气候冬冷夏热，年较差大；苔原气候分布在高纬地区。"
            },
            {
                id: 11,
                type: "comprehensive",
                question: "读材料，分析地形对气候的影响：",
                material: "某山地南坡年降水量1200mm，北坡年降水量600mm，南坡植被茂密，北坡植被稀疏。该山地位于我国西南地区，海拔3000-5000米。",
                subQuestions: [
                    {
                        question: "分析该山地南北坡降水差异的原因。",
                        answer: "原因：①地形阻挡作用：山地阻挡暖湿气流；②迎风坡和背风坡效应：南坡为迎风坡，气流抬升形成地形雨，降水多；北坡为背风坡，气流下沉，降水少；③海拔影响：随海拔升高，气温下降，水汽易凝结。"
                    },
                    {
                        question: "说明地形对植被分布的影响。",
                        answer: "影响：①降水影响：南坡降水多，植被茂密；北坡降水少，植被稀疏；②温度影响：海拔高，气温低，影响植被类型；③坡向影响：南坡阳光充足，北坡相对阴冷；④土壤影响：降水多的地区土壤发育好，有利植被生长。"
                    }
                ]
            },
            {
                id: 12,
                type: "comprehensive",
                question: "分析某地区水资源开发利用问题：",
                material: "某地区年降水量400mm，蒸发量1800mm，地下水位下降，河流断流现象增多，农业用水紧张，工业发展受限。",
                subQuestions: [
                    {
                        question: "分析该地区水资源短缺的原因。",
                        answer: "原因：①自然原因：降水少，蒸发强，水资源总量不足；②人为原因：用水量增加，过度开采地下水，水资源浪费严重；③管理原因：水资源配置不合理，缺乏统一规划。"
                    },
                    {
                        question: "提出解决水资源短缺的措施。",
                        answer: "措施：①开源：跨流域调水，海水淡化，雨水收集；②节流：发展节水农业，提高工业用水效率，推广节水技术；③管理：统一规划水资源，建立水权制度，加强水资源保护；④替代：开发新水源，循环利用废水。"
                    }
                ]
            },
            {
                id: 13,
                type: "single",
                question: "关于人口增长模式的叙述，正确的是（　）",
                options: [
                    { label: "A", text: "原始型：高出生率、高死亡率、高自然增长率" },
                    { label: "B", text: "传统型：高出生率、低死亡率、高自然增长率" },
                    { label: "C", text: "现代型：低出生率、高死亡率、低自然增长率" },
                    { label: "D", text: "发达国家都是现代型" }
                ],
                answer: "B",
                explanation: "传统型人口增长模式的特点是高出生率、低死亡率、高自然增长率，这是发展中国家常见的人口增长模式。"
            },
            {
                id: 14,
                type: "single",
                question: "可持续发展的核心是（　）",
                options: [
                    { label: "A", text: "经济发展" },
                    { label: "B", text: "环境保护" },
                    { label: "C", text: "社会进步" },
                    { label: "D", text: "协调发展" }
                ],
                answer: "D",
                explanation: "可持续发展的核心是协调发展，即经济发展、环境保护、社会进步三者的协调统一，实现人与自然和谐发展。"
            },
            {
                id: 15,
                type: "multiple",
                question: "影响农业区位选择的因素包括（　）",
                options: [
                    { label: "A", text: "自然条件" },
                    { label: "B", text: "社会经济条件" },
                    { label: "C", text: "技术条件" },
                    { label: "D", text: "政策因素" }
                ],
                answer: ["A", "B", "C", "D"],
                explanation: "影响农业区位选择的因素是多方面的：自然条件（气候、地形、土壤、水源）、社会经济条件（市场、交通、劳动力）、技术条件、政策因素等。"
            },
            {
                id: 16,
                type: "comprehensive",
                question: "读材料，分析区域可持续发展问题：",
                material: "某地区矿产资源丰富，长期以采矿业为主导产业。近年来资源枯竭，环境污染严重，人口外流，经济发展面临困境。",
                subQuestions: [
                    {
                        question: "分析该地区面临的主要问题。",
                        answer: "主要问题：①资源枯竭：矿产资源接近枯竭，传统产业难以为继；②环境恶化：长期开采造成环境污染和生态破坏；③经济衰退：产业结构单一，缺乏替代产业；④人口流失：就业机会减少，人口外流严重；⑤社会问题：失业率上升，社会不稳定因素增加。"
                    },
                    {
                        question: "提出该地区可持续发展的对策。",
                        answer: "发展对策：①产业转型：发展接续产业，如生态旅游、绿色农业；②环境治理：加强污染治理和生态修复；③技术创新：引进新技术，发展高新技术产业；④人才培养：加强教育培训，提高劳动者素质；⑤政策支持：争取国家政策扶持，吸引投资；⑥基础设施：完善交通、通信等基础设施。"
                    }
                ]
            }
        ]
    }
};

// 显示练习题集
function showPracticeSet(category) {
    const practiceContent = document.getElementById('practice-content');
    const practiceTitle = document.getElementById('practice-title');
    const practiceQuestions = document.getElementById('practice-questions');
    
    const questionSet = practiceBank[category];
    
    if (!questionSet) {
        console.error('未找到对应的题库分类');
        return;
    }
    
    // 显示练习区域
    practiceContent.style.display = 'block';
    practiceTitle.textContent = questionSet.title;
    
    // 清空之前的题目
    practiceQuestions.innerHTML = '';
    
    // 生成题目HTML
    questionSet.questions.forEach((question, index) => {
        const questionHTML = generateQuestionHTML(question, index + 1);
        practiceQuestions.innerHTML += questionHTML;
    });
    
    // 更新统计
    updatePracticeStats(questionSet.questions.length);
    
    // 滚动到练习区域
    practiceContent.scrollIntoView({ behavior: 'smooth' });
}

// 生成题目HTML
function generateQuestionHTML(question, questionNumber) {
    let html = `<div class="question-card" data-question="${questionNumber}">`;
    
    if (question.type === 'single') {
        html += generateSingleChoiceHTML(question, questionNumber);
    } else if (question.type === 'multiple') {
        html += generateMultipleChoiceHTML(question, questionNumber);
    } else if (question.type === 'comprehensive') {
        html += generateComprehensiveHTML(question, questionNumber);
    }
    
    html += '</div>';
    return html;
}

// 生成单选题HTML
function generateSingleChoiceHTML(question, questionNumber) {
    let html = `
        <div class="question-header">
            <span class="question-number">${questionNumber}.</span>
            <span class="question-text">${question.question}</span>
        </div>
        <div class="options">
    `;
    
    question.options.forEach(option => {
        html += `
            <label class="option">
                <input type="radio" name="q${questionNumber}" value="${option.label}">
                <span class="option-label">${option.label}</span>
                <span class="option-text">${option.text}</span>
            </label>
        `;
    });
    
    html += `
        </div>
        <div class="question-result" style="display: none;">
            <div class="correct-answer">正确答案：${question.answer}</div>
            <div class="explanation">
                <strong>解析：</strong>${question.explanation}
            </div>
        </div>
        <button class="check-answer-btn" onclick="checkAnswer(${questionNumber}, '${question.answer}')">查看答案</button>
    `;
    
    return html;
}

// 生成多选题HTML
function generateMultipleChoiceHTML(question, questionNumber) {
    let html = `
        <div class="question-header">
            <span class="question-number">${questionNumber}.</span>
            <span class="question-text">${question.question}</span>
        </div>
        <div class="options">
    `;
    
    question.options.forEach(option => {
        html += `
            <label class="option">
                <input type="checkbox" name="q${questionNumber}" value="${option.label}">
                <span class="option-label">${option.label}</span>
                <span class="option-text">${option.text}</span>
            </label>
        `;
    });
    
    html += `
        </div>
        <div class="question-result" style="display: none;">
            <div class="correct-answer">正确答案：${question.answer.join('')}</div>
            <div class="explanation">
                <strong>解析：</strong>${question.explanation}
            </div>
        </div>
        <button class="check-answer-btn" onclick="checkMultipleAnswer(${questionNumber}, ${JSON.stringify(question.answer)})">查看答案</button>
    `;
    
    return html;
}

// 生成综合题HTML
function generateComprehensiveHTML(question, questionNumber) {
    let html = `
        <div class="question-header">
            <span class="question-number">${questionNumber}.</span>
            <span class="question-text">${question.question}</span>
        </div>
    `;
    
    if (question.image) {
        html += `<div class="question-image">${question.image}</div>`;
    }
    
    if (question.subQuestions) {
        html += '<div class="sub-questions">';
        question.subQuestions.forEach((subQ, index) => {
            html += `
                <div class="sub-question">
                    <span class="sub-number">(${index + 1})</span>
                    <span class="sub-text">${subQ.question}</span>
                    <div class="answer-area">
                        <textarea placeholder="请在此输入答案..." rows="3"></textarea>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        html += `
            <div class="question-result" style="display: none;">
                <div class="comprehensive-answer">
                    <h4>参考答案：</h4>
        `;
        
        question.subQuestions.forEach((subQ, index) => {
            html += `<p><strong>(${index + 1})</strong> ${subQ.answer}</p>`;
        });
        
        html += `
                </div>
            </div>
            <button class="check-answer-btn" onclick="showComprehensiveAnswer(${questionNumber})">查看参考答案</button>
        `;
    }
    
    return html;
}

// 更新练习统计
function updatePracticeStats(totalQuestions) {
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('answered-questions').textContent = '0';
    document.getElementById('correct-answers').textContent = '0';
    document.getElementById('accuracy-rate').textContent = '0%';
}

// 重置所有答案
function resetAllAnswers() {
    if (confirm('确定要重置所有答案吗？')) {
        location.reload();
    }
}

// 显示所有答案
function showAllAnswers() {
    const questionCards = document.querySelectorAll('.question-card');
    questionCards.forEach(card => {
        const result = card.querySelector('.question-result');
        const button = card.querySelector('.check-answer-btn');
        if (result && button) {
            result.style.display = 'block';
            button.style.display = 'none';
        }
    });
}

// 导出结果
function exportResults() {
    alert('导出功能开发中...');
}
