# ESG 知识导航站 · ESG Knowledge Hub

> 个人维护的 ESG 知识中枢：把「可持续报告怎么写、披露新规怎么守、这个行业怎么进人、钱往哪里流」四条线索，整理成一张随时可查的地图。

- **在线地址**：<https://ruixinji.github.io/esg-hub/>（部署后生效）
- **源码仓库**：<https://github.com/ruixinji/esg-hub>
- **技术形态**：纯静态站点，零依赖、零构建，双击 `index.html` 即可打开

---

## 一、这个站点有什么

单页滚动式结构，顶部导航锚点跳转，支持移动端。共 9 个板块：

| # | 板块 | 英文 | 主要内容 |
| --- | --- | --- | --- |
| 01 | 概览 | Overview | E / S / G 三支柱拆解、「监管→数据→披露→评级」六步闭环、双重重要性 |
| 02 | 报告撰写 | Writing | 8 套披露标准速查表（GRI / ISSB / TCFD / SASB / CSRD / 交易所指引 / CDP / GHG Protocol）、撰写六步法、10 项高频指标清单、6 条写作红线 |
| 03 | 法律合规 | Compliance | 2015→2025 监管时间轴、漂绿等 6 大高风险雷区、8 条合规自查清单 |
| 04 | 招聘求职 | Careers | 6 类岗位画像与技能栈、6 类证书建议、求职渠道、简历写法、面试高频题 |
| 05 | 金融与机构 | Finance | 投资理念六档光谱、绿债 / 转型债 / 可持续挂钩债图谱、国内外评级机构对照 |
| 06 | 工具箱 | Tools | **开箱即用**：Scope 1/2 碳排快算器、报告自查清单（可勾选 / 复制 / 打印）、8 个常用入口直达按钮 |
| 07 | 资源库 | Resources | 20+ 官方标准与数据平台直链，支持关键词即时筛选 |
| 08 | 术语表 | Glossary | 18 条核心术语中英对照，支持关键词即时筛选 |
| 09 | 关于 | About | 使用方式、免责声明 |

交互功能：吸顶导航 + 滚动高亮、移动端汉堡菜单、资源库与术语表的实时搜索过滤、卡片悬停反馈；首屏「复制分享链接」一键复制网址。

### 工具箱说明（别人打开就能用，无需注册）

| 工具 | 用法 |
| --- | --- |
| 碳排快算 | 填电力 / 天然气 / 柴油 / 汽油 / 蒸汽 / 自来水年用量 → 出 tCO₂e 合计与分项条形图 |
| 自查清单 | 10 项逐条勾选，顶部进度条实时更新；可复制为 Markdown 或打印成 PDF |
| 常用直达 | GRI 标准库、ISSB 准则导航、GHG Protocol 中文版 PDF、CDP、上交所、港交所、SBTi、ICMA 八个按钮，点开即跳 |

> 碳排快算用的是粗算因子（电力取全国电网平均 0.5703 kgCO₂e/kWh），仅用于量级判断；正式盘查请按 GHG Protocol 用最新本地因子。因子表写在 `app.js` 顶部的 `FACTORS` 数组里，改数字即可。

---

## 二、文件结构

```
esg-hub/
├── index.html    # 页面结构（单页锚点导航，全部内容在此）
├── styles.css    # 深绿专业风样式（含响应式断点）
├── app.js        # 交互脚本：菜单 / 导航高亮 / 搜索过滤
└── README.md     # 本文件
```

---

## 三、本地预览

**方式一（最简单）**：双击 `index.html`，浏览器直接打开。

**方式二（起本地服务，推荐改样式时用）**：

```bash
cd esg-hub
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

Windows 若无 Python，可用 `npx serve` 或 VS Code 的 Live Server 插件。

---

## 四、部署到 GitHub Pages

### 首次上线（3 步，约 2 分钟）

1. **创建仓库**
   打开 <https://github.com/new> → Repository name 填 `esg-hub` → 选 **Public** → 勾选 *Add a README file* → Create repository

2. **上传文件**
   在空仓库页面点 **uploading an existing file** → 把 `index.html`、`styles.css`、`app.js`、`README.md` 四个文件一起拖进去 → 底部点 **Commit changes**
   （也可以 clone 到本地，用 `git add . && git commit -m "init" && git push`）

3. **开启 Pages**
   仓库 **Settings → Pages** → *Build and deployment* 下的 **Source** 选 *Deploy from branch* → Branch 选 `main`、文件夹选 `/ (root)` → **Save**

   等待 1–2 分钟，访问 <https://ruixinji.github.io/esg-hub/> 即可。

### 后续更新

- 网页端：直接编辑文件 → Commit（约 1 分钟生效）
- 命令行：

```bash
git add .
git commit -m "更新：补充 XX 内容"
git push origin main
```

> 自定义域名：在 Settings → Pages → Custom domain 填写，并在域名服务商处加一条 `CNAME` 记录指向 `ruixinji.github.io`。

---

## 五、怎么改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 配色 | `styles.css` 顶部的 `:root` 变量（`--green-800` 主色、`--paper` 背景、`--gold` 点缀色） |
| 增删资源卡片 | `index.html` 中 `<div class="res-grid">` 内的 `<a class="res">` 块；`data-k` 写搜索关键词（中英文都写） |
| 增删术语 | `index.html` 中 `<div class="gloss-grid">` 内的 `<div class="gloss">` 块，同样用 `data-k` 控制搜索命中 |
| 增删板块 | 顶部 `<nav class="nav">` 加一条 `<a href="#锚点">`，并对应新增一个 `<section id="锚点">` |
| 页脚链接 | `index.html` 底部 `<footer>` 区域 |

新增资源卡片可直接复制这段：

```html
<a class="res" href="https://example.org" target="_blank" rel="noopener" data-cat="标准" data-k="关键词 英文 keyword">
  <span class="res-cat">标准</span>
  <h4>机构 / 标准名称</h4>
  <p>一句话说明这个资源是做什么的</p>
  <span class="res-url">example.org</span>
</a>
```

搜索过滤与导航高亮由 `app.js` 自动接管，新增内容无需改 JS。

---

## 六、维护建议

- 法规与标准更新很快（CSRD、ISSB、交易所指引每年都在变），建议**每季度**过一遍「法律合规」板块的时间轴，并检查「资源库」链接是否失效。
- 术语表优先收录自己读报告时真正卡住过的词，不要为了凑数堆词条。

---

## 七、免责声明

本站为个人学习笔记与导航索引，**不构成法律、投资或审计意见**。文中提及的标准、法规与机构信息截至 2026 年 9 月，引用前请以监管机构与标准制定方的最新原文为准。

---

## 更新日志

| 日期 | 变更 |
| --- | --- |
| 2026-09-28 | 初版：8 个板块、20+ 资源链接、18 条术语 |
| 2026-09-29 | 重写 README（结构、部署、改法说明）；页脚增加源码仓库入口 |
| 2026-09-29 | 新增「工具箱」板块：碳排快算器、报告自查清单（复制 / 打印）、常用入口直达；首屏加分享链接复制按钮 |
