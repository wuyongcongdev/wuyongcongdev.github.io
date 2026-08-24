/* ==========================================================================
   作品集 — 数据与交互脚本
   ========================================================================== */

/* --------------------------------------------------------------------------
   作品数据
   在这里维护你的作品。字段说明：
   - id        : 唯一标识（英文、小写、连字符）
   - title     : 作品标题
   - category  : 分类（用于筛选）
   - year      : 年份
   - client    : 客户 / 委托方
   - role      : 你的角色
   - desc      : 项目描述（作品详情页显示）
   - gradient  : 占位图渐变色 [起色, 止色]（替换为真实图片后删除）
   - image     : （可选）真实图片路径，例如 "images/work-1.jpg"
   - video     : （可选）本地视频路径，例如 "videos/work-1.mp4"
   - poster    : （可选）视频封面图路径，例如 "images/work-1-cover.jpg"
   - embed     : （可选）第三方平台嵌入代码（B站/YouTube/Vimeo 的 iframe）
   - detail    : （可选）详情页额外展示的图片数组
   -------------------------------------------------------------------------- */
const works = [
  {
    id: "brand-identity",
    title: "品牌视觉识别系统",
    category: "品牌设计",
    year: "2024",
    client: "示例客户",
    role: "设计总监 / 视觉设计",
    desc: "为一间现代生活方式品牌打造的完整视觉识别系统，涵盖标志、色彩规范、字体系统与延展应用。设计以克制与秩序为核心，在极简的框架下建立可识别的品牌气质。",
    video: "videos/20260821-184824.mp4",
    gradient: ["#4a4a4a", "#1a1a1a"],
  },
  {
    id: "editorial-layout",
    title: "杂志编辑排版",
    category: "编辑设计",
    year: "2024",
    client: "独立杂志",
    role: "美术指导",
    desc: "一本关于城市与人文的独立杂志的版式设计。通过严谨的网格、有呼吸感的留白与克制的字体层级，让文字与图像在纸面上形成清晰的阅读节奏。",
    gradient: ["#5c5c5c", "#262626"],
  },
  {
    id: "packaging-design",
    title: "包装设计",
    category: "包装设计",
    year: "2023",
    client: "精品咖啡",
    role: "包装设计",
    desc: "为一款精品咖啡豆设计的系列包装。以简洁的几何图形与高级的材质对比，传达产品的纯粹与品质感。",
    gradient: ["#3f3f46", "#18181b"],
  },
  {
    id: "poster-series",
    title: "海报系列",
    category: "海报设计",
    year: "2023",
    client: "文化活动",
    role: "视觉设计",
    desc: "为一场文化展演创作的海报系列。以大胆的排版与有限的色彩，构建强烈的视觉张力与叙事感。",
    gradient: ["#525252", "#202020"],
  },
  {
    id: "web-interface",
    title: "界面与网页设计",
    category: "数字设计",
    year: "2025",
    client: "科技初创",
    role: "UI / 视觉设计",
    desc: "为一间科技初创公司设计的品牌官网与产品界面。强调清晰的信息层级、舒适的可读性与一致的设计语言。",
    gradient: ["#44403c", "#1c1917"],
  },
  {
    id: "illustration",
    title: "插画创作",
    category: "插画",
    year: "2022",
    client: "个人项目",
    role: "插画师",
    desc: "一系列探索色彩与形态的插画创作，尝试在不同媒介与风格之间寻找个人表达的语言。",
    gradient: ["#57534e", "#1f1e1c"],
  },
];

/* 分类列表（从数据自动提取，可手动调整顺序） */
const categories = [...new Set(works.map((w) => w.category))];

/* --------------------------------------------------------------------------
   工具函数
   -------------------------------------------------------------------------- */
function renderCard(work) {
  let media;
  if (work.video) {
    media = `<video src="${work.video}" ${work.poster ? `poster="${work.poster}"` : ""} muted loop playsinline preload="metadata"></video>`;
  } else if (work.image) {
    media = `<img src="${work.image}" alt="${work.title}" loading="lazy" />`;
  } else {
    media = `<div class="placeholder" style="--ph-a:${work.gradient[0]};--ph-b:${work.gradient[1]}">${work.title}</div>`;
  }

  return `
    <a class="work-card fade-in" href="work.html?id=${work.id}">
      <div class="work-card__media">${media}</div>
      <div class="work-card__meta">
        <span class="work-card__title">${work.title}</span>
        <span class="work-card__cat">${work.category}</span>
      </div>
    </a>`;
}

