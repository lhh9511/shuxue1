/* 100款游戏数据注册表 */
const GAMES = {
    /* ===== 1. 益智类 puzzle ===== */
    puzzle_sudoku4: {
        id: 'puzzle_sudoku4', name: '数独入门 4×4', icon: '🔢', category: 'puzzle',
        description: '4×4入门数独，填写1-4让每行每列都不重复',
        template: 'puzzle', rounds: 5, mode: 'sudoku', size: 4
    },
    puzzle_sudoku6: {
        id: 'puzzle_sudoku6', name: '数独进阶 6×6', icon: '🔢', category: 'puzzle',
        description: '6×6进阶数独，填写1-6让每行每列都不重复',
        template: 'puzzle', rounds: 3, mode: 'sudoku', size: 6
    },
    puzzle_pattern: {
        id: 'puzzle_pattern', name: '图形规律推理', icon: '🔍', category: 'puzzle',
        description: '观察图形规律，找出下一个图案',
        template: 'puzzle', rounds: 8, mode: 'pattern'
    },
    puzzle_num_pattern: {
        id: 'puzzle_num_pattern', name: '数字规律填空', icon: '🔢', category: 'puzzle',
        description: '找出数字规律，填写正确的数字',
        template: 'puzzle', rounds: 8, mode: 'pattern'
    },
    puzzle_tangram: {
        id: 'puzzle_tangram', name: '七巧板拼图', icon: '🧩', category: 'puzzle',
        description: '用七巧板的形状拼出不同的图案',
        template: 'puzzle', rounds: 5, mode: 'tangram'
    },
    puzzle_huarong: {
        id: 'puzzle_huarong', name: '华容道', icon: '🏮', category: 'puzzle',
        description: '滑动数字方块到正确位置',
        template: 'puzzle', rounds: 1, mode: 'maze_run'
    },
    puzzle_maze: {
        id: 'puzzle_maze', name: '迷宫探险', icon: '🏰', category: 'puzzle',
        description: '在迷宫中选择正确的道路前进',
        template: 'puzzle', rounds: 5, mode: 'maze'
    },
    puzzle_finddiff: {
        id: 'puzzle_finddiff', name: '找不同', icon: '👁️', category: 'puzzle',
        description: '找出两排图案中不同的那个',
        template: 'puzzle', rounds: 8, mode: 'finddiff'
    },
    puzzle_logic: {
        id: 'puzzle_logic', name: '逻辑推理题', icon: '🧠', category: 'puzzle',
        description: '用逻辑思维解答有趣的推理题',
        template: 'quiz', rounds: 8,
        data: [
            { question: '小明比小红高，小红比小刚高，谁最矮？', options: ['小明','小红','小刚','一样高'], answer: 2 },
            { question: '苹果比香蕉重，香蕉比橘子重，谁最轻？', options: ['苹果','香蕉','橘子','一样重'], answer: 2 },
            { question: '如果所有的猫都会爬树，小花是一只猫，那么？', options: ['小花会爬树','小花不会爬树','小花是狗','不确定'], answer: 0 },
            { question: '今天星期三，后天是星期几？', options: ['星期四','星期五','星期六','星期日'], answer: 1 },
            { question: '一个箱子里的球，不是红的也不是蓝的，是什么颜色？', options: ['一定是黄的','可能是别的颜色','一定是绿的','没有球'], answer: 1 },
            { question: '小华是小明的哥哥，小明是小丽的弟弟，小华和小丽是什么关系？', options: ['兄妹','姐弟','父女','没有关系'], answer: 0 },
            { question: '一栋楼有5层，每层有4个窗户，一共有多少个窗户？', options: ['9个','15个','20个','25个'], answer: 2 },
            { question: '一年有几个季节？', options: ['2个','3个','4个','12个'], answer: 2 }
        ]
    },
    puzzle_classify: {
        id: 'puzzle_classify', name: '物品分类', icon: '📦', category: 'puzzle',
        description: '将物品按照类别进行分类',
        template: 'quiz', rounds: 8,
        data: [
            { question: '下面哪个不属于水果？', options: ['苹果','香蕉','白菜','橘子'], answer: 2 },
            { question: '下面哪个不属于动物？', options: ['老虎','桌子','小鱼','小鸟'], answer: 1 },
            { question: '下面哪个属于文具？', options: ['篮球','橡皮','毛巾','杯子'], answer: 1 },
            { question: '下面哪个不属于交通工具？', options: ['汽车','飞机','书本','轮船'], answer: 2 },
            { question: '下面哪个属于蔬菜？', options: ['草莓','黄瓜','葡萄','西瓜'], answer: 1 },
            { question: '下面哪个不属于学习用品？', options: ['铅笔','书包','电视','尺子'], answer: 2 },
            { question: '下面哪个属于家具？', options: ['椅子','钢笔','帽子','袜子'], answer: 0 },
            { question: '下面哪个不属于服装？', options: ['裤子','上衣','手套','碗'], answer: 3 }
        ]
    },
    puzzle_shape: {
        id: 'puzzle_shape', name: '形状拼搭', icon: '🔷', category: 'puzzle',
        description: '认识基本形状，判断可以拼出什么',
        template: 'puzzle', rounds: 5, mode: 'tangram'
    },
    puzzle_color_mix: {
        id: 'puzzle_color_mix', name: '颜色混合实验', icon: '🎨', category: 'puzzle',
        description: '猜猜两种颜色混在一起会变成什么颜色',
        template: 'quiz', rounds: 8,
        data: [
            { question: '红色 + 黄色 = ？', options: ['绿色','橙色','紫色','蓝色'], answer: 1 },
            { question: '红色 + 蓝色 = ？', options: ['绿色','橙色','紫色','黄色'], answer: 2 },
            { question: '黄色 + 蓝色 = ？', options: ['绿色','橙色','紫色','红色'], answer: 0 },
            { question: '红色 + 白色 = ？', options: ['粉色','紫色','橙色','蓝色'], answer: 0 },
            { question: '黑色 + 白色 = ？', options: ['红色','灰色','蓝色','绿色'], answer: 1 },
            { question: '红色 + 绿色 = ？', options: ['紫色','蓝色','棕色','黄色'], answer: 2 },
            { question: '蓝色 + 白色 = ？', options: ['浅蓝','紫色','深蓝','绿色'], answer: 0 },
            { question: '黄色 + 白色 = ？', options: ['橙色','浅黄','绿色','粉色'], answer: 1 }
        ]
    },
    puzzle_direction: {
        id: 'puzzle_direction', name: '方向辨别', icon: '🧭', category: 'puzzle',
        description: '判断东南西北方向',
        template: 'quiz', rounds: 8,
        data: [
            { question: '太阳从哪个方向升起？', options: ['东','南','西','北'], answer: 0 },
            { question: '太阳从哪个方向落下？', options: ['东','南','西','北'], answer: 2 },
            { question: '面向北方时，右手边是？', options: ['东','南','西','北'], answer: 0 },
            { question: '面向东方时，左手边是？', options: ['东','南','西','北'], answer: 2 },
            { question: '地图上通常上面是哪个方向？', options: ['东','南','西','北'], answer: 3 },
            { question: '面向南方时，背后是？', options: ['东','南','西','北'], answer: 3 },
            { question: '指南针的N指向哪个方向？', options: ['东','南','西','北'], answer: 3 },
            { question: '面向西方时，右手边是？', options: ['东','南','西','北'], answer: 3 }
        ]
    },
    puzzle_space: {
        id: 'puzzle_space', name: '空间想象力', icon: '🌐', category: 'puzzle',
        description: '锻炼空间思维能力',
        template: 'quiz', rounds: 8,
        data: [
            { question: '正方体有几个面？', options: ['4个','5个','6个','8个'], answer: 2 },
            { question: '长方体有几条棱？', options: ['8条','10条','12条','6条'], answer: 2 },
            { question: '球从哪个方向看都是什么形状？', options: ['正方形','三角形','圆形','长方形'], answer: 2 },
            { question: '圆柱体从上面看是什么形状？', options: ['正方形','三角形','圆形','长方形'], answer: 2 },
            { question: '把正方形对折一次，可能得到什么形状？', options: ['三角形','长方形','圆形','梯形'], answer: 1 },
            { question: '一个正方体有几条棱？', options: ['6条','8条','10条','12条'], answer: 3 },
            { question: '三角形有几条高？', options: ['1条','2条','3条','4条'], answer: 2 },
            { question: '圆锥的底面是什么形状？', options: ['正方形','三角形','圆形','长方形'], answer: 2 }
        ]
    },
    puzzle_circuit: {
        id: 'puzzle_circuit', name: '电路连接', icon: '💡', category: 'puzzle',
        description: '判断灯泡是否会亮',
        template: 'quiz', rounds: 6,
        data: [
            { question: '电池+导线+灯泡正确连接，灯泡会？', options: ['亮','不亮','爆炸','没反应'], answer: 0 },
            { question: '电路断开（开关断开）时，灯泡会？', options: ['亮','不亮','变暗','闪烁'], answer: 1 },
            { question: '两节电池串联，灯泡会？', options: ['更暗','不变','更亮','不亮'], answer: 2 },
            { question: '导线不经过灯泡直接连电池两端会？', options: ['正常','短路','灯泡更亮','没变化'], answer: 1 },
            { question: '两个灯泡串联，一个坏了另一个？', options: ['还亮','也不亮','变亮','闪烁'], answer: 1 },
            { question: '下面哪个是导体？', options: ['塑料','橡胶','铁丝','木头'], answer: 2 }
        ]
    },

    /* ===== 2. 记忆类 memory ===== */
    memory_animal: {
        id: 'memory_animal', name: '翻牌配对·动物', icon: '🐾', category: 'memory',
        description: '翻开卡牌找到相同的动物配对',
        template: 'memory', rounds: 1, pairs: 6,
        data: ['🐶','🐱','🐰','🐻','🐼','🦊','🐸','🐵','🦁','🐯','🐨','🐮']
    },
    memory_fruit: {
        id: 'memory_fruit', name: '翻牌配对·水果', icon: '🍎', category: 'memory',
        description: '翻开卡牌找到相同的水果配对',
        template: 'memory', rounds: 1, pairs: 6,
        data: ['🍎','🍊','🍋','🍇','🍓','🍑','🍒','🥝','🍌','🍉','🥭','🍍']
    },
    memory_flag: {
        id: 'memory_flag', name: '翻牌配对·国旗', icon: '🏳️', category: 'memory',
        description: '翻开卡牌找到相同的国旗配对',
        template: 'memory', rounds: 1, pairs: 6,
        data: ['🇨🇳','🇺🇸','🇯🇵','🇬🇧','🇫🇷','🇰🇷','🇩🇪','🇧🇷','🇮🇹','🇪🇸','🇦🇺','🇨🇦']
    },
    memory_number: {
        id: 'memory_number', name: '翻牌配对·数字', icon: '🔢', category: 'memory',
        description: '翻开卡牌找到相同的数字配对',
        template: 'memory', rounds: 1, pairs: 8,
        data: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']
    },
    memory_shape_flash: {
        id: 'memory_shape_flash', name: '记忆闪现·图形', icon: '🔷', category: 'memory',
        description: '快速记忆闪现的图形序列',
        template: 'memory', rounds: 8, flash: true,
        data: ['🔴','🔵','🟢','🟡','🟣','🟠']
    },
    memory_color_seq: {
        id: 'memory_color_seq', name: '记忆闪现·颜色序列', icon: '🌈', category: 'memory',
        description: '记住颜色的出现顺序',
        template: 'memory', rounds: 8, flash: true,
        data: ['❤️','💙','💚','💛','💜','🧡']
    },
    memory_num_seq: {
        id: 'memory_num_seq', name: '记忆闪现·数字序列', icon: '🔢', category: 'memory',
        description: '记住数字的出现顺序',
        template: 'memory', rounds: 8, flash: true,
        data: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣']
    },
    memory_letter_seq: {
        id: 'memory_letter_seq', name: '记忆闪现·字母序列', icon: '🔤', category: 'memory',
        description: '记住字母的出现顺序',
        template: 'memory', rounds: 8, flash: true,
        data: ['A','B','C','D','E','F','G','H']
    },
    memory_position: {
        id: 'memory_position', name: '记忆大师·位置', icon: '📍', category: 'memory',
        description: '记住物品出现的位置',
        template: 'memory', rounds: 6, flash: true,
        data: ['⬆️','⬇️','⬅️','➡️','↗️','↙️']
    },
    memory_sound: {
        id: 'memory_sound', name: '听音记忆', icon: '🔔', category: 'memory',
        description: '记住听到的声音顺序',
        template: 'memory', rounds: 6, flash: true,
        data: ['🔔','🎵','🎶','🎹','🎺','🥁']
    },
    memory_puzzle: {
        id: 'memory_puzzle', name: '记忆拼图', icon: '🧩', category: 'memory',
        description: '记住图案然后还原',
        template: 'memory', rounds: 6, flash: true,
        data: ['🟦','🟥','🟨','🟩','⬜','⬛']
    },
    memory_list: {
        id: 'memory_list', name: '物品记忆清单', icon: '📝', category: 'memory',
        description: '记住清单上的物品',
        template: 'memory', rounds: 6, flash: true,
        data: ['🍎','📚','⚽','🎸','🐰','🚗']
    },
    memory_pic_recall: {
        id: 'memory_pic_recall', name: '图片记忆回忆', icon: '🖼️', category: 'memory',
        description: '看图后回忆看到的物品',
        template: 'memory', rounds: 6, flash: true,
        data: ['🌻','🌈','🦋','🐟','🌙','⭐']
    },
    memory_seq_challenge: {
        id: 'memory_seq_challenge', name: '序列记忆挑战', icon: '🏆', category: 'memory',
        description: '挑战越来越长的序列记忆',
        template: 'memory', rounds: 8, flash: true,
        data: ['🔴','🔵','🟢','🟡','🟣','🟠','⬛','⬜']
    },
    memory_multi: {
        id: 'memory_multi', name: '多感官记忆', icon: '✨', category: 'memory',
        description: '同时记忆多种信息',
        template: 'memory', rounds: 6, flash: true,
        data: ['🍎','🐶','🎵','❤️','⭐','🏠']
    },

    /* ===== 3. 反应类 reaction ===== */
    reaction_whack: {
        id: 'reaction_whack', name: '打地鼠', icon: '🐹', category: 'reaction',
        description: '快速点击冒出来的地鼠！',
        template: 'click', rounds: 1, targetCount: 15,
        targetEmoji: '🐹', decoyEmojis: ['🌿','🌸','🍄']
    },
    reaction_catch_fruit: {
        id: 'reaction_catch_fruit', name: '接水果', icon: '🍎', category: 'reaction',
        description: '快速点击掉落的水果得分！',
        template: 'click', rounds: 1, targetCount: 20,
        targetEmoji: '🍎', decoyEmojis: ['💣','🍂','🐛']
    },
    reaction_color: {
        id: 'reaction_color', name: '颜色反应测试', icon: '🎨', category: 'reaction',
        description: '看到颜色快速做出正确反应',
        template: 'quiz', rounds: 10, timeLimit: 30,
        data: [
            { question: '字是红色的，请点击"红色"', options: ['红色','蓝色','绿色','黄色'], answer: 0 },
            { question: '字是蓝色的，请点击"蓝色"', options: ['红色','蓝色','绿色','黄色'], answer: 1 },
            { question: '字是绿色的，请点击"绿色"', options: ['红色','蓝色','绿色','黄色'], answer: 2 },
            { question: '字是黄色的，请点击"黄色"', options: ['红色','蓝色','绿色','黄色'], answer: 3 },
            { question: '字是红色的，请点击"红色"', options: ['红色','蓝色','绿色','黄色'], answer: 0 },
            { question: '字是绿色的，请点击"绿色"', options: ['红色','蓝色','绿色','黄色'], answer: 2 },
            { question: '字是黄色的，请点击"黄色"', options: ['红色','蓝色','绿色','黄色'], answer: 3 },
            { question: '字是蓝色的，请点击"蓝色"', options: ['红色','蓝色','绿色','黄色'], answer: 1 },
            { question: '字是红色的，请点击"红色"', options: ['红色','蓝色','绿色','黄色'], answer: 0 },
            { question: '字是绿色的，请点击"绿色"', options: ['红色','蓝色','绿色','黄色'], answer: 2 }
        ]
    },
    reaction_fast_click: {
        id: 'reaction_fast_click', name: '快速点击目标', icon: '🎯', category: 'reaction',
        description: '尽可能快速点击出现的目标',
        template: 'click', rounds: 1, targetCount: 20,
        targetEmoji: '🎯', decoyEmojis: ['❌','💀','🚫']
    },
    reaction_speed: {
        id: 'reaction_speed', name: '反应速度测试', icon: '⚡', category: 'reaction',
        description: '看到信号后尽快点击！测试反应速度',
        template: 'click', rounds: 1, targetCount: 10,
        targetEmoji: '⚡', decoyEmojis: []
    },
    reaction_dodge: {
        id: 'reaction_dodge', name: '避障小游戏', icon: '🏃', category: 'reaction',
        description: '快速点击避开障碍物',
        template: 'click', rounds: 1, targetCount: 15,
        targetEmoji: '⭐', decoyEmojis: ['💣','🔥','💀']
    },
    reaction_rhythm: {
        id: 'reaction_rhythm', name: '节奏拍拍', icon: '🥁', category: 'reaction',
        description: '跟着节奏拍打！',
        template: 'music', rounds: 5, mode: 'rhythm'
    },
    reaction_link: {
        id: 'reaction_link', name: '限时连连看', icon: '🔗', category: 'reaction',
        description: '在限时内找出所有配对',
        template: 'memory', rounds: 1, pairs: 6, timeLimit: 60,
        data: ['🐶','🐱','🐰','🐻','🐼','🦊','🐸','🐵','🦁','🐯']
    },
    reaction_bounce: {
        id: 'reaction_bounce', name: '疯狂弹球', icon: '⚽', category: 'reaction',
        description: '点击弹跳的球得分！',
        template: 'click', rounds: 1, targetCount: 20,
        targetEmoji: '⚽', decoyEmojis: ['🏀','🏐','💣']
    },
    reaction_judge: {
        id: 'reaction_judge', name: '快速判断对错', icon: '✅', category: 'reaction',
        description: '快速判断题目对还是错',
        template: 'quiz', rounds: 10, timeLimit: 30,
        data: [
            { question: '1+1=2？', options: ['对','错','不知道','也许是'], answer: 0 },
            { question: '3×7=22？', options: ['对','错','不知道','也许是'], answer: 1 },
            { question: '太阳从西边升起？', options: ['对','错','不知道','也许是'], answer: 1 },
            { question: '一年有12个月？', options: ['对','错','不知道','也许是'], answer: 0 },
            { question: '鲸鱼是鱼类？', options: ['对','错','不知道','也许是'], answer: 1 },
            { question: '地球是圆的？', options: ['对','错','不知道','也许是'], answer: 0 },
            { question: '水的化学式是H2O？', options: ['对','错','不知道','也许是'], answer: 0 },
            { question: '月球自己会发光？', options: ['对','错','不知道','也许是'], answer: 1 },
            { question: '中国的首都是上海？', options: ['对','错','不知道','也许是'], answer: 1 },
            { question: '声音在真空中可以传播？', options: ['对','错','不知道','也许是'], answer: 1 }
        ]
    },

    /* ===== 4. 数学类 math ===== */
    math_add: {
        id: 'math_add', name: '加法速算', icon: '➕', category: 'math',
        description: '快速计算加法题目',
        template: 'math', rounds: 10, generator: 'add', maxNum: 20
    },
    math_sub: {
        id: 'math_sub', name: '减法速算', icon: '➖', category: 'math',
        description: '快速计算减法题目',
        template: 'math', rounds: 10, generator: 'sub', maxNum: 20
    },
    math_mul: {
        id: 'math_mul', name: '乘法口诀', icon: '✖️', category: 'math',
        description: '练习乘法口诀表',
        template: 'math', rounds: 10, generator: 'mul'
    },
    math_div: {
        id: 'math_div', name: '除法练习', icon: '➗', category: 'math',
        description: '练习除法计算',
        template: 'math', rounds: 10, generator: 'div'
    },
    math_mix: {
        id: 'math_mix', name: '混合运算', icon: '🧮', category: 'math',
        description: '加减乘除混合运算练习',
        template: 'math', rounds: 10, generator: 'mix', maxNum: 20
    },
    math_compare: {
        id: 'math_compare', name: '比大小', icon: '⚖️', category: 'math',
        description: '比较两个数字的大小',
        template: 'math', rounds: 10, generator: 'compare', mode: 'compare', maxNum: 100
    },
    math_chain: {
        id: 'math_chain', name: '数字接龙', icon: '🔗', category: 'math',
        description: '按照规则接龙数字',
        template: 'quiz', rounds: 8,
        data: [
            { question: '从1开始，每次加3，第3个数是？', options: ['7','8','9','10'], answer: 0 },
            { question: '从2开始，每次乘2，第3个数是？', options: ['4','6','8','10'], answer: 2 },
            { question: '从5开始，每次减1，第4个数是？', options: ['2','3','4','1'], answer: 0 },
            { question: '从1开始，每次加5，第4个数是？', options: ['16','17','18','19'], answer: 0 },
            { question: '从10开始，每次减2，第3个数是？', options: ['4','5','6','8'], answer: 2 },
            { question: '从3开始，每次加3，第5个数是？', options: ['15','16','17','18'], answer: 0 },
            { question: '从1开始，每次加前一个数（斐波那契），第5个数是？', options: ['5','6','7','8'], answer: 0 },
            { question: '从100开始，每次减25，第3个数是？', options: ['25','50','75','0'], answer: 1 }
        ]
    },
    math_ten: {
        id: 'math_ten', name: '凑十游戏', icon: '🔟', category: 'math',
        description: '快速算出凑十的数',
        template: 'math', rounds: 10, generator: 'ten', mode: 'fill'
    },
    math_seq: {
        id: 'math_seq', name: '数学接龙', icon: '🔢', category: 'math',
        description: '找出数学序列的规律',
        template: 'puzzle', rounds: 8, mode: 'pattern'
    },
    math_fill: {
        id: 'math_fill', name: '算式填空', icon: '📝', category: 'math',
        description: '填写算式中缺少的数字',
        template: 'math', rounds: 10, generator: 'add', mode: 'fill', maxNum: 20
    },
    math_clock: {
        id: 'math_clock', name: '时钟认读', icon: '🕐', category: 'math',
        description: '看时钟写出正确时间',
        template: 'math', rounds: 8, generator: 'clock', mode: 'fill'
    },
    math_money: {
        id: 'math_money', name: '人民币计算', icon: '💰', category: 'math',
        description: '练习人民币的加减计算',
        template: 'math', rounds: 5, generator: 'money'
    },
    math_shape_count: {
        id: 'math_shape_count', name: '图形计数', icon: '📊', category: 'math',
        description: '数一数有多少个图形',
        template: 'math', rounds: 8, generator: 'shape'
    },
    math_word: {
        id: 'math_word', name: '数学应用题', icon: '📖', category: 'math',
        description: '用数学解决生活中的问题',
        template: 'math', rounds: 6, generator: 'money'
    },
    math_fraction: {
        id: 'math_fraction', name: '分数比大小', icon: '🥧', category: 'math',
        description: '比较两个分数的大小',
        template: 'math', rounds: 8, generator: 'fraction', mode: 'compare'
    },

    /* ===== 5. 语文类 chinese ===== */
    chinese_idiom_fill: {
        id: 'chinese_idiom_fill', name: '成语填字', icon: '📖', category: 'chinese',
        description: '填写成语中缺少的字',
        template: 'word', rounds: 10, mode: 'fill',
        data: [
            { question: '____高水长', options: ['山','水','天','云'], answer: 0 },
            { question: '一心____意', options: ['一','二','三','四'], answer: 1 },
            { question: '____高采烈', options: ['心','情','兴','神'], answer: 2 },
            { question: '画龙____睛', options: ['点','画','描','看'], answer: 0 },
            { question: '守株____兔', options: ['等','待','看','捉'], answer: 1 },
            { question: '____公移山', options: ['愚','老','大','神'], answer: 0 },
            { question: '____假虎威', options: ['狼','狐','猫','狗'], answer: 1 },
            { question: '亡羊____牢', options: ['建','修','补','造'], answer: 2 },
            { question: '____苗助长', options: ['拔','拉','扯','推'], answer: 0 },
            { question: '对牛____琴', options: ['弹','拉','吹','打'], answer: 0 }
        ]
    },
    chinese_idiom_pic: {
        id: 'chinese_idiom_pic', name: '看图猜成语', icon: '🖼️', category: 'chinese',
        description: '看表情提示猜出成语',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '🐯 🦊 → 什么成语？', options: ['狐假虎威','虎头蛇尾','龙争虎斗','如虎添翼'], answer: 0 },
            { question: '🐸 🕳️ 🌊 → 什么成语？', options: ['井底之蛙','坐井观天','画蛇添足','杯弓蛇影'], answer: 1 },
            { question: '🐎 ➡️ 🌸 → 什么成语？', options: ['走马观花','马到成功','一马当先','万马奔腾'], answer: 0 },
            { question: '🐟 💧 → 什么成语？', options: ['如鱼得水','鱼目混珠','鱼跃龙门','浑水摸鱼'], answer: 0 },
            { question: '🐦 🏹 → 什么成语？', options: ['惊弓之鸟','鸟语花香','百鸟朝凤','一箭双雕'], answer: 0 },
            { question: '🐑 🐺 → 什么成语？', options: ['亡羊补牢','羊入虎口','顺手牵羊','挂羊头卖狗肉'], answer: 1 },
            { question: '🌙 ⭐ → 什么成语？', options: ['披星戴月','日月星辰','星月交辉','花好月圆'], answer: 2 },
            { question: '🐉 🐯 → 什么成语？', options: ['龙飞凤舞','龙争虎斗','卧虎藏龙','生龙活虎'], answer: 1 }
        ]
    },
    chinese_poem: {
        id: 'chinese_poem', name: '古诗词填空', icon: '📜', category: 'chinese',
        description: '填写古诗名句中缺少的字',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '春眠不觉晓，处处闻____鸟', options: ['啼','叫','鸣','唱'], answer: 0 },
            { question: '床前明月光，疑是地上____', options: ['霜','雪','冰','露'], answer: 0 },
            { question: '锄禾日当午，汗滴禾____土', options: ['下','中','里','入'], answer: 0 },
            { question: '白日依山尽，黄河入____流', options: ['海','江','河','湖'], answer: 0 },
            { question: '举头望明月，低头思____乡', options: ['故','家','老','旧'], answer: 0 },
            { question: '日照香炉生紫烟，遥看瀑布挂____川', options: ['前','山','长','远'], answer: 0 },
            { question: '两个黄鹂鸣翠柳，一行白鹭上____天', options: ['青','蓝','碧','晴'], answer: 0 },
            { question: '欲穷千里目，更上一层____', options: ['楼','台','阁','塔'], answer: 0 }
        ]
    },
    chinese_stroke: {
        id: 'chinese_stroke', name: '汉字笔顺', icon: '✍️', category: 'chinese',
        description: '判断汉字的笔画数',
        template: 'word', rounds: 8, mode: 'stroke',
        data: [
            { word: '大', options: [2,3,4,5], answer: 1 },
            { word: '小', options: [2,3,4,5], answer: 1 },
            { word: '人', options: [1,2,3,4], answer: 1 },
            { word: '山', options: [2,3,4,5], answer: 1 },
            { word: '水', options: [3,4,5,6], answer: 1 },
            { word: '天', options: [3,4,5,6], answer: 1 },
            { word: '学', options: [6,7,8,9], answer: 2 },
            { word: '国', options: [6,7,8,9], answer: 2 }
        ]
    },
    chinese_homophone: {
        id: 'chinese_homophone', name: '同音字辨析', icon: '🔊', category: 'chinese',
        description: '区分同音字的不同用法',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '我在（做/作）作业', options: ['做','作','左','坐'], answer: 0 },
            { question: '春天来了，花儿（在/再）开', options: ['在','再','载','栽'], answer: 0 },
            { question: '妈妈给我买了一个（新/心）书包', options: ['新','心','薪','辛'], answer: 0 },
            { question: '上课时要（座/坐）端正', options: ['座','坐','做','作'], answer: 1 },
            { question: '小（明/名）是个好学生', options: ['明','名','鸣','铭'], answer: 0 },
            { question: '（已/以）经写完了', options: ['已','以','乙','亦'], answer: 0 },
            { question: '他（像/向）一棵大树', options: ['像','向','象','相'], answer: 0 },
            { question: '老师给我打了一（偏/篇）好评语', options: ['偏','篇','便','变'], answer: 1 }
        ]
    },
    chinese_synonym: {
        id: 'chinese_synonym', name: '近义词连线', icon: '🔗', category: 'chinese',
        description: '找出意思相近的词语',
        template: 'matching', rounds: 8, prompt: '找出近义词配对',
        data: [
            ['快乐','开心'],['漂亮','美丽'],['忽然','突然'],['仔细','认真'],
            ['温暖','暖和'],['帮助','帮忙'],['简单','容易'],['勇敢','英勇'],
            ['高兴','喜悦'],['慢慢','缓缓'],['马上','立刻'],['非常','十分'],
            ['困难','艰难'],['明白','清楚'],['热闹','喧闹'],['喜欢','喜爱']
        ]
    },
    chinese_antonym: {
        id: 'chinese_antonym', name: '反义词配对', icon: '↔️', category: 'chinese',
        description: '找出意思相反的词语',
        template: 'matching', rounds: 8, prompt: '找出反义词配对',
        data: [
            ['大','小'],['高','矮'],['长','短'],['快','慢'],
            ['多','少'],['冷','热'],['黑','白'],['胖','瘦'],
            ['开','关'],['来','去'],['前','后'],['左','右'],
            ['新','旧'],['轻','重'],['安全','危险'],['快乐','悲伤']
        ]
    },
    chinese_word_chain: {
        id: 'chinese_word_chain', name: '词语接龙', icon: '🔤', category: 'chinese',
        description: '用上一个词的最后一个字开头接龙',
        template: 'quiz', rounds: 8,
        data: [
            { question: '"学校"后面接什么？', options: ['校园','校长','学习','校门'], answer: 0 },
            { question: '"花园"后面接什么？', options: ['花园','园丁','花朵','园艺'], answer: 1 },
            { question: '"天空"后面接什么？', options: ['空气','空间','空白','天空'], answer: 1 },
            { question: '"手机"后面接什么？', options: ['机器','手机','机会','机动'], answer: 0 },
            { question: '"书包"后面接什么？', options: ['书包','包装','包装','包裹'], answer: 1 },
            { question: '"果树"后面接什么？', options: ['树木','树叶','果实','果园'], answer: 0 },
            { question: '"海洋"后面接什么？', options: ['海洋','洋娃娃','洋洋','洋溢'], answer: 1 },
            { question: '"音乐"后面接什么？', options: ['音乐','乐观','乐器','乐谱'], answer: 1 }
        ]
    },
    chinese_sentence_order: {
        id: 'chinese_sentence_order', name: '句子排序', icon: '📋', category: 'chinese',
        description: '把打乱的词语排成正确的句子',
        template: 'sorting', rounds: 6,
        data: [
            { prompt: '排成正确的句子', items: ['我爱','学习','语文'] },
            { prompt: '排成正确的句子', items: ['春天','花儿','开了','美丽'] },
            { prompt: '排成正确的句子', items: ['我的','妈妈','是一名','老师'] },
            { prompt: '排成正确的句子', items: ['我们','应该','保护','环境'] },
            { prompt: '排成正确的句子', items: ['小明','在','教室里','读书'] },
            { prompt: '排成正确的句子', items: ['今天','天气','很好','阳光明媚'] }
        ]
    },
    chinese_radical: {
        id: 'chinese_radical', name: '偏旁部首归类', icon: '📝', category: 'chinese',
        description: '按照偏旁部首给汉字分类',
        template: 'word', rounds: 6, mode: 'radical',
        data: [
            { radical: '氵', words: ['河','海','江'], decoys: ['林','草'] },
            { radical: '木', words: ['树','林','森'], decoys: ['河','说'] },
            { radical: '火', words: ['烧','烤','灯'], decoys: ['冰','树'] },
            { radical: '亻', words: ['你','他','们'], decoys: ['河','山'] },
            { radical: '口', words: ['唱','吃','喝'], decoys: ['跑','跳'] },
            { radical: '扌', words: ['打','拍','拉'], decoys: ['说','想'] }
        ]
    },
    chinese_structure: {
        id: 'chinese_structure', name: '汉字结构分析', icon: '🏗️', category: 'chinese',
        description: '分析汉字的结构类型',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '「明」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 0 },
            { question: '「尖」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 1 },
            { question: '「国」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 3 },
            { question: '「人」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 2 },
            { question: '「好」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 0 },
            { question: '「花」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 1 },
            { question: '「回」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 3 },
            { question: '「水」是什么结构的字？', options: ['左右结构','上下结构','独体字','包围结构'], answer: 2 }
        ]
    },
    chinese_measure: {
        id: 'chinese_measure', name: '量词填空', icon: '📏', category: 'chinese',
        description: '填写正确的量词',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '一（  ）花', options: ['朵','只','条','个'], answer: 0 },
            { question: '一（  ）鱼', options: ['朵','只','条','个'], answer: 2 },
            { question: '一（  ）书', options: ['本','只','条','个'], answer: 0 },
            { question: '一（  ）猫', options: ['本','只','条','个'], answer: 1 },
            { question: '一（  ）河', options: ['本','只','条','个'], answer: 2 },
            { question: '三（  ）树', options: ['棵','只','条','个'], answer: 0 },
            { question: '一（  ）帽子', options: ['顶','只','条','个'], answer: 0 },
            { question: '一（  ）衣服', options: ['条','件','个','双'], answer: 1 }
        ]
    },
    chinese_punct: {
        id: 'chinese_punct', name: '标点符号练习', icon: '❓', category: 'chinese',
        description: '选择正确的标点符号',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '你今天去学校吗___', options: ['。','？','！','，'], answer: 1 },
            { question: '我太开心了___', options: ['。','？','！','，'], answer: 2 },
            { question: '春天来了___花儿开了', options: ['。','？','！','，'], answer: 3 },
            { question: '我的名字叫小明___', options: ['。','？','！','，'], answer: 0 },
            { question: '蓝天___白云___红太阳', options: ['。','？','！','、'], answer: 3 },
            { question: '你吃饭了吗___', options: ['。','？','！','，'], answer: 1 },
            { question: '太好看了___', options: ['。','？','！','，'], answer: 2 },
            { question: '我喜欢吃苹果___香蕉和橘子', options: ['。','？','！','、'], answer: 3 }
        ]
    },
    chinese_pinyin: {
        id: 'chinese_pinyin', name: '拼音认读', icon: '🔤', category: 'chinese',
        description: '选择正确的拼音',
        template: 'word', rounds: 8, mode: 'pinyin',
        data: [
            { word: '你好', options: ['nǐ hǎo','nǐ háo','ní hǎo','ní háo'], answer: 0 },
            { word: '学校', options: ['xué xiào','xuě xiào','xié xiào','xuě jiào'], answer: 0 },
            { word: '朋友', options: ['péng you','pén you','pēng you','péng yǒu'], answer: 0 },
            { word: '老师', options: ['lǎo shī','láo shī','lǎo sī','láoshī'], answer: 0 },
            { word: '快乐', options: ['kuài lè','kuǎi lè','kuài lě','kuài lē'], answer: 0 },
            { word: '学习', options: ['xué xí','xuě xí','xié xí','xué xì'], answer: 0 },
            { word: '太阳', options: ['tài yáng','dài yáng','tài yán','dài yán'], answer: 0 },
            { word: '读书', options: ['dú shū','dù shū','dú sū','tú shū'], answer: 0 }
        ]
    },
    chinese_typo: {
        id: 'chinese_typo', name: '错别字找茬', icon: '🔎', category: 'chinese',
        description: '找出句子中的错别字',
        template: 'word', rounds: 8, mode: 'fill',
        data: [
            { question: '哪个字是错的？我每天都跑步断练身体', options: ['跑','步','断','身'], answer: 2 },
            { question: '哪个字是错的？他是我们的班张', options: ['他','是','班','张'], answer: 3 },
            { question: '哪个字是错的？妈妈给我买了新衣服', options: ['全对','买','新','衣'], answer: 0 },
            { question: '哪个字是错的？今天天气情朗', options: ['今','天','情','朗'], answer: 2 },
            { question: '哪个字是错的？他学习很用公', options: ['他','学','用','公'], answer: 3 },
            { question: '哪个字是错的？小学生在做作叶', options: ['小','在','作','叶'], answer: 3 },
            { question: '哪个字是错的？这个答安不对', options: ['这','答','安','对'], answer: 2 },
            { question: '哪个字是错的？我们要保护换境', options: ['我','保','护','换'], answer: 3 }
        ]
    },

    /* ===== 6. 音乐类 music ===== */
    music_piano: {
        id: 'music_piano', name: '钢琴模拟器', icon: '🎹', category: 'music',
        description: '点击琴键弹奏美妙的音乐',
        template: 'music', rounds: 1, mode: 'piano'
    },
    music_drum: {
        id: 'music_drum', name: '鼓点节奏', icon: '🥁', category: 'music',
        description: '跟着节奏敲鼓！',
        template: 'music', rounds: 5, mode: 'rhythm'
    },
    music_scale: {
        id: 'music_scale', name: '音阶练习', icon: '🎵', category: 'music',
        description: '按照正确的顺序点击音阶',
        template: 'music', rounds: 4, mode: 'scale'
    },
    music_pitch: {
        id: 'music_pitch', name: '听音辨高低', icon: '👂', category: 'music',
        description: '听两个音，辨别哪个更高',
        template: 'music', rounds: 8, mode: 'pitch'
    },
    music_instrument: {
        id: 'music_instrument', name: '乐器听辨', icon: '🎻', category: 'music',
        description: '听声音辨别是什么乐器',
        template: 'quiz', rounds: 6,
        data: [
            { question: '哪种乐器被称为"乐器之王"？', options: ['钢琴','小提琴','吉他','鼓'], answer: 0 },
            { question: '二胡是哪个国家的乐器？', options: ['日本','中国','韩国','印度'], answer: 1 },
            { question: '吉他有几根弦？', options: ['4根','5根','6根','8根'], answer: 2 },
            { question: '下面哪个是打击乐器？', options: ['小号','鼓','长笛','小提琴'], answer: 1 },
            { question: '钢琴一共有几个键？', options: ['66个','77个','88个','99个'], answer: 2 },
            { question: '下面哪个是弦乐器？', options: ['小号','鼓','小提琴','长笛'], answer: 2 }
        ]
    },
    music_rhythm_copy: {
        id: 'music_rhythm_copy', name: '节奏模仿', icon: '👏', category: 'music',
        description: '听一段节奏然后模仿',
        template: 'music', rounds: 5, mode: 'rhythm'
    },
    music_memory: {
        id: 'music_memory', name: '音乐记忆', icon: '🎼', category: 'music',
        description: '记住旋律的顺序',
        template: 'music', rounds: 6, mode: 'pitch'
    },
    music_score: {
        id: 'music_score', name: '简谱演奏', icon: '🎼', category: 'music',
        description: '看着简谱弹奏音符',
        template: 'music', rounds: 4, mode: 'scale'
    },
    music_sound_guess: {
        id: 'music_sound_guess', name: '声音猜猜猜', icon: '🔊', category: 'music',
        description: '听声音猜猜是什么',
        template: 'music', rounds: 6, mode: 'sound'
    },
    music_wheel: {
        id: 'music_wheel', name: '音乐转盘', icon: '🎡', category: 'music',
        description: '转到哪个就听哪个音符',
        template: 'music', rounds: 1, mode: 'piano'
    },

    /* ===== 7. 英语类 english ===== */
    eng_upper_lower: {
        id: 'eng_upper_lower', name: '字母大小写配对', icon: '🔤', category: 'english',
        description: '找出大小写字母的正确配对',
        template: 'matching', rounds: 8, prompt: 'Find the matching pairs',
        data: [
            ['A','a'],['B','b'],['C','c'],['D','d'],['E','e'],['F','f'],
            ['G','g'],['H','h'],['I','i'],['J','j'],['K','k'],['L','l'],
            ['M','m'],['N','n'],['O','o'],['P','p']
        ]
    },
    eng_word_pic: {
        id: 'eng_word_pic', name: '单词图片配对', icon: '🖼️', category: 'english',
        description: '把英语单词和对应的emoji配对',
        template: 'matching', rounds: 8, prompt: 'Match the word with the picture',
        data: [
            ['cat','🐱'],['dog','🐶'],['fish','🐟'],['bird','🐦'],
            ['apple','🍎'],['banana','🍌'],['sun','☀️'],['moon','🌙'],
            ['tree','🌳'],['flower','🌸'],['star','⭐'],['rain','🌧️'],
            ['book','📚'],['pen','🖊️'],['car','🚗'],['bus','🚌']
        ]
    },
    eng_alpha_order: {
        id: 'eng_alpha_order', name: '字母排序', icon: '🔠', category: 'english',
        description: '把字母按正确的顺序排列',
        template: 'sorting', rounds: 6,
        data: [
            { prompt: '按字母表顺序排列', items: ['C','A','B'] },
            { prompt: '按字母表顺序排列', items: ['E','D','F'] },
            { prompt: '按字母表顺序排列', items: ['H','G','I'] },
            { prompt: '按字母表顺序排列', items: ['L','J','K'] },
            { prompt: '按字母表顺序排列', items: ['P','N','O'] },
            { prompt: '按字母表顺序排列', items: ['S','R','T'] }
        ]
    },
    eng_color: {
        id: 'eng_color', name: '颜色英语', icon: '🎨', category: 'english',
        description: '学习颜色的英语单词',
        template: 'matching', rounds: 8, prompt: 'Match the color',
        data: [
            ['red','红色'],['blue','蓝色'],['green','绿色'],['yellow','黄色'],
            ['black','黑色'],['white','白色'],['pink','粉色'],['orange','橙色'],
            ['purple','紫色'],['brown','棕色'],['gray','灰色'],['gold','金色']
        ]
    },
    eng_animal: {
        id: 'eng_animal', name: '动物英语', icon: '🐾', category: 'english',
        description: '学习动物的英语单词',
        template: 'matching', rounds: 8, prompt: 'Match the animal',
        data: [
            ['cat','猫'],['dog','狗'],['bird','鸟'],['fish','鱼'],
            ['rabbit','兔子'],['horse','马'],['cow','牛'],['pig','猪'],
            ['duck','鸭子'],['chicken','鸡'],['sheep','羊'],['monkey','猴子']
        ]
    },
    eng_number: {
        id: 'eng_number', name: '数字英语', icon: '🔢', category: 'english',
        description: '学习数字的英语单词',
        template: 'matching', rounds: 8, prompt: 'Match the number',
        data: [
            ['one','1'],['two','2'],['three','3'],['four','4'],
            ['five','5'],['six','6'],['seven','7'],['eight','8'],
            ['nine','9'],['ten','10'],['eleven','11'],['twelve','12']
        ]
    },
    eng_fruit: {
        id: 'eng_fruit', name: '水果英语', icon: '🍎', category: 'english',
        description: '学习水果的英语单词',
        template: 'matching', rounds: 8, prompt: 'Match the fruit',
        data: [
            ['apple','苹果'],['banana','香蕉'],['orange','橙子'],['grape','葡萄'],
            ['pear','梨'],['peach','桃子'],['watermelon','西瓜'],['strawberry','草莓'],
            ['mango','芒果'],['cherry','樱桃'],['lemon','柠檬'],['pineapple','菠萝']
        ]
    },
    eng_body: {
        id: 'eng_body', name: '身体部位英语', icon: '🧍', category: 'english',
        description: '学习身体部位的英语单词',
        template: 'matching', rounds: 8, prompt: 'Match the body part',
        data: [
            ['head','头'],['hand','手'],['foot','脚'],['eye','眼睛'],
            ['ear','耳朵'],['nose','鼻子'],['mouth','嘴巴'],['arm','手臂'],
            ['leg','腿'],['hair','头发'],['face','脸'],['finger','手指']
        ]
    },
    eng_spelling: {
        id: 'eng_spelling', name: '英语单词拼写', icon: '✏️', category: 'english',
        description: '选择正确的单词拼写',
        template: 'quiz', rounds: 8,
        data: [
            { question: '猫的英语怎么拼写？', options: ['cat','car','cap','cut'], answer: 0 },
            { question: '狗的英语怎么拼写？', options: ['dag','dog','dig','dug'], answer: 1 },
            { question: '苹果的英语怎么拼写？', options: ['aple','appel','apple','appple'], answer: 2 },
            { question: '书的英语怎么拼写？', options: ['bok','book','bock','bouk'], answer: 1 },
            { question: '鱼的英语怎么拼写？', options: ['fich','fesh','feesh','fish'], answer: 3 },
            { question: '星星的英语怎么拼写？', options: ['star','ster','stir','stor'], answer: 0 },
            { question: '太阳的英语怎么拼写？', options: ['son','sun','san','sen'], answer: 1 },
            { question: '红色的英语怎么拼写？', options: ['rad','red','rid','rod'], answer: 1 }
        ]
    },
    eng_sentence: {
        id: 'eng_sentence', name: '英语句子排序', icon: '📝', category: 'english',
        description: '把英语单词排成正确的句子',
        template: 'sorting', rounds: 6,
        data: [
            { prompt: 'Arrange the sentence', items: ['I','am','a','student'] },
            { prompt: 'Arrange the sentence', items: ['She','is','my','friend'] },
            { prompt: 'Arrange the sentence', items: ['The','cat','is','big'] },
            { prompt: 'Arrange the sentence', items: ['I','like','red','apples'] },
            { prompt: 'Arrange the sentence', items: ['We','go','to','school'] },
            { prompt: 'Arrange the sentence', items: ['He','has','a','dog'] }
        ]
    },

    /* ===== 8. 趣味互动类 fun ===== */
    fun_draw: {
        id: 'fun_draw', name: '涂色画板', icon: '🎨', category: 'fun',
        description: '自由涂色绘画，发挥创意',
        template: 'draw', rounds: 1, mode: 'free'
    },
    fun_emoji: {
        id: 'fun_emoji', name: '表情包DIY', icon: '😀', category: 'fun',
        description: '用emoji组合创造有趣的表情',
        template: 'draw', rounds: 1, mode: 'coloring', targetEmoji: '😀'
    },
    fun_wheel: {
        id: 'fun_wheel', name: '幸运转盘', icon: '🎡', category: 'fun',
        description: '转动幸运转盘，看看转到什么',
        template: 'quiz', rounds: 5,
        data: [
            { question: '🎡 转盘结果：今天谁来回答问题？', options: ['第1组','第2组','第3组','第4组'], answer: 0 },
            { question: '🎡 转盘结果：今天学什么？', options: ['语文','数学','英语','音乐'], answer: 1 },
            { question: '🎡 转盘结果：奖励是什么？', options: ['小红花','表扬信','加分','贴纸'], answer: 2 },
            { question: '🎡 转盘结果：谁来表演？', options: ['小明','小红','小华','小李'], answer: 3 },
            { question: '🎡 转盘结果：课间玩什么？', options: ['跳绳','踢球','捉迷藏','拍手歌'], answer: 0 }
        ]
    },
    fun_rps: {
        id: 'fun_rps', name: '石头剪刀布', icon: '✊', category: 'fun',
        description: '和电脑玩石头剪刀布',
        template: 'quiz', rounds: 10,
        data: [
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 0 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 1 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 2 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 0 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 1 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 2 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 0 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 1 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 2 },
            { question: '石头、剪刀、布！你出什么？', options: ['✊ 石头','✌️ 剪刀','🖐️ 布','😎 随便'], answer: 0 }
        ]
    },
    fun_guess_num: {
        id: 'fun_guess_num', name: '猜数字', icon: '🔮', category: 'fun',
        description: '猜一猜电脑想的数字是多少',
        template: 'quiz', rounds: 8,
        data: [
            { question: '猜一个1-10的数字！提示：比5大', options: ['3','7','4','2'], answer: 1 },
            { question: '猜一个1-10的数字！提示：是偶数', options: ['3','7','4','5'], answer: 2 },
            { question: '猜一个1-10的数字！提示：比3小', options: ['5','7','2','9'], answer: 2 },
            { question: '猜一个1-10的数字！提示：是奇数', options: ['2','6','8','7'], answer: 3 },
            { question: '猜一个1-10的数字！提示：等于3+4', options: ['5','7','6','8'], answer: 1 },
            { question: '猜一个1-10的数字！提示：等于10-3', options: ['5','6','7','8'], answer: 2 },
            { question: '猜一个1-10的数字！提示：比1大比3小', options: ['1','3','4','2'], answer: 3 },
            { question: '猜一个1-10的数字！提示：2×3=?', options: ['5','6','7','8'], answer: 1 }
        ]
    },
    fun_draw_guess: {
        id: 'fun_draw_guess', name: '画板猜词', icon: '🖌️', category: 'fun',
        description: '画一幅画让别人猜猜你画的是什么',
        template: 'draw', rounds: 1, mode: 'free'
    },
    fun_brain: {
        id: 'fun_brain', name: '脑筋急转弯', icon: '💡', category: 'fun',
        description: '有趣的脑筋急转弯题目',
        template: 'quiz', rounds: 8,
        data: [
            { question: '什么东西越洗越脏？', options: ['衣服','手','水','碗'], answer: 2 },
            { question: '什么门永远关不上？', options: ['房门','球门','大门','车门'], answer: 1 },
            { question: '什么东西有头无脚？', options: ['蛇','鱼','钉子','蜗牛'], answer: 2 },
            { question: '什么东西你天天看到却看不见？', options: ['太阳','空气','镜子','影子'], answer: 1 },
            { question: '什么东西有耳朵却听不见？', options: ['聋子','玉米','兔子','帽子'], answer: 1 },
            { question: '铁放到外面会生锈，金子呢？', options: ['也会生锈','不会生锈','会发光','会变暗'], answer: 1 },
            { question: '什么东西不怕布，只怕石头？', options: ['剪刀','纸','老虎','木头'], answer: 0 },
            { question: '什么时候1+1不等于2？', options: ['算错的时候','做梦的时候','什么时候都等于2','永远不会'], answer: 0 }
        ]
    },
    fun_trivia: {
        id: 'fun_trivia', name: '趣味问答', icon: '❓', category: 'fun',
        description: '有趣的百科知识问答',
        template: 'quiz', rounds: 8,
        data: [
            { question: '世界上最大的动物是什么？', options: ['大象','蓝鲸','长颈鹿','鲨鱼'], answer: 1 },
            { question: '地球上最热的地方在哪里？', options: ['沙漠','火山口','赤道','撒哈拉'], answer: 2 },
            { question: '一天有多少小时？', options: ['12','24','48','60'], answer: 1 },
            { question: '彩虹有几种颜色？', options: ['5种','6种','7种','8种'], answer: 2 },
            { question: '世界上最高的山峰是？', options: ['黄山','珠穆朗玛峰','华山','泰山'], answer: 1 },
            { question: '蜜蜂采蜜是为了做什么？', options: ['做游戏','酿蜂蜜','建房子','锻炼身体'], answer: 1 },
            { question: '一年有多少天？（平年）', options: ['360天','365天','366天','364天'], answer: 1 },
            { question: '中国的国宝动物是什么？', options: ['金丝猴','大熊猫','丹顶鹤','白鳍豚'], answer: 1 }
        ]
    },
    fun_weather: {
        id: 'fun_weather', name: '天气穿衣搭配', icon: '🌤️', category: 'fun',
        description: '根据天气选择合适的穿搭',
        template: 'quiz', rounds: 6,
        data: [
            { question: '☀️ 晴天30°C，应该穿什么？', options: ['短袖短裤','棉袄','毛衣','羽绒服'], answer: 0 },
            { question: '🌧️ 下雨天，需要带什么？', options: ['太阳镜','雨伞','帽子','围巾'], answer: 1 },
            { question: '❄️ 下雪天0°C，应该穿什么？', options: ['短袖','裙子','棉袄','凉鞋'], answer: 2 },
            { question: '💨 大风天，应该怎么做？', options: ['放风筝','躲在树下','去高处','撑伞'], answer: 0 },
            { question: '🌤️ 多云15°C，穿什么合适？', options: ['短袖','厚外套','薄外套','棉袄'], answer: 2 },
            { question: '🌪️ 台风天，应该怎么做？', options: ['出去玩','待在室内安全地方','去海边','骑车兜风'], answer: 1 }
        ]
    },
    fun_roll_call: {
        id: 'fun_roll_call', name: '班级点名小游戏', icon: '👋', category: 'fun',
        description: '趣味点名方式，让上课更有趣',
        template: 'quiz', rounds: 6,
        data: [
            { question: '🎲 随机点名！今天是哪个小组？', options: ['第1组','第2组','第3组','第4组'], answer: 0 },
            { question: '🎲 谁来朗读课文？', options: ['学号尾号1的同学','学号尾号3的同学','学号尾号5的同学','学号尾号7的同学'], answer: 1 },
            { question: '🎲 谁来回答这道题？', options: ['坐最前面的同学','坐最后面的同学','坐中间的同学','站着的同学'], answer: 2 },
            { question: '🎲 谁来做今天的值日？', options: ['第1排','第2排','第3排','第4排'], answer: 3 },
            { question: '🎲 谁来带领大家做操？', options: ['班长','学习委员','体育委员','随机一位同学'], answer: 2 },
            { question: '🎲 谁来收作业？', options: ['第1组','第2组','第3组','第4组'], answer: 0 }
        ]
    }
};
