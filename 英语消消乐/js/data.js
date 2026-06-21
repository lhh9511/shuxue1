/* =====================================================================
 * 人教版 PEP 小学英语词汇数据（三年级起点 · 2012 新课标版）
 * 结构：grades[] -> books[] -> units[] -> words[]
 *   word: { en, zh, phon? }  phon 为可选音标
 * 说明：本数据按 PEP 教材核心词汇整理，每单元精选 8 个左右重点单词，
 *       便于消消乐游戏成对配对。如需增删，直接在此文件编辑即可。
 * ===================================================================== */
window.PEP_DATA = {
  meta: {
    publisher: '人教版 PEP（三年级起点）',
    edition: '2012 新课标版',
    note: '每单元精选核心词汇，可在 data.js 中自由增删'
  },
  grades: [
    {
      id: 'g3', name: '三年级', emoji: '🐰', color: '#00b894',
      books: [
        { id: 'g3a', name: '上册', units: [
          { id: 'g3a-u1', title: 'Unit 1 Hello！', topic: '问候与文具', emoji: '👋', words: [
            { en: 'ruler', zh: '尺子', phon: 'ˈruːlə' },
            { en: 'pencil', zh: '铅笔', phon: 'ˈpensl' },
            { en: 'eraser', zh: '橡皮', phon: 'ɪˈreɪzə' },
            { en: 'crayon', zh: '蜡笔', phon: 'ˈkreɪən' },
            { en: 'bag', zh: '包', phon: 'bæɡ' },
            { en: 'pen', zh: '钢笔', phon: 'pen' },
            { en: 'book', zh: '书', phon: 'bʊk' },
            { en: 'pencil-box', zh: '文具盒' }
          ]},
          { id: 'g3a-u2', title: 'Unit 2 Colours', topic: '颜色', emoji: '🌈', words: [
            { en: 'red', zh: '红色', phon: 'red' },
            { en: 'yellow', zh: '黄色', phon: 'ˈjeləʊ' },
            { en: 'green', zh: '绿色', phon: 'ɡriːn' },
            { en: 'blue', zh: '蓝色', phon: 'bluː' },
            { en: 'black', zh: '黑色', phon: 'blæk' },
            { en: 'white', zh: '白色', phon: 'waɪt' },
            { en: 'orange', zh: '橙色', phon: 'ˈɒrɪndʒ' },
            { en: 'brown', zh: '棕色', phon: 'braʊn' }
          ]},
          { id: 'g3a-u3', title: 'Unit 3 Look at me！', topic: '身体部位', emoji: '😊', words: [
            { en: 'face', zh: '脸', phon: 'feɪs' },
            { en: 'ear', zh: '耳朵', phon: 'ɪə' },
            { en: 'eye', zh: '眼睛', phon: 'aɪ' },
            { en: 'nose', zh: '鼻子', phon: 'nəʊz' },
            { en: 'mouth', zh: '嘴', phon: 'maʊθ' },
            { en: 'arm', zh: '胳膊', phon: 'ɑːm' },
            { en: 'hand', zh: '手', phon: 'hænd' },
            { en: 'head', zh: '头', phon: 'hed' },
            { en: 'leg', zh: '腿', phon: 'leɡ' },
            { en: 'foot', zh: '脚', phon: 'fʊt' }
          ]},
          { id: 'g3a-u4', title: 'Unit 4 We love animals', topic: '动物', emoji: '🐻', words: [
            { en: 'pig', zh: '猪', phon: 'pɪɡ' },
            { en: 'bear', zh: '熊', phon: 'beə' },
            { en: 'cat', zh: '猫', phon: 'kæt' },
            { en: 'duck', zh: '鸭子', phon: 'dʌk' },
            { en: 'dog', zh: '狗', phon: 'dɒɡ' },
            { en: 'elephant', zh: '大象', phon: 'ˈelɪfənt' },
            { en: 'monkey', zh: '猴子', phon: 'ˈmʌŋki' },
            { en: 'bird', zh: '鸟', phon: 'bɜːd' },
            { en: 'tiger', zh: '老虎', phon: 'ˈtaɪɡə' },
            { en: 'panda', zh: '熊猫', phon: 'ˈpændə' }
          ]},
          { id: 'g3a-u5', title: "Unit 5 Let's eat！", topic: '食物饮料', emoji: '🍞', words: [
            { en: 'bread', zh: '面包', phon: 'bred' },
            { en: 'juice', zh: '果汁', phon: 'dʒuːs' },
            { en: 'egg', zh: '鸡蛋', phon: 'eɡ' },
            { en: 'milk', zh: '牛奶', phon: 'mɪlk' },
            { en: 'water', zh: '水', phon: 'ˈwɔːtə' },
            { en: 'cake', zh: '蛋糕', phon: 'keɪk' },
            { en: 'fish', zh: '鱼', phon: 'fɪʃ' },
            { en: 'rice', zh: '米饭', phon: 'raɪs' }
          ]},
          { id: 'g3a-u6', title: 'Unit 6 Happy birthday！', topic: '数字 1-10', emoji: '🎂', words: [
            { en: 'one', zh: '一', phon: 'wʌn' },
            { en: 'two', zh: '二', phon: 'tuː' },
            { en: 'three', zh: '三', phon: 'θriː' },
            { en: 'four', zh: '四', phon: 'fɔː' },
            { en: 'five', zh: '五', phon: 'faɪv' },
            { en: 'six', zh: '六', phon: 'sɪks' },
            { en: 'seven', zh: '七', phon: 'ˈsevn' },
            { en: 'eight', zh: '八', phon: 'eɪt' },
            { en: 'nine', zh: '九', phon: 'naɪn' },
            { en: 'ten', zh: '十', phon: 'ten' }
          ]}
        ]},
        { id: 'g3b', name: '下册', units: [
          { id: 'g3b-u1', title: 'Unit 1 Welcome back to school！', topic: '国家与身份', emoji: '🌍', words: [
            { en: 'UK', zh: '英国' },
            { en: 'Canada', zh: '加拿大', phon: 'ˈkænədə' },
            { en: 'USA', zh: '美国' },
            { en: 'China', zh: '中国', phon: 'ˈtʃaɪnə' },
            { en: 'student', zh: '学生', phon: 'ˈstjuːdnt' },
            { en: 'teacher', zh: '老师', phon: 'ˈtiːtʃə' },
            { en: 'boy', zh: '男孩', phon: 'bɔɪ' },
            { en: 'girl', zh: '女孩', phon: 'ɡɜːl' }
          ]},
          { id: 'g3b-u2', title: 'Unit 2 My family', topic: '家庭成员', emoji: '👨‍👩‍👧', words: [
            { en: 'father', zh: '父亲', phon: 'ˈfɑːðə' },
            { en: 'mother', zh: '母亲', phon: 'ˈmʌðə' },
            { en: 'dad', zh: '爸爸', phon: 'dæd' },
            { en: 'mom', zh: '妈妈', phon: 'mɒm' },
            { en: 'grandfather', zh: '祖父', phon: 'ˈɡrænfɑːðə' },
            { en: 'grandmother', zh: '祖母', phon: 'ˈɡrænmʌðə' },
            { en: 'brother', zh: '兄弟', phon: 'ˈbrʌðə' },
            { en: 'sister', zh: '姐妹', phon: 'ˈsɪstə' }
          ]},
          { id: 'g3b-u3', title: 'Unit 3 At the zoo', topic: '形容动物', emoji: '🦒', words: [
            { en: 'thin', zh: '瘦的', phon: 'θɪn' },
            { en: 'fat', zh: '胖的', phon: 'fæt' },
            { en: 'tall', zh: '高的', phon: 'tɔːl' },
            { en: 'short', zh: '矮的', phon: 'ʃɔːt' },
            { en: 'long', zh: '长的', phon: 'lɒŋ' },
            { en: 'small', zh: '小的', phon: 'smɔːl' },
            { en: 'big', zh: '大的', phon: 'bɪɡ' },
            { en: 'giraffe', zh: '长颈鹿', phon: 'dʒəˈrɑːf' }
          ]},
          { id: 'g3b-u4', title: 'Unit 4 Where is my car？', topic: '方位与物品', emoji: '🚗', words: [
            { en: 'on', zh: '在……上', phon: 'ɒn' },
            { en: 'in', zh: '在……里', phon: 'ɪn' },
            { en: 'under', zh: '在……下', phon: 'ˈʌndə' },
            { en: 'chair', zh: '椅子', phon: 'tʃeə' },
            { en: 'desk', zh: '书桌', phon: 'desk' },
            { en: 'cap', zh: '帽子', phon: 'kæp' },
            { en: 'ball', zh: '球', phon: 'bɔːl' },
            { en: 'car', zh: '小汽车', phon: 'kɑː' }
          ]},
          { id: 'g3b-u5', title: 'Unit 5 Do you like pears？', topic: '水果', emoji: '🍎', words: [
            { en: 'pear', zh: '梨', phon: 'peə' },
            { en: 'apple', zh: '苹果', phon: 'ˈæpl' },
            { en: 'orange', zh: '橙子', phon: 'ˈɒrɪndʒ' },
            { en: 'banana', zh: '香蕉', phon: 'bəˈnɑːnə' },
            { en: 'watermelon', zh: '西瓜', phon: 'ˈwɔːtəmelən' },
            { en: 'strawberry', zh: '草莓', phon: 'ˈstrɔːbəri' },
            { en: 'grape', zh: '葡萄', phon: 'ɡreɪp' }
          ]},
          { id: 'g3b-u6', title: 'Unit 6 How many？', topic: '数字 11-20', emoji: '🔢', words: [
            { en: 'eleven', zh: '十一', phon: 'ɪˈlevn' },
            { en: 'twelve', zh: '十二', phon: 'twelv' },
            { en: 'thirteen', zh: '十三', phon: 'ˌθɜːˈtiːn' },
            { en: 'fourteen', zh: '十四', phon: 'ˌfɔːˈtiːn' },
            { en: 'fifteen', zh: '十五', phon: 'ˌfɪfˈtiːn' },
            { en: 'sixteen', zh: '十六', phon: 'ˌsɪksˈtiːn' },
            { en: 'seventeen', zh: '十七', phon: 'ˌsevnˈtiːn' },
            { en: 'eighteen', zh: '十八', phon: 'ˌeɪˈtiːn' },
            { en: 'nineteen', zh: '十九', phon: 'ˌnaɪnˈtiːn' },
            { en: 'twenty', zh: '二十', phon: 'ˈtwenti' }
          ]}
        ]}
      ]
    },
    {
      id: 'g4', name: '四年级', emoji: '🦊', color: '#0984e3',
      books: [
        { id: 'g4a', name: '上册', units: [
          { id: 'g4a-u1', title: 'Unit 1 My classroom', topic: '教室', emoji: '🏫', words: [
            { en: 'classroom', zh: '教室', phon: 'ˈklɑːsruːm' },
            { en: 'window', zh: '窗户', phon: 'ˈwɪndəʊ' },
            { en: 'picture', zh: '图画', phon: 'ˈpɪktʃə' },
            { en: 'door', zh: '门', phon: 'dɔː' },
            { en: 'blackboard', zh: '黑板', phon: 'ˈblækbɔːd' },
            { en: 'light', zh: '灯', phon: 'laɪt' },
            { en: 'computer', zh: '电脑', phon: 'kəmˈpjuːtə' },
            { en: 'fan', zh: '风扇', phon: 'fæn' },
            { en: 'wall', zh: '墙', phon: 'wɔːl' },
            { en: 'floor', zh: '地板', phon: 'flɔː' }
          ]},
          { id: 'g4a-u2', title: 'Unit 2 My schoolbag', topic: '书包与书本', emoji: '🎒', words: [
            { en: 'schoolbag', zh: '书包', phon: 'ˈskuːlbæɡ' },
            { en: 'English book', zh: '英语书' },
            { en: 'maths book', zh: '数学书' },
            { en: 'Chinese book', zh: '语文书' },
            { en: 'storybook', zh: '故事书', phon: 'ˈstɔːribʊk' },
            { en: 'notebook', zh: '笔记本', phon: 'ˈnəʊtbʊk' },
            { en: 'key', zh: '钥匙', phon: 'kiː' },
            { en: 'toy', zh: '玩具', phon: 'tɔɪ' }
          ]},
          { id: 'g4a-u3', title: 'Unit 3 My friends', topic: '外貌特征', emoji: '👫', words: [
            { en: 'long hair', zh: '长发' },
            { en: 'short hair', zh: '短发' },
            { en: 'thin', zh: '瘦的', phon: 'θɪn' },
            { en: 'strong', zh: '强壮的', phon: 'strɒŋ' },
            { en: 'tall', zh: '高的', phon: 'tɔːl' },
            { en: 'short', zh: '矮的', phon: 'ʃɔːt' },
            { en: 'quiet', zh: '文静的', phon: 'ˈkwaɪət' },
            { en: 'friendly', zh: '友好的', phon: 'ˈfrendli' }
          ]},
          { id: 'g4a-u4', title: 'Unit 4 My home', topic: '房间与家具', emoji: '🏠', words: [
            { en: 'study', zh: '书房', phon: 'ˈstʌdi' },
            { en: 'bathroom', zh: '浴室', phon: 'ˈbɑːθruːm' },
            { en: 'bedroom', zh: '卧室', phon: 'ˈbedruːm' },
            { en: 'living room', zh: '客厅' },
            { en: 'kitchen', zh: '厨房', phon: 'ˈkɪtʃɪn' },
            { en: 'phone', zh: '电话', phon: 'fəʊn' },
            { en: 'sofa', zh: '沙发', phon: 'ˈsəʊfə' },
            { en: 'fridge', zh: '冰箱', phon: 'frɪdʒ' }
          ]},
          { id: 'g4a-u5', title: "Unit 5 Dinner's ready", topic: '餐具与食物', emoji: '🍽️', words: [
            { en: 'beef', zh: '牛肉', phon: 'biːf' },
            { en: 'chicken', zh: '鸡肉', phon: 'ˈtʃɪkɪn' },
            { en: 'noodles', zh: '面条', phon: 'ˈnuːdlz' },
            { en: 'vegetable', zh: '蔬菜', phon: 'ˈvedʒtəbl' },
            { en: 'soup', zh: '汤', phon: 'suːp' },
            { en: 'fork', zh: '叉子', phon: 'fɔːk' },
            { en: 'knife', zh: '刀', phon: 'naɪf' },
            { en: 'chopsticks', zh: '筷子', phon: 'ˈtʃɒpstɪks' },
            { en: 'spoon', zh: '勺子', phon: 'spuːn' }
          ]},
          { id: 'g4a-u6', title: 'Unit 6 Meet my family', topic: '家人与职业', emoji: '👨‍👩‍👧‍👦', words: [
            { en: 'parents', zh: '父母', phon: 'ˈpeərənts' },
            { en: 'uncle', zh: '叔叔', phon: 'ˈʌŋkl' },
            { en: 'aunt', zh: '阿姨', phon: 'ɑːnt' },
            { en: 'cousin', zh: '表兄妹', phon: 'ˈkʌzn' },
            { en: 'doctor', zh: '医生', phon: 'ˈdɒktə' },
            { en: 'cook', zh: '厨师', phon: 'kʊk' },
            { en: 'driver', zh: '司机', phon: 'ˈdraɪvə' },
            { en: 'nurse', zh: '护士', phon: 'nɜːs' },
            { en: 'farmer', zh: '农民', phon: 'ˈfɑːmə' }
          ]}
        ]},
        { id: 'g4b', name: '下册', units: [
          { id: 'g4b-u1', title: 'Unit 1 My school', topic: '学校场所', emoji: '🏫', words: [
            { en: 'library', zh: '图书馆', phon: 'ˈlaɪbrəri' },
            { en: "teacher's office", zh: '教师办公室' },
            { en: 'first floor', zh: '一楼' },
            { en: 'second floor', zh: '二楼' },
            { en: 'art room', zh: '美术室' },
            { en: 'music room', zh: '音乐室' },
            { en: 'playground', zh: '操场', phon: 'ˈpleɪɡraʊnd' },
            { en: 'garden', zh: '花园', phon: 'ˈɡɑːdn' }
          ]},
          { id: 'g4b-u2', title: 'Unit 2 What time is it？', topic: '时间与课程', emoji: '⏰', words: [
            { en: 'breakfast', zh: '早餐', phon: 'ˈbrekfəst' },
            { en: 'lunch', zh: '午餐', phon: 'lʌntʃ' },
            { en: 'dinner', zh: '晚餐', phon: 'ˈdɪnə' },
            { en: 'English class', zh: '英语课' },
            { en: 'music class', zh: '音乐课' },
            { en: 'PE class', zh: '体育课' },
            { en: 'get up', zh: '起床' },
            { en: 'go to bed', zh: '上床睡觉' }
          ]},
          { id: 'g4b-u3', title: 'Unit 3 Weather', topic: '天气', emoji: '☀️', words: [
            { en: 'cold', zh: '冷的', phon: 'kəʊld' },
            { en: 'warm', zh: '温暖的', phon: 'wɔːm' },
            { en: 'cool', zh: '凉爽的', phon: 'kuːl' },
            { en: 'hot', zh: '热的', phon: 'hɒt' },
            { en: 'sunny', zh: '晴朗的', phon: 'ˈsʌni' },
            { en: 'windy', zh: '多风的', phon: 'ˈwɪndi' },
            { en: 'cloudy', zh: '多云的', phon: 'ˈklaʊdi' },
            { en: 'rainy', zh: '下雨的', phon: 'ˈreɪni' },
            { en: 'snowy', zh: '下雪的', phon: 'ˈsnəʊi' }
          ]},
          { id: 'g4b-u4', title: 'Unit 4 At the farm', topic: '农场动植物', emoji: '🐄', words: [
            { en: 'tomato', zh: '西红柿', phon: 'təˈmɑːtəʊ' },
            { en: 'potato', zh: '土豆', phon: 'pəˈteɪtəʊ' },
            { en: 'carrot', zh: '胡萝卜', phon: 'ˈkærət' },
            { en: 'green beans', zh: '豆角' },
            { en: 'horse', zh: '马', phon: 'hɔːs' },
            { en: 'cow', zh: '牛', phon: 'kaʊ' },
            { en: 'sheep', zh: '绵羊', phon: 'ʃiːp' },
            { en: 'hen', zh: '母鸡', phon: 'hen' }
          ]},
          { id: 'g4b-u5', title: 'Unit 5 My clothes', topic: '服装', emoji: '👕', words: [
            { en: 'pants', zh: '裤子', phon: 'pænts' },
            { en: 'hat', zh: '帽子', phon: 'hæt' },
            { en: 'dress', zh: '连衣裙', phon: 'dres' },
            { en: 'skirt', zh: '短裙', phon: 'skɜːt' },
            { en: 'coat', zh: '外套', phon: 'kəʊt' },
            { en: 'sweater', zh: '毛衣', phon: 'ˈswetə' },
            { en: 'sock', zh: '袜子', phon: 'sɒk' },
            { en: 'shorts', zh: '短裤', phon: 'ʃɔːts' },
            { en: 'jacket', zh: '夹克', phon: 'ˈdʒækɪt' }
          ]},
          { id: 'g4b-u6', title: 'Unit 6 Shopping', topic: '购物', emoji: '🛍️', words: [
            { en: 'glove', zh: '手套', phon: 'ɡlʌv' },
            { en: 'scarf', zh: '围巾', phon: 'skɑːf' },
            { en: 'umbrella', zh: '雨伞', phon: 'ʌmˈbrelə' },
            { en: 'sunglasses', zh: '太阳镜', phon: 'ˈsʌnɡlɑːsɪz' },
            { en: 'pretty', zh: '漂亮的', phon: 'ˈprɪti' },
            { en: 'expensive', zh: '昂贵的', phon: 'ɪkˈspensɪv' },
            { en: 'cheap', zh: '便宜的', phon: 'tʃiːp' },
            { en: 'nice', zh: '好看的', phon: 'naɪs' }
          ]}
        ]}
      ]
    },
    {
      id: 'g5', name: '五年级', emoji: '🦁', color: '#6c5ce7',
      books: [
        { id: 'g5a', name: '上册', units: [
          { id: 'g5a-u1', title: "Unit 1 What's he like？", topic: '性格特征', emoji: '🧑', words: [
            { en: 'old', zh: '年老的', phon: 'əʊld' },
            { en: 'young', zh: '年轻的', phon: 'jʌŋ' },
            { en: 'funny', zh: '滑稽的', phon: 'ˈfʌni' },
            { en: 'kind', zh: '和蔼的', phon: 'kaɪnd' },
            { en: 'strict', zh: '严厉的', phon: 'strɪkt' },
            { en: 'polite', zh: '有礼貌的', phon: 'pəˈlaɪt' },
            { en: 'hard-working', zh: '勤奋的' },
            { en: 'helpful', zh: '乐于助人的', phon: 'ˈhelpfl' },
            { en: 'clever', zh: '聪明的', phon: 'ˈklevə' },
            { en: 'shy', zh: '害羞的', phon: 'ʃaɪ' }
          ]},
          { id: 'g5a-u2', title: 'Unit 2 My week', topic: '星期', emoji: '📅', words: [
            { en: 'Monday', zh: '星期一', phon: 'ˈmʌndeɪ' },
            { en: 'Tuesday', zh: '星期二', phon: 'ˈtjuːzdeɪ' },
            { en: 'Wednesday', zh: '星期三', phon: 'ˈwenzdeɪ' },
            { en: 'Thursday', zh: '星期四', phon: 'ˈθɜːzdeɪ' },
            { en: 'Friday', zh: '星期五', phon: 'ˈfraɪdeɪ' },
            { en: 'Saturday', zh: '星期六', phon: 'ˈsætədeɪ' },
            { en: 'Sunday', zh: '星期日', phon: 'ˈsʌndeɪ' },
            { en: 'weekend', zh: '周末', phon: 'ˌwiːkˈend' }
          ]},
          { id: 'g5a-u3', title: 'Unit 3 What would you like？', topic: '食物', emoji: '🍔', words: [
            { en: 'sandwich', zh: '三明治', phon: 'ˈsænwɪtʃ' },
            { en: 'hamburger', zh: '汉堡包', phon: 'ˈhæmbɜːɡə' },
            { en: 'salad', zh: '沙拉', phon: 'ˈsæləd' },
            { en: 'ice cream', zh: '冰淇淋' },
            { en: 'tea', zh: '茶', phon: 'tiː' },
            { en: 'fresh', zh: '新鲜的', phon: 'freʃ' },
            { en: 'healthy', zh: '健康的', phon: 'ˈhelθi' },
            { en: 'delicious', zh: '美味的', phon: 'dɪˈlɪʃəs' },
            { en: 'sweet', zh: '甜的', phon: 'swiːt' }
          ]},
          { id: 'g5a-u4', title: 'Unit 4 What can you do？', topic: '能力动作', emoji: '🎨', words: [
            { en: 'sing', zh: '唱歌', phon: 'sɪŋ' },
            { en: 'dance', zh: '跳舞', phon: 'dɑːns' },
            { en: 'swim', zh: '游泳', phon: 'swɪm' },
            { en: 'cook', zh: '烹饪', phon: 'kʊk' },
            { en: 'draw cartoons', zh: '画漫画' },
            { en: 'play basketball', zh: '打篮球' },
            { en: 'play ping-pong', zh: '打乒乓球' },
            { en: 'speak English', zh: '说英语' },
            { en: 'do kung fu', zh: '练武术' }
          ]},
          { id: 'g5a-u5', title: 'Unit 5 There is a big bed', topic: '物品与方位', emoji: '🛏️', words: [
            { en: 'clock', zh: '时钟', phon: 'klɒk' },
            { en: 'plant', zh: '植物', phon: 'plɑːnt' },
            { en: 'bottle', zh: '瓶子', phon: 'ˈbɒtl' },
            { en: 'bike', zh: '自行车', phon: 'baɪk' },
            { en: 'photo', zh: '照片', phon: 'ˈfəʊtəʊ' },
            { en: 'water bottle', zh: '水瓶' },
            { en: 'in front of', zh: '在……前面' },
            { en: 'between', zh: '在……之间', phon: 'bɪˈtwiːn' },
            { en: 'above', zh: '在……上方', phon: 'əˈbʌv' }
          ]},
          { id: 'g5a-u6', title: 'Unit 6 In a nature park', topic: '自然景观', emoji: '🏞️', words: [
            { en: 'river', zh: '河流', phon: 'ˈrɪvə' },
            { en: 'lake', zh: '湖泊', phon: 'leɪk' },
            { en: 'mountain', zh: '高山', phon: 'ˈmaʊntən' },
            { en: 'forest', zh: '森林', phon: 'ˈfɒrɪst' },
            { en: 'hill', zh: '小山', phon: 'hɪl' },
            { en: 'tree', zh: '树', phon: 'triː' },
            { en: 'bridge', zh: '桥', phon: 'brɪdʒ' },
            { en: 'building', zh: '建筑物', phon: 'ˈbɪldɪŋ' },
            { en: 'boating', zh: '划船', phon: 'ˈbəʊtɪŋ' }
          ]}
        ]},
        { id: 'g5b', name: '下册', units: [
          { id: 'g5b-u1', title: 'Unit 1 My day', topic: '日常活动', emoji: '🌞', words: [
            { en: 'eat breakfast', zh: '吃早饭' },
            { en: 'eat dinner', zh: '吃晚饭' },
            { en: 'get up', zh: '起床' },
            { en: 'go to school', zh: '去上学' },
            { en: 'go home', zh: '回家' },
            { en: 'go to bed', zh: '上床睡觉' },
            { en: 'morning exercises', zh: '晨练' },
            { en: 'do homework', zh: '做作业' }
          ]},
          { id: 'g5b-u2', title: 'Unit 2 My favourite season', topic: '季节', emoji: '🍂', words: [
            { en: 'spring', zh: '春天', phon: 'sprɪŋ' },
            { en: 'summer', zh: '夏天', phon: 'ˈsʌmə' },
            { en: 'autumn', zh: '秋天', phon: 'ˈɔːtəm' },
            { en: 'winter', zh: '冬天', phon: 'ˈwɪntə' },
            { en: 'season', zh: '季节', phon: 'ˈsiːzn' },
            { en: 'go swimming', zh: '去游泳' },
            { en: 'pick apples', zh: '摘苹果' },
            { en: 'make a snowman', zh: '堆雪人' }
          ]},
          { id: 'g5b-u3', title: 'Unit 3 My school calendar', topic: '月份', emoji: '🗓️', words: [
            { en: 'January', zh: '一月', phon: 'ˈdʒænjuəri' },
            { en: 'February', zh: '二月', phon: 'ˈfebruəri' },
            { en: 'March', zh: '三月', phon: 'mɑːtʃ' },
            { en: 'April', zh: '四月', phon: 'ˈeɪprəl' },
            { en: 'May', zh: '五月', phon: 'meɪ' },
            { en: 'June', zh: '六月', phon: 'dʒuːn' },
            { en: 'July', zh: '七月', phon: 'dʒuˈlaɪ' },
            { en: 'August', zh: '八月', phon: 'ɔːˈɡʌst' },
            { en: 'September', zh: '九月', phon: 'sepˈtembə' },
            { en: 'October', zh: '十月', phon: 'ɒkˈtəʊbə' }
          ]},
          { id: 'g5b-u4', title: 'Unit 4 When is the art show？', topic: '序数词', emoji: '🏆', words: [
            { en: 'first', zh: '第一', phon: 'fɜːst' },
            { en: 'second', zh: '第二', phon: 'ˈsekənd' },
            { en: 'third', zh: '第三', phon: 'θɜːd' },
            { en: 'fourth', zh: '第四', phon: 'fɔːθ' },
            { en: 'fifth', zh: '第五', phon: 'fɪfθ' },
            { en: 'twelfth', zh: '第十二', phon: 'twelfθ' },
            { en: 'twentieth', zh: '第二十', phon: 'ˈtwentiəθ' },
            { en: 'twenty-first', zh: '第二十一' }
          ]},
          { id: 'g5b-u5', title: 'Unit 5 Whose dog is it？', topic: '物主代词', emoji: '🐕', words: [
            { en: 'mine', zh: '我的', phon: 'maɪn' },
            { en: 'yours', zh: '你的', phon: 'jɔːz' },
            { en: 'his', zh: '他的', phon: 'hɪz' },
            { en: 'hers', zh: '她的', phon: 'hɜːz' },
            { en: 'ours', zh: '我们的', phon: 'ˈaʊəz' },
            { en: 'theirs', zh: '他们的', phon: 'ðeəz' }
          ]},
          { id: 'g5b-u6', title: 'Unit 6 Work quietly！', topic: '规则与进行时', emoji: '🤫', words: [
            { en: 'doing morning exercises', zh: '正在做早操' },
            { en: 'having English class', zh: '正在上英语课' },
            { en: 'eating lunch', zh: '正在吃午饭' },
            { en: 'reading a book', zh: '正在读书' },
            { en: 'listening to music', zh: '正在听音乐' },
            { en: 'keep to the right', zh: '靠右走' },
            { en: 'keep your desk clean', zh: '保持桌面整洁' },
            { en: 'talk quietly', zh: '小声说话' }
          ]}
        ]}
      ]
    },
    {
      id: 'g6', name: '六年级', emoji: '🐯', color: '#e17055',
      books: [
        { id: 'g6a', name: '上册', units: [
          { id: 'g6a-u1', title: 'Unit 1 How can I get there？', topic: '地点与方向', emoji: '🧭', words: [
            { en: 'science museum', zh: '科学博物馆' },
            { en: 'post office', zh: '邮局' },
            { en: 'bookstore', zh: '书店', phon: 'ˈbʊkstɔː' },
            { en: 'cinema', zh: '电影院', phon: 'ˈsɪnəmɑː' },
            { en: 'hospital', zh: '医院', phon: 'ˈhɒspɪtl' },
            { en: 'restaurant', zh: '餐馆', phon: 'ˈrestrɒnt' },
            { en: 'crossing', zh: '十字路口', phon: 'ˈkrɒsɪŋ' },
            { en: 'turn left', zh: '向左转' },
            { en: 'turn right', zh: '向右转' },
            { en: 'go straight', zh: '直走' }
          ]},
          { id: 'g6a-u2', title: 'Unit 2 Ways to go to school', topic: '交通方式', emoji: '🚦', words: [
            { en: 'on foot', zh: '步行' },
            { en: 'by bike', zh: '骑自行车' },
            { en: 'by bus', zh: '乘公交车' },
            { en: 'by train', zh: '乘火车' },
            { en: 'by plane', zh: '乘飞机' },
            { en: 'by ship', zh: '乘船' },
            { en: 'by subway', zh: '乘地铁' },
            { en: 'traffic light', zh: '交通灯' },
            { en: 'slow down', zh: '减速慢行' }
          ]},
          { id: 'g6a-u3', title: 'Unit 3 My weekend plan', topic: '计划活动', emoji: '📋', words: [
            { en: 'visit my grandparents', zh: '看望祖父母' },
            { en: 'see a film', zh: '看电影' },
            { en: 'take a trip', zh: '去旅行' },
            { en: 'go to the supermarket', zh: '去超市' },
            { en: 'dictionary', zh: '字典', phon: 'ˈdɪkʃənri' },
            { en: 'comic book', zh: '漫画书' },
            { en: 'word book', zh: '单词本' },
            { en: 'postcard', zh: '明信片', phon: 'ˈpəʊstkɑːd' }
          ]},
          { id: 'g6a-u4', title: 'Unit 4 I have a pen pal', topic: '兴趣爱好', emoji: '✉️', words: [
            { en: 'hobby', zh: '爱好', phon: 'ˈhɒbi' },
            { en: 'ride a bike', zh: '骑自行车' },
            { en: 'play the violin', zh: '拉小提琴' },
            { en: 'make kites', zh: '做风筝' },
            { en: 'collect stamps', zh: '集邮' },
            { en: 'dive', zh: '潜水', phon: 'daɪv' },
            { en: 'live', zh: '居住', phon: 'lɪv' },
            { en: 'study', zh: '学习', phon: 'ˈstʌdi' }
          ]},
          { id: 'g6a-u5', title: 'Unit 5 What does he do？', topic: '职业', emoji: '💼', words: [
            { en: 'factory worker', zh: '工人' },
            { en: 'postman', zh: '邮递员', phon: 'ˈpəʊstmən' },
            { en: 'businessman', zh: '商人', phon: 'ˈbɪznəsmən' },
            { en: 'police officer', zh: '警察' },
            { en: 'fisherman', zh: '渔夫', phon: 'ˈfɪʃəmən' },
            { en: 'scientist', zh: '科学家', phon: 'ˈsaɪəntɪst' },
            { en: 'pilot', zh: '飞行员', phon: 'ˈpaɪlət' },
            { en: 'coach', zh: '教练', phon: 'kəʊtʃ' }
          ]},
          { id: 'g6a-u6', title: 'Unit 6 How do you feel？', topic: '情绪感受', emoji: '😟', words: [
            { en: 'angry', zh: '生气的', phon: 'ˈæŋɡri' },
            { en: 'afraid', zh: '害怕的', phon: 'əˈfreɪd' },
            { en: 'sad', zh: '难过的', phon: 'sæd' },
            { en: 'worried', zh: '担忧的', phon: 'ˈwʌrid' },
            { en: 'happy', zh: '高兴的', phon: 'ˈhæpi' },
            { en: 'ill', zh: '生病的', phon: 'ɪl' },
            { en: 'see a doctor', zh: '看医生' },
            { en: 'take a deep breath', zh: '深呼吸' }
          ]}
        ]},
        { id: 'g6b', name: '下册', units: [
          { id: 'g6b-u1', title: 'Unit 1 How tall are you？', topic: '形容词比较级', emoji: '📏', words: [
            { en: 'taller', zh: '更高的', phon: 'ˈtɔːlə' },
            { en: 'shorter', zh: '更矮的', phon: 'ˈʃɔːtə' },
            { en: 'stronger', zh: '更强壮的', phon: 'ˈstrɒŋɡə' },
            { en: 'older', zh: '更年长的', phon: 'ˈəʊldə' },
            { en: 'younger', zh: '更年轻的', phon: 'ˈjʌŋɡə' },
            { en: 'bigger', zh: '更大的', phon: 'ˈbɪɡə' },
            { en: 'heavier', zh: '更重的', phon: 'ˈheviə' },
            { en: 'longer', zh: '更长的', phon: 'ˈlɒŋɡə' }
          ]},
          { id: 'g6b-u2', title: 'Unit 2 Last weekend', topic: '过去式活动', emoji: '🎮', words: [
            { en: 'cleaned my room', zh: '打扫了房间' },
            { en: 'washed my clothes', zh: '洗了衣服' },
            { en: 'stayed at home', zh: '待在家里' },
            { en: 'watched TV', zh: '看了电视' },
            { en: 'read a book', zh: '读了书' },
            { en: 'saw a film', zh: '看了电影' },
            { en: 'had a cold', zh: '感冒了' },
            { en: 'slept', zh: '睡觉了', phon: 'slept' }
          ]},
          { id: 'g6b-u3', title: 'Unit 3 Where did you go？', topic: '过去旅行', emoji: '🏖️', words: [
            { en: 'went camping', zh: '去露营了' },
            { en: 'went fishing', zh: '去钓鱼了' },
            { en: 'rode a horse', zh: '骑了马' },
            { en: 'rode a bike', zh: '骑了自行车' },
            { en: 'ate fresh food', zh: '吃了新鲜食物' },
            { en: 'went swimming', zh: '去游泳了' },
            { en: 'took pictures', zh: '拍了照片' },
            { en: 'bought gifts', zh: '买了礼物' }
          ]},
          { id: 'g6b-u4', title: 'Unit 4 Then and now', topic: '今昔对比', emoji: '⏳', words: [
            { en: 'dining hall', zh: '餐厅' },
            { en: 'grass', zh: '草坪', phon: 'ɡrɑːs' },
            { en: 'gym', zh: '体育馆', phon: 'dʒɪm' },
            { en: 'cycling', zh: '骑车运动', phon: 'ˈsaɪklɪŋ' },
            { en: 'ice-skate', zh: '滑冰', phon: 'ˈaɪsskeɪt' },
            { en: 'badminton', zh: '羽毛球', phon: 'ˈbædmɪntən' },
            { en: 'go cycling', zh: '去骑车' },
            { en: 'play badminton', zh: '打羽毛球' }
          ]}
        ]}
      ]
    }
  ]
};
