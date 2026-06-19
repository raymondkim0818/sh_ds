const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pageDir = path.join(root, "page");
const mainHtml = fs.readFileSync(path.join(pageDir, "namsanwon.html"), "utf8");
const header = mainHtml.match(/<header class="globalNav"[\s\S]*?<\/header>/)[0];

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

function subpageContent(page) {
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

  <main class="subPage" id="main">
    <h2>${page.title}</h2>
    <p>${page.title} 페이지입니다. 세부 콘텐츠는 운영 자료에 맞춰 확장할 수 있습니다.</p>
    <a class="subPageLink" href="./namsanwon.html">메인으로 돌아가기</a>
  </main>

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
