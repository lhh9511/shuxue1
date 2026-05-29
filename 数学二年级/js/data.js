/** 访问验证码（修改 code 即可更换口令） */
const ACCESS_CONFIG = {
  code: "2266",
  hint: "请输入老师或家长提供的验证码",
  rememberDays: 7,
};

const LESSONS = [
  {
    id: "hundred",
    title: "100 以内的数",
    emoji: "💯",
    desc: "认识十位、个位，读写两位数",
    tip: "左边是十位，右边是个位。23 就是 2 个十和 3 个一。",
  },
  {
    id: "compare100",
    title: "比大小",
    emoji: "⚖️",
    desc: "100 以内数的大小比较",
    tip: "先比十位，十位大的数就大；十位相同再比个位。",
  },
  {
    id: "multiply",
    title: "表内乘法",
    emoji: "✖️",
    desc: "2～9 的乘法口诀练习",
    tip: "乘法就是几个相同数的加法。3×4 就是 3 个 4 相加。",
  },
  {
    id: "divide",
    title: "表内除法",
    emoji: "➗",
    desc: "平均分与除法口诀",
    tip: "除法是乘法的逆运算。想乘法口诀来求商。",
  },
  {
    id: "mixed",
    title: "加减混合",
    emoji: "➕",
    desc: "100 以内连加连减",
    tip: "从左往右算。可以用凑整法让计算更简单。",
  },
  {
    id: "money",
    title: "认识人民币",
    emoji: "💰",
    desc: "元、角、分与简单换算",
    tip: "1 元 = 10 角，1 角 = 10 分。买东西时先算一共多少钱。",
  },
  {
    id: "length",
    title: "长度单位",
    emoji: "📏",
    desc: "厘米与米的认识",
    tip: "量短的东西用厘米（cm），量长的用米（m）。1 米 = 100 厘米。",
  },
  {
    id: "clock2",
    title: "认识时间",
    emoji: "🕐",
    desc: "整点与半点",
    tip: "短针指过时，长针指 12 是整点，指 6 是半点。",
  },
  {
    id: "pattern2",
    title: "找规律",
    emoji: "🌈",
    desc: "数字与图形排列规律",
    tip: "看看每次增加或减少多少，找到规律再填数。",
  },
];

const FRUITS = ["🍎", "🍊", "🍌", "🍇", "🍓", "🍑", "🥝", "🍉"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐻", "🐼", "🐯", "🦊", "🐸"];

const COINS = [
  { label: "1 元", value: 100, emoji: "🪙" },
  { label: "5 角", value: 50, emoji: "🥈" },
  { label: "1 角", value: 10, emoji: "🪙" },
];
