const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pageDir = path.join(root, "page");
const mainHtml = fs.readFileSync(path.join(pageDir, "namsanwon.html"), "utf8");
const header = mainHtml.match(/<header class="globalNav"[\s\S]*?<\/header>/)[0];
const footer = `  <footer class="footer" id="footer">
    <div class="footerInner">
      <a class="footerLogo" href="./namsanwon.html" aria-label="남산원 홈">
        <span class="logoSymbol" aria-hidden="true">남</span>
        <span class="logoText">남산원</span>
      </a>
      <div class="footerInfo">
        <p><b>주소:</b> (우)04628 서울시 중구 소파로 2길 31</p>
        <p><b>전화:</b> 02-752-9836 <b>팩스:</b> 02-755-9836 <b>원장:</b> 박흥식</p>
        <p>Copyright © 사회복지법인 남산원 All Rights Reserved.</p>
      </div>
      <a class="footerFacebookLink" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="페이스북 바로가기"></a>
    </div>
  </footer>`;

const groups = [
  {
    key: "about",
    title: "남산원소개",
    description: "아이들이 안전한 일상 속에서 건강하게 성장할 수 있도록 남산원의 이야기를 전합니다.",
    items: [
      ["about.html", "인사말"],
      ["history.html", "연혁"],
      ["status.html", "현황"],
      ["facilities.html", "시설안내"],
      ["location.html", "오시는 길"],
      ["history-photo.html", "남산원역사사진"],
    ],
  },
  {
    key: "business",
    title: "사업소개",
    description: "생활, 교육, 자립, 행정 지원을 통해 아이들의 오늘과 내일을 함께 돌봅니다.",
    items: [
      ["admin-support.html", "행정지원팀"],
      ["self-reliance.html", "자립지원팀"],
      ["education.html", "교육지원팀"],
      ["care.html", "보육지원팀"],
    ],
  },
  {
    key: "support",
    title: "후원/자원봉사",
    description: "따뜻한 후원과 자원봉사로 아이들의 배움과 성장을 함께 이어갑니다.",
    items: [
      ["support-cms.html", "후원신청 안내"],
      ["volunteer.html", "자원봉사신청 안내"],
    ],
  },
  {
    key: "children",
    title: "아동생활",
    description: "남산원 아이들의 일상과 학교생활 소식을 전합니다.",
    items: [
      ["child-life.html", "아동생활 소식"],
      ["school-life.html", "학교생활 소식"],
    ],
  },
  {
    key: "community",
    title: "커뮤니티",
    description: "공지사항과 갤러리, 소식지를 통해 남산원의 새로운 소식을 확인하실 수 있습니다.",
    items: [
      ["notice.html", "공지사항"],
      ["free-board.html", "자유게시판"],
      ["foreign-sponsored.html", "Foreign Sponsored"],
      ["newsletter.html", "소식지"],
      ["gallery.html", "갤러리"],
    ],
  },
  {
    key: "member",
    title: "회원",
    description: "남산원 홈페이지 회원 서비스를 이용하실 수 있습니다.",
    items: [
      ["login.html", "로그인"],
      ["join.html", "회원가입"],
    ],
  },
];

const aliases = new Map([
  ["support.html", "support-cms.html"],
  ["international-sponsorship.html", "support-cms.html"],
  ["children.html", "child-life.html"],
  ["community.html", "notice.html"],
  ["programs.html", "admin-support.html"],
  ["notice-detail.html", "notice.html"],
  ["gallery-detail.html", "gallery.html"],
  ["qna.html", "notice.html"],
  ["budget.html", "notice.html"],
]);

const pageMap = new Map();
for (const group of groups) {
  for (const [file, title] of group.items) {
    pageMap.set(file, { group, activeFile: file, title });
  }
}
for (const [file, target] of aliases) {
  const targetPage = pageMap.get(target);
  if (targetPage) {
    const customTitles = {
      "support.html": "후원신청 안내",
      "international-sponsorship.html": "International Sponsorship",
      "children.html": "아동생활",
      "community.html": "커뮤니티",
      "programs.html": "사업소개",
      "notice-detail.html": "게시판 상세",
      "gallery-detail.html": "갤러리 상세",
      "qna.html": "질문과 답변",
      "budget.html": "예산게시판",
    };
    pageMap.set(file, { ...targetPage, title: customTitles[file] });
  }
}

