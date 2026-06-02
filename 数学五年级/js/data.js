/** 访问验证码（修改 code 即可更换口令） */
const ACCESS_CONFIG = {
  code: "5566",
  hint: "请输入老师或家长提供的验证码",
  rememberDays: 7,
};

const LESSONS = [
  {
    id: "decMul",
    title: "小数乘法",
    emoji: "✖️",
    desc: "小数×整数 / 小数×小数",
    tip: "先按整数乘，再看两个因数共有几位小数，积就点几位。",
  },
  {
    id: "decDiv",
    title: "小数除法",
    emoji: "➗",
    desc: "除以整数 / 除以小数",
    tip: "除数是小数：把除数变成整数，被除数小数点跟着同样向右移。",
  },
  {
    id: "position",
    title: "位置（数对）",
    emoji: "📍",
    desc: "用数对表示位置",
    tip: "数对（列，行）：先列后行，从左往右数列，从下往上数行。",
  },
  {
    id: "equation",
    title: "简易方程",
    emoji: "📐",
    desc: "解一元一次方程",
    tip: "等式两边同时加减乘除同一个数，等式仍然成立。",
  },
  {
    id: "polyArea",
    title: "多边形面积",
    emoji: "🔷",
    desc: "平行四边形 / 三角形 / 梯形",
    tip: "平行四边形=底×高；三角形=底×高÷2；梯形=(上底+下底)×高÷2。",
  },
  {
    id: "tree",
    title: "数学广角—植树问题",
    emoji: "🌳",
    desc: "两端栽 / 一端栽 / 都不栽",
    tip: "两端都栽：棵数=段数+1；一端栽：棵数=段数；两端都不栽：棵数=段数−1。",
  },
  {
    id: "chance5",
    title: "可能性",
    emoji: "🎲",
    desc: "等可能与不等可能",
    tip: "数量多的可能性大；数量相等就是等可能。",
  },
  {
    id: "factor",
    title: "因数与倍数",
    emoji: "🔢",
    desc: "判断因数 / 倍数",
    tip: "a÷b 没有余数，b 是 a 的因数，a 是 b 的倍数。",
  },
  {
    id: "divFeat",
    title: "倍数的特征",
    emoji: "🧪",
    desc: "2、3、5 的倍数",
    tip: "2 的倍数末位是偶；5 的倍数末位 0 或 5；3 的倍数各位数字和能被 3 整除。",
  },
  {
    id: "prime",
    title: "质数与合数",
    emoji: "🧱",
    desc: "判断质数 / 合数",
    tip: "只有 1 和它本身两个因数的是质数；除此还有别的因数的是合数。1 既不是质数也不是合数。",
  },
  {
    id: "volume",
    title: "长方体与正方体",
    emoji: "🧊",
    desc: "体积与容积",
    tip: "长方体体积=长×宽×高；正方体体积=棱长³。1 立方米=1000 立方分米。",
  },
  {
    id: "fracMean",
    title: "分数的意义",
    emoji: "🍰",
    desc: "真分数 / 假分数 / 带分数",
    tip: "分子小于分母是真分数，分子大于等于分母是假分数。",
  },
  {
    id: "reduceCommon",
    title: "约分与通分",
    emoji: "🧮",
    desc: "最简分数与同分母",
    tip: "约分用最大公因数；通分用最小公倍数作公分母。",
  },
  {
    id: "fracAddSub",
    title: "分数加减法",
    emoji: "➕",
    desc: "同分母 / 异分母",
    tip: "同分母分子相加减；异分母先通分再加减；结果能约分要约成最简。",
  },
  {
    id: "lineChart5",
    title: "折线统计图",
    emoji: "📈",
    desc: "单线与复式折线",
    tip: "对比两条折线时，看同一时刻两个数值的高低与差距。",
  },
  {
    id: "defective",
    title: "找次品",
    emoji: "🔍",
    desc: "天平称量次数",
    tip: "n 个物品至多 ⌈log₃(n)⌉ 次能找到次品（每次分 3 堆较优）。",
  },
];

const FRUITS = ["🍎", "🍊", "🍌", "🍇", "🍓", "🍑", "🥝", "🍉"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐻", "🐼", "🐯", "🦊", "🐸"];
