/** 访问验证码（修改 code 即可更换口令） */
const ACCESS_CONFIG = {
  code: "6666",
  hint: "请输入老师或家长提供的验证码",
  rememberDays: 7,
};

const LESSONS = [
  {
    id: "fracMul",
    title: "分数乘法",
    emoji: "✖️",
    desc: "分数×整数 / 分数×分数",
    tip: "分子相乘做分子，分母相乘做分母。能约分先约分再乘。",
  },
  {
    id: "fracDiv",
    title: "分数除法",
    emoji: "➗",
    desc: "甲数 ÷ 乙数 = 甲 × 乙的倒数",
    tip: "除以一个不为 0 的数，等于乘这个数的倒数。",
  },
  {
    id: "ratio",
    title: "比",
    emoji: "🔗",
    desc: "化简比与求比值",
    tip: "前后项同除以最大公因数得最简整数比；比值是分数（前÷后）。",
  },
  {
    id: "circlePeri",
    title: "圆的周长",
    emoji: "⭕",
    desc: "C = πd = 2πr",
    tip: "π ≈ 3.14。已知半径乘 2 再乘 π；已知直径直接乘 π。",
  },
  {
    id: "circleArea",
    title: "圆的面积",
    emoji: "🟠",
    desc: "S = πr²",
    tip: "圆面积 = π × 半径 × 半径。若给直径，先除以 2 得半径。",
  },
  {
    id: "percentConv",
    title: "百分数互化",
    emoji: "💯",
    desc: "小数 / 分数 ↔ 百分数",
    tip: "小数 → 百分数：点向右移两位加 %；百分数 → 小数：去 % 点向左移两位。",
  },
  {
    id: "discount",
    title: "折扣与成数",
    emoji: "🏷️",
    desc: "现价 = 原价 × 折扣",
    tip: "八折 = 80%；二成 = 20%；先把折扣写成百分数再乘原价。",
  },
  {
    id: "interest",
    title: "利率（利息）",
    emoji: "🏦",
    desc: "利息 = 本金 × 利率 × 时间",
    tip: "年利率 × 年数才能配套；利息 = 本金 × 年利率 × 年数。",
  },
  {
    id: "negative",
    title: "负数",
    emoji: "🌡️",
    desc: "认识负数 / 比大小",
    tip: "负数都小于 0；两个负数，绝对值大的反而小（−5 < −3）。",
  },
  {
    id: "cylinderSurf",
    title: "圆柱表面积",
    emoji: "🥫",
    desc: "侧面 + 两底",
    tip: "侧面积 = 2πr × h；表面积 = 2πr × h + 2πr²。",
  },
  {
    id: "cylinderVol",
    title: "圆柱体积",
    emoji: "🧊",
    desc: "V = 底面积 × 高",
    tip: "V = πr² × h；先算底面圆面积，再乘高。",
  },
  {
    id: "coneVol",
    title: "圆锥体积",
    emoji: "🍦",
    desc: "V = ⅓ 底面积 × 高",
    tip: "等底等高的圆锥体积是圆柱的 1/3。",
  },
  {
    id: "proportion",
    title: "正比例与反比例",
    emoji: "⚖️",
    desc: "判断两个量的关系",
    tip: "比值不变是正比例；乘积不变是反比例。",
  },
  {
    id: "solveProp",
    title: "解比例",
    emoji: "🧮",
    desc: "a∶b = c∶x，求 x",
    tip: "交叉相乘：内项之积 = 外项之积。",
  },
  {
    id: "pieChart",
    title: "扇形统计图",
    emoji: "📊",
    desc: "读图与计算",
    tip: "各部分百分数之和 = 100%；某部分 = 总数 × 该部分百分数。",
  },
  {
    id: "pigeon",
    title: "数学广角—鸽巢问题",
    emoji: "🐦",
    desc: "至少有几个在同一抽屉",
    tip: "把 n+1 个物品放进 n 个抽屉，总有一个抽屉里至少有 2 个；一般：⌈个数 ÷ 抽屉⌉。",
  },
];

const FRUITS = ["🍎", "🍊", "🍌", "🍇", "🍓", "🍑", "🥝", "🍉"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐻", "🐼", "🐯", "🦊", "🐸"];