pageMap.set("sitemap.html", {
  group: {
    title: "사이트맵",
    description: "남산원 홈페이지의 전체 메뉴를 한눈에 확인하실 수 있습니다.",
    items: [["sitemap.html", "사이트맵"]],
  },
  activeFile: "sitemap.html",
  title: "사이트맵",
});

function localNav(group, activeFile) {
  return `
  <nav class="localNav" aria-label="${group.title} 하위 메뉴">
    <div class="localNavInner">
${group.items
  .map(([file, title]) => {
    const active = file === activeFile;
    return `      <a${active ? ' class="isActive" aria-current="page"' : ""} href="./${file}">${title}</a>`;
  })
  .join("\n")}
    </div>
  </nav>`;
}

function noticeMainContent() {
  return `  <main class="subPage noticeBoardPage" id="main">
    <div class="noticeBoardTop">
      <h2>공지사항</h2>
      <nav class="breadcrumb" aria-label="현재 위치">
        <a class="breadcrumbHome" href="./namsanwon.html"><span class="blind">홈</span></a>
        <span>커뮤니티</span>
        <strong>공지사항</strong>
      </nav>
    </div>

    <section class="noticeBoardToolbar" aria-label="공지사항 검색 및 분류">
      <div class="noticeBoardFilters" role="group" aria-label="게시물 분류">
        <button type="button" data-notice-filter="notice" aria-pressed="false">공지사항</button>
        <button type="button" data-notice-filter="budget" aria-pressed="false">예산</button>
        <button type="button" data-notice-filter="settlement" aria-pressed="false">결산</button>
        <button type="button" data-notice-filter="corporation" aria-pressed="false">법인</button>
      </div>

      <form class="noticeBoardSearch" data-notice-search>
        <label class="blind" for="noticeSearchType">검색 분류</label>
        <select id="noticeSearchType" name="type">
          <option value="all">전체</option>
          <option value="notice">공지사항</option>
          <option value="budget">예산</option>
          <option value="settlement">결산</option>
          <option value="corporation">법인</option>
        </select>
        <label class="blind" for="noticeSearchKeyword">검색어</label>
        <input id="noticeSearchKeyword" name="keyword" type="search" placeholder="검색어를 입력하세요">
        <button type="submit"><span class="blind">검색</span></button>
      </form>
    </section>

    <section class="noticeBoard" aria-label="공지사항 목록">
      <div class="noticeBoardList" data-notice-board-list></div>
      <p class="noticeBoardEmpty" data-notice-empty hidden>검색 결과가 없습니다.</p>
      <nav class="noticeBoardPagination" aria-label="공지사항 페이지" data-notice-pagination></nav>
      <div class="noticePullHint" data-notice-pull-hint hidden aria-hidden="true">
        <span></span>
        <span></span>
      </div>
      <div class="noticeMobileLoader" data-notice-mobile-loader hidden>
        <span></span>
        <span class="blind">게시물 불러오는 중</span>
      </div>
    </section>
  </main>`;
}

