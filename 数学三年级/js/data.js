/** 访问验证码（修改 code 即可更换口令） */
const ACCESS_CONFIG = {
  code: "3366",
  hint: "请输入老师或家长提供的验证码",
  rememberDays: 7,
};

const LESSONS = [
  {
    id: "bigAddSub",
    title: "万以内加减法",
    emoji: "🧮",
    desc: "三、四位数的加减法",
    tip: "相同数位对齐，从个位算起；满十进一，不够减就借一。",
  },
  {
    id: "mulOne",
    title: "多位数乘一位数",
    emoji: "✖️",
    desc: "两、三位数乘一位数",
    tip: "从个位乘起，乘到哪一位就加上之前进的数。",
  },
  {
    id: "divOne",
    title: "除数是一位数的除法",
    emoji: "➗",
    desc: "竖式除法与口算",
    tip: "从最高位开始除，每除完一位的余数要小于除数。",
  },
  {
    id: "multiple",
    title: "倍的认识",
    emoji: "🔁",
    desc: "求一个数的几倍",
    tip: "几倍就是几个相同数相加，用乘法算最快。",
  },
  {
    id: "perimeter",
    title: "周长",
    emoji: "🔲",
    desc: "长方形与正方形的周长",
    tip: "长方形周长=（长+宽）×2；正方形周长=边长×4。",
  },
  {
    id: "areaG3",
    title: "面积",
    emoji: "🟦",
    desc: "面积单位与计算",
    tip: "长方形面积=长×宽；正方形面积=边长×边长。",
  },
  {
    id: "fraction",
    title: "分数初步",
    emoji: "🍕",
    desc: "认识几分之几",
    tip: "把一个整体平均分成几份，取其中几份就是几分之几。",
  },
  {
    id: "decimal",
    title: "小数初步",
    emoji: "💧",
    desc: "认识简单小数",
    tip: "小数点后第一位是十分位，0.1 表示十分之一。",
  },
  {
    id: "timeUnit",
    title: "时分秒",
    emoji: "⏱️",
    desc: "时间单位换算",
    tip: "1 时 = 60 分，1 分 = 60 秒。",
  },
  {
    id: "kmTon",
    title: "千米与吨",
    emoji: "🚛",
    desc: "大单位的认识",
    tip: "1 千米 = 1000 米；1 吨 = 1000 千克。",
  },
  {
    id: "measure",
    title: "毫米与分米",
    emoji: "📏",
    desc: "更小的长度单位",
    tip: "1 厘米 = 10 毫米；1 分米 = 10 厘米；1 米 = 10 分米。",
  },
  {
    id: "ymd",
    title: "年月日",
    emoji: "📅",
    desc: "大月小月与平闰年",
    tip: "大月 31 天，小月 30 天；二月平年 28，闰年 29 天。",
  },
  {
    id: "clock24",
    title: "24 时计时法",
    emoji: "🕓",
    desc: "上下午换算",
    tip: "下午时刻＋12 就是 24 时计时法；如下午 3 时 = 15 时。",
  },
  {
    id: "direction",
    title: "位置与方向",
    emoji: "🧭",
    desc: "东南西北",
    tip: "上北、下南、左西、右东；面向北时，背对的是南。",
  },
  {
    id: "chance",
    title: "可能性",
    emoji: "🎲",
    desc: "一定 / 可能 / 不可能",
    tip: "盒子里全是红球，一定摸到红球；没有黄球，就不可能摸到黄球。",
  },
  {
    id: "venn",
    title: "数学广角—集合",
    emoji: "⭕",
    desc: "韦恩图与重叠",
    tip: "两组合起来 = 各自人数之和 − 同时在两组的人数。",
  },
];

const FRUITS = ["🍎", "🍊", "🍌", "🍇", "🍓", "🍑", "🥝", "🍉"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐻", "🐼", "🐯", "🦊", "🐸"];
