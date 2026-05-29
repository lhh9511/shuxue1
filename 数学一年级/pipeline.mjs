#!/usr/bin/env node
/**
 * 一条龙流水线：主题 → 游戏页(含随机验证码) → 截图 → 文案 → 封面 → git commit(不push)
 *
 * 用法：
 *   node pipeline.mjs --preset carry-add            # 用内置题型预设
 *   node pipeline.mjs --preset carry-add --code 1234 --dry-run
 *   node pipeline.mjs --preset carry-add --title "10以内进位加法" --slug add10
 *
 * 选项：
 *   --preset <key>   题型预设（默认 carry-add）
 *   --title  <str>   覆盖标题（同时用作营销物料目录名）
 *   --slug   <str>   覆盖游戏页文件名（<slug>.html）
 *   --code   <num>   指定验证码（默认随机 4 位）
 *   --dry-run        只生成与截图，跳过 git commit
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, execSync } from "child_process";
import { chromium } from "playwright";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8765;
const BASE = `http://localhost:${PORT}`;

/* ---------- 题型预设（可扩展：复制一份改参数即可） ---------- */
const PRESETS = {
  "carry-add": {
    slug: "add-carry",
    title: "20以内进位加法",
    emoji: "➕",
    subtitle: "凑十法 · 互动闯关课件",
    keyword: "凑十",
    method: "大数抱小数，凑十再相加",
    hint: "把后面的数拆一拆，先把前面的数凑成 10，再加上剩下的，又快又准！点「凑十演示」看一看。",
    min: 2, max: 9, sumMin: 11, sumMax: 18,
    cover: { tag: "一年级数学 · 幼小衔接", titleA: "凑十法", titleB: "一学就会", sub: "20以内进位加法 · 告别掰手指", point1: "凑十法动画，一步步看懂" },
  },
};

/* ---------- CLI 解析 ---------- */
function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a.startsWith("--")) out[a.slice(2)] = argv[++i];
  }
  return out;
}

/* ---------- 模板渲染 ---------- */
function render(tplName, map) {
  const tpl = fs.readFileSync(path.join(ROOT, "templates", tplName), "utf8");
  return Object.entries(map).reduce((s, [k, v]) => s.replaceAll(`{{${k}}}`, String(v)), tpl);
}

/* ---------- 本地服务 ---------- */
function serverAlive() {
  try { execSync(`curl -sf -o /dev/null --max-time 1 ${BASE}/`); return true; }
  catch { return false; }
}
function ensureServer() {
  if (serverAlive()) return null;          // 已有服务，不接管
  const p = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: ROOT, detached: true, stdio: "ignore" });
  p.unref();
  return p;                                 // 本脚本启动，用完关闭
}
async function waitServer(timeoutMs = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (serverAlive()) return;
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("本地服务未能启动");
}

/* ---------- 截图 ---------- */
async function shoot(cfg, outDir) {
  const browser = await chromium.launch();
  try {
    // 游戏三图（含自动输验证码）
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 920 }, deviceScaleFactor: 2, locale: "zh-CN" });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${cfg.slug}.html`, { waitUntil: "networkidle" });
    await p.waitForSelector("#authGate");
    await p.screenshot({ path: path.join(outDir, "screenshot-auth.png") });
    await p.fill("#authCode", String(cfg.code));
    await p.click("#authSubmit");
    await p.waitForTimeout(700);
    await p.click("#btnCouShi");
    await p.waitForTimeout(1400);
    await p.screenshot({ path: path.join(outDir, "screenshot.png"), fullPage: true });
    await p.click('.main-tab[data-panel=practice]');
    await p.waitForTimeout(500);
    await p.screenshot({ path: path.join(outDir, "screenshot-practice.png"), fullPage: true });
    await ctx.close();

    // 封面 1080×1440
    const ctx2 = await browser.newContext({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 2 });
    const p2 = await ctx2.newPage();
    await p2.goto(`${BASE}/campaigns/${encodeURIComponent(cfg.title)}/cover.html`, { waitUntil: "networkidle" });
    await p2.waitForTimeout(900);
    await p2.screenshot({ path: path.join(outDir, "cover.png") });
    await ctx2.close();
  } finally {
    await browser.close();
  }
}

/* ---------- git（不 push） ---------- */
function gitCommit(cfg) {
  execSync(`git add "${cfg.slug}.html" "campaigns/${cfg.title}"`, { cwd: ROOT, stdio: "inherit" });
  const msg = `feat(课件): 新增「${cfg.title}」互动课件 + 小红书营销四件套`;
  execSync(`git commit -m "${msg}"`, { cwd: ROOT, stdio: "inherit" });
}

/* ---------- 主流程 ---------- */
async function main() {
  const args = parseArgs(process.argv);
  const preset = PRESETS[args.preset || "carry-add"];
  if (!preset) { console.error(`未知预设：${args.preset}（可用：${Object.keys(PRESETS).join(", ")}）`); process.exit(1); }

  const cfg = { ...preset };
  if (args.title) cfg.title = args.title;
  if (args.slug) cfg.slug = args.slug;
  cfg.code = args.code || String(Math.floor(1000 + Math.random() * 9000));

  const outDir = path.join(ROOT, "campaigns", cfg.title);
  fs.mkdirSync(outDir, { recursive: true });

  // 1) 游戏页（站点根目录）
  fs.writeFileSync(path.join(ROOT, `${cfg.slug}.html`), render("game.html", {
    PAGE_TITLE: `${cfg.title} · ${cfg.keyword}法闯关`, EMOJI: cfg.emoji, TITLE: cfg.title,
    SUBTITLE: cfg.subtitle, CODE: cfg.code, SLUG: cfg.slug, HINT: cfg.hint,
    MIN: cfg.min, MAX: cfg.max, SUMMIN: cfg.sumMin, SUMMAX: cfg.sumMax,
  }));

  // 2) 文案
  fs.writeFileSync(path.join(outDir, "文案.md"), render("copy.md", {
    TITLE: cfg.title, SLUG: cfg.slug, CODE: cfg.code,
    DATE: new Date().toISOString().slice(0, 10), KEYWORD: cfg.keyword, METHOD: cfg.method,
  }));

  // 3) 封面 HTML（待截图）
  fs.writeFileSync(path.join(outDir, "cover.html"), render("cover.html", {
    COVER_TAG: cfg.cover.tag, COVER_TITLE_A: cfg.cover.titleA, COVER_TITLE_B: cfg.cover.titleB,
    COVER_SUB: cfg.cover.sub, SHOT: "screenshot.png", POINT1: cfg.cover.point1, KEYWORD: cfg.keyword,
  }));

  // 4) 起服务 + 截图
  const own = ensureServer();
  await waitServer();
  console.log("📸 截图中（游戏三图 + 封面）...");
  await shoot(cfg, outDir);
  if (own) { try { process.kill(-own.pid); } catch (_) {} }

  // 5) git
  if (!args.dryRun) { console.log("📦 git commit（不 push）..."); gitCommit(cfg); }

  console.log("\n✅ 完成！产物：");
  console.log(`   游戏页   ${cfg.slug}.html  (验证码 ${cfg.code})`);
  console.log(`   营销物料 campaigns/${cfg.title}/  (cover.png / screenshot*.png / 文案.md)`);
  console.log(`   预览     ${BASE}/${cfg.slug}.html`);
  if (args.dryRun) console.log("   (--dry-run：未执行 git)");
  else console.log("   下一步   确认无误后手动推送：git push origin main");
}

main().catch((e) => { console.error("流水线出错：", e.message); process.exit(1); });