function postDetailContent(options) {
  const files = options.files || [];
  const fileList = files.length
    ? `
        <ul class="postDetailFiles" aria-label="첨부파일">
${files
  .map((file) => `          <li>
            <span class="postDetailFileIcon" aria-hidden="true"></span>
            <span class="postDetailFileInfo">
              <strong>${file.name}</strong>
              <small>${file.size}</small>
            </span>
            <a href="#" download>Download</a>
          </li>`)
  .join("\n")}
        </ul>`
    : "";
  const bodyContent = options.image
    ? `
        <div class="postDetailImage">
          <img src="${options.image.src}" alt="${options.image.alt}">
        </div>`
    : `
        <p>남산원 홈페이지 게시물 운영 기준에 따라 아동의 개인정보와 초상권 보호를 위해 사진 및 영상 자료는 모자이크 처리 후 게시됩니다.</p>
        <p>아동의 이름, 학교, 생활공간 등 개인을 특정할 수 있는 정보는 공개되지 않으며, 보호가 필요한 자료는 게시하지 않습니다.</p>
        <p>방문자와 후원자 여러분의 너른 양해 부탁드립니다.</p>`;

  return `  <main class="subPage postDetailPage" id="main">
    <div class="postDetailTop">
      <h2>${options.category}</h2>
      <nav class="breadcrumb" aria-label="현재 위치">
        <a class="breadcrumbHome" href="./namsanwon.html"><span class="blind">홈</span></a>
        <span>커뮤니티</span>
        <strong>${options.category}</strong>
      </nav>
    </div>

    <article class="postDetail">
      <header class="postDetailHeader">
        <h3>${options.title}</h3>
        <ul class="postDetailMeta" aria-label="게시물 정보">
          <li class="isDate"><time datetime="${options.datetime}">${options.date}</time></li>
          <li class="isAuthor">${options.author}</li>
          <li class="isViews">${options.views}</li>
        </ul>
      </header>

      <div class="postDetailBody">
${bodyContent}
${fileList}
      </div>
    </article>

    <nav class="postDetailPager" aria-label="이전글 다음글">
      <a class="isPrev" href="${options.prevHref || "./notice-detail.html"}">
        <span>이전글</span>
        <strong>${options.prevTitle || "소망교회 제30여전도회(2026.06.08)"}</strong>
      </a>
      <a class="isNext" href="${options.nextHref || "./notice-detail.html"}">
        <span>다음글</span>
        <strong>${options.nextTitle || "쌍용C&E 백범광장 외출(2026.05.28)"}</strong>
      </a>
    </nav>

    <div class="postDetailActions">
      <a href="${options.listHref || "./notice.html"}">Back to List</a>
    </div>
  </main>`;
}

function defaultMainContent(page) {
  return `  <main class="subPage" id="main">
    <h2>${page.title}</h2>
    <p>${page.title} 페이지입니다. 세부 콘텐츠는 운영 자료에 맞춰 확장할 수 있습니다.</p>
    <a class="subPageLink" href="./namsanwon.html">메인으로 돌아가기</a>
  </main>`;
}

function subpageContent(page) {
  const mainContent = page.activeFile === "notice.html" && page.title === "공지사항"
    ? noticeMainContent()
    : page.title === "게시판 상세"
      ? postDetailContent({
          category: "공지사항",
          title: "개인정보로 인하여 아동의 사진, 영상은 모자이크 또는 게시되지 않습니다.",
          date: "2023.12.15",
          datetime: "2023-12-15",
          author: "Administrator",
          views: "856 views",
          listHref: "./notice.html",
          files: [
            { name: "notice_privacy_guideline.pdf", size: "1.4 MB" },
          ],
        })
      : page.title === "갤러리 상세"
        ? postDetailContent({
            category: "갤러리",
            title: "신세계 까사 봉사활동(26.6.5)",
            date: "2024.01.02",
            datetime: "2024-01-02",
            author: "Administrator",
            views: "1,240 views",
            image: {
              src: "../images/namsanwon/hero-figma-02.jpg",
              alt: "신세계 까사 봉사활동 사진",
            },
            listHref: "./gallery.html",
            files: [
              { name: "KaKaoTalk_20260605_162736652_01.jpg", size: "1.4 MB" },
              { name: "KaKaoTalk_20260605_162736652_02.jpg", size: "1.4 MB" },
              { name: "KaKaoTalk_20260605_162736652_03.jpg", size: "1.4 MB" },
            ],
          })
      : defaultMainContent(page);

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title} | 남산원</title>
  <link rel="stylesheet" href="../css/reset.css">
  <link rel="stylesheet" href="../css/fonts.css">
  <link rel="stylesheet" href="../css/root.css">
  <link rel="stylesheet" href="../css/namsanwon.css">
</head>
<body data-current-section="${page.group.key}" data-current-page="${page.activeFile}">
  <a class="skipLink" href="#main">본문 바로가기</a>

${header}

  <section class="subVisual" aria-labelledby="subVisualTitle">
    <div class="subVisualInner">
      <h1 id="subVisualTitle">${page.group.title}</h1>
      <p>${page.group.description}</p>
    </div>
  </section>

${localNav(page.group, page.activeFile)}

${mainContent}

${footer}

  <script src="../js/namsanwon.js"></script>
</body>
</html>
`;
}

for (const file of fs.readdirSync(pageDir)) {
  if (!file.endsWith(".html") || file === "namsanwon.html") continue;
  const page = pageMap.get(file);
  if (!page) continue;
  fs.writeFileSync(path.join(pageDir, file), subpageContent(page));
}