function getWorkById(id) {
  return works.find((w) => w.id === id);
}

/* --------------------------------------------------------------------------
   页面初始化
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // 导航高亮
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("is-active");
    // 作品详情页也高亮「作品」
    if (path === "work.html" && href === "works.html") a.classList.add("is-active");
  });

  // 移动端导航开关
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
  }

  // 滚动淡入动画
  const fadeEls = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 卡片视频 hover 预览
  document.addEventListener("mouseover", (e) => {
    const v = e.target.closest(".work-card")?.querySelector("video");
    if (v) v.play().catch(() => {});
  });
  document.addEventListener("mouseout", (e) => {
    const v = e.target.closest(".work-card")?.querySelector("video");
    if (v) v.pause();
  });

  // 页脚年份
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* --------------------------------------------------------------------------
   作品网格渲染（首页 + 作品列表页）
   -------------------------------------------------------------------------- */
function renderGrid(container, list) {
  if (!container) return;
  container.innerHTML = list.map(renderCard).join("");
  // 重新触发淡入
  container.querySelectorAll(".fade-in").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    requestAnimationFrame(() => el.classList.add("is-visible"));
  });
}

function initGrid() {
  const grid = document.getElementById("work-grid");
  if (!grid) return;

  const data = grid.dataset.full !== undefined ? works : works.slice(0, 4);
  renderGrid(grid, data);

  // 筛选器（仅作品列表页）
  const filterBar = document.getElementById("filters");
  if (!filterBar) return;

  const filterButtons = categories
    .map(
      (c) =>
        `<button class="filter-btn${c === "全部" ? " is-active" : ""}" data-cat="${c}">${c}</button>`
    )
    .join("");
  filterBar.innerHTML =
    `<button class="filter-btn is-active" data-cat="all">全部</button>` +
    filterButtons;

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const cat = btn.dataset.cat;
    const filtered = cat === "all" ? works : works.filter((w) => w.category === cat);
    renderGrid(grid, filtered);
  });
}

/* --------------------------------------------------------------------------
   作品详情页
   -------------------------------------------------------------------------- */
function initDetail() {
  const container = document.getElementById("work-detail");
  if (!container) return;

  const params = new URLSearchParams(location.search);
  const work = getWorkById(params.get("id")) || works[0];

  document.title = `${work.title} — 作品集`;

  const buildMainMedia = (w) => {
    if (w.video) {
      return `<video src="${w.video}" ${w.poster ? `poster="${w.poster}"` : ""} controls playsinline></video>`;
    }
    if (w.embed) {
      return `<div class="embed">${w.embed}</div>`;
    }
    if (w.image) {
      return `<img src="${w.image}" alt="${w.title}" />`;
    }
    return `<div class="placeholder" style="--ph-a:${w.gradient[0]};--ph-b:${w.gradient[1]}">${w.title} — 主视觉</div>`;
  };

  const mediaBlock = (work.detail || [])
    .map(
      (img) => `<img src="${img}" alt="${work.title}" loading="lazy" />`
    )
    .join("");

  container.innerHTML = `
    <a class="work-detail__back" href="works.html">
      <span aria-hidden="true">←</span> 返回作品列表
    </a>
    <h1 class="work-detail__title fade-in is-visible">${work.title}</h1>
    <div class="work-detail__meta fade-in is-visible">
      <div class="work-detail__meta-item">
        <span>分类</span><strong>${work.category}</strong>
      </div>
      <div class="work-detail__meta-item">
        <span>年份</span><strong>${work.year}</strong>
      </div>
      <div class="work-detail__meta-item">
        <span>客户</span><strong>${work.client}</strong>
      </div>
      <div class="work-detail__meta-item">
        <span>角色</span><strong>${work.role}</strong>
      </div>
    </div>
    <p class="work-detail__desc fade-in is-visible">${work.desc}</p>
    <div class="work-detail__media fade-in is-visible">
      ${buildMainMedia(work)}
      ${mediaBlock}
    </div>`;
}

/* 初始化 */
if (document.getElementById("work-grid")) {
  initGrid();
} else if (document.getElementById("work-detail")) {
  initDetail();
}
