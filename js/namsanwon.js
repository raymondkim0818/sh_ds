(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var nav = document.querySelector('[data-nav]');
  var header = document.querySelector('[data-header]');
  var sitemapButton = document.querySelector('[data-sitemap-button]');
  var sitemapDropdown = document.querySelector('[data-sitemap-dropdown]');

  if (!nav) return;

  function markCurrentNav() {
    var currentSection = document.body.dataset.currentSection;
    var currentPage = document.body.dataset.currentPage;
    var currentPath = decodeURIComponent(window.location.pathname.split('/').pop() || '');

    nav.querySelectorAll('.navItem').forEach(function (item) {
      var trigger = item.querySelector('.navTrigger');
      var links = Array.prototype.slice.call(item.querySelectorAll('.subMenu a'));
      var isCurrent = false;

      links.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var linkPage = href.replace(/^\.\//, '');
        var itemSection = item.dataset.section;
        if (linkPage === currentPage || linkPage === currentPath || itemSection === currentSection) {
          isCurrent = true;
        }
      });

      item.classList.toggle('isCurrent', isCurrent);
      if (trigger) {
        if (isCurrent) {
          trigger.setAttribute('aria-current', 'page');
        } else {
          trigger.removeAttribute('aria-current');
        }
      }
    });
  }

  var sectionMap = {
    '남산원소개': 'about',
    '사업소개': 'business',
    '후원/자원봉사': 'support',
    '아동생활': 'children',
    '커뮤니티': 'community'
  };

  nav.querySelectorAll('.navItem').forEach(function (item) {
    var trigger = item.querySelector('.navTrigger');
    if (!trigger) return;
    item.dataset.section = sectionMap[trigger.textContent.trim()] || '';
  });

  markCurrentNav();

  function closeSubMenus(exceptItem) {
    nav.querySelectorAll('.navItem.isOpen').forEach(function (item) {
      if (item === exceptItem) return;
      item.classList.remove('isOpen');
      var trigger = item.querySelector('.navTrigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function closeSitemap() {
    if (!sitemapButton || !sitemapDropdown) return;
    sitemapDropdown.classList.remove('isOpen');
    if (header) header.classList.remove('isSitemapOpen');
    sitemapButton.setAttribute('aria-expanded', 'false');
    sitemapButton.setAttribute('aria-label', '사이트맵 열기');
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('isOpen');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) closeSubMenus();
      closeSitemap();
    });
  }

  if (sitemapButton && sitemapDropdown) {
    sitemapButton.addEventListener('click', function () {
      var isOpen = !sitemapDropdown.classList.contains('isOpen');
      closeSubMenus();
      sitemapDropdown.classList.toggle('isOpen', isOpen);
      if (header) header.classList.toggle('isSitemapOpen', isOpen);
      sitemapButton.setAttribute('aria-expanded', String(isOpen));
      sitemapButton.setAttribute('aria-label', isOpen ? '사이트맵 닫기' : '사이트맵 열기');
      if (isOpen) {
        nav.classList.remove('isOpen');
        if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    sitemapDropdown.addEventListener('click', function (event) {
      if (event.target.tagName !== 'A') return;
      closeSitemap();
    });
  }

  nav.querySelectorAll('.navTrigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.navItem');
      var isOpen = !item.classList.contains('isOpen');
      closeSitemap();
      closeSubMenus(item);
      item.classList.toggle('isOpen', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });

  nav.addEventListener('click', function (event) {
    if (event.target.tagName !== 'A') return;
    nav.classList.remove('isOpen');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    closeSubMenus();
    closeSitemap();
  });

  document.addEventListener('click', function (event) {
    if (nav.contains(event.target)) return;
    if (sitemapButton && sitemapButton.contains(event.target)) return;
    if (sitemapDropdown && sitemapDropdown.contains(event.target)) return;
    closeSubMenus();
    closeSitemap();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closeSubMenus();
    closeSitemap();
    nav.classList.remove('isOpen');
    if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
  });

  window.addEventListener('scroll', function () {
    if (!header) return;
    header.classList.toggle('isScrolled', window.scrollY > 8);
  }, { passive: true });

  var boardTabs = document.querySelectorAll('[data-board-tab]');
  var boardList = document.querySelector('[data-board-list]');
  var boardMore = document.querySelector('.boardHeader .moreButton');

  var boardData = {
    notice: {
      moreHref: './notice.html',
      moreLabel: '공지사항 더보기',
      items: [
        { title: '2024년 상반기 자원봉사자 정기 교육 안내', date: '2024.05.20', isNew: true },
        { title: '남산원 아이들의 여름 캠프 후원 감사 인사', date: '2024.05.15', isNew: true },
        { title: '시설 보수 공사 입찰 공고 (급식실 환경개선)', date: '2024.05.10' },
        { title: '개인정보 처리방침 개정 안내 (2024년 5월)', date: '2024.05.05' },
        { title: '제54회 남산원 후원의 밤 행사 초대장', date: '2024.04.28' }
      ]
    },
    budget: {
      moreHref: './budget.html',
      moreLabel: '예산게시판 더보기',
      items: [
        { title: '(예산) 2024년 남산원 1차 추가경정 예산 공고', date: '2024.05.24', isNew: true },
        { title: '(예산) 2024년 법인회계 예산서 공개', date: '2024.05.18', isNew: true },
        { title: '(예산) 2023년 세입·세출 결산 보고', date: '2024.05.12' },
        { title: '(예산) 시설 기능보강 사업 예산 집행 안내', date: '2024.05.06' },
        { title: '(예산) 후원금 수입 및 사용 결과 공지', date: '2024.04.30' }
      ]
    },
    qna: {
      moreHref: './qna.html',
      moreLabel: '질문과 답변 더보기',
      items: [
        { title: '질문 자원봉사 신청 절차가 궁금합니다', date: '2024.05.23', isNew: true },
        { title: '질문 후원금 영수증 발급은 어떻게 하나요?', date: '2024.05.17', isNew: true },
        { title: '질문 물품 후원 가능 품목을 알고 싶습니다', date: '2024.05.11' },
        { title: '질문 기관 방문 상담 예약이 가능한가요?', date: '2024.05.04' },
        { title: '질문 정기후원 CMS 변경 방법 문의', date: '2024.04.27' }
      ]
    }
  };

  function toDateTime(dateText) {
    return dateText.replace(/\./g, '-');
  }

  function renderBoard(type) {
    if (!boardList || !boardData[type]) return;

    boardList.innerHTML = boardData[type].items.map(function (item) {
      var badge = item.isNew ? '<em class="badgeNew">N</em>' : '';
      return '' +
        '<li>' +
          '<a href="./notice-detail.html"><span>' + item.title + '</span>' + badge + '</a>' +
          '<time datetime="' + toDateTime(item.date) + '">' + item.date + '</time>' +
        '</li>';
    }).join('');

    if (boardMore) {
      boardMore.setAttribute('href', boardData[type].moreHref);
      boardMore.setAttribute('aria-label', boardData[type].moreLabel);
    }
  }

  if (boardTabs.length && boardList) {
    renderBoard('notice');

    boardTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var type = tab.getAttribute('data-board-tab');
        boardTabs.forEach(function (button) {
          button.classList.toggle('isActive', button === tab);
          button.setAttribute('aria-selected', String(button === tab));
          button.removeAttribute('id');
        });
        tab.setAttribute('id', 'boardTitle');
        boardList.setAttribute('aria-labelledby', 'boardTitle');
        renderBoard(type);
      });
    });
  }

  var heroSlider = document.querySelector('[data-hero-slider]');
  var heroSlides = heroSlider ? Array.prototype.slice.call(heroSlider.querySelectorAll('[data-hero-slide]')) : [];
  var heroBackgrounds = heroSlider ? Array.prototype.slice.call(heroSlider.querySelectorAll('[data-hero-bg]')) : [];
  var heroPager = heroSlider ? heroSlider.querySelector('[data-hero-pager]') : null;
  var heroIndex = 0;
  var heroTimer = null;

  function activateHeroSlide(index) {
    if (!heroSlides.length || !heroPager) return;
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlider.setAttribute('data-hero-active', String(heroIndex));

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('isActive', slideIndex === heroIndex);
      slide.setAttribute('aria-hidden', String(slideIndex !== heroIndex));
    });

    heroBackgrounds.forEach(function (background, backgroundIndex) {
      background.classList.toggle('isActive', backgroundIndex === heroIndex);
    });

    heroPager.querySelectorAll('button').forEach(function (button, buttonIndex) {
      button.classList.toggle('isActive', buttonIndex === heroIndex);
      button.setAttribute('aria-current', buttonIndex === heroIndex ? 'true' : 'false');
    });
  }

  function startHeroLoop() {
    if (heroTimer) window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      activateHeroSlide(heroIndex + 1);
    }, 4000);
  }

  if (heroSlides.length && heroPager) {
    heroPager.innerHTML = heroSlides.map(function (_, index) {
      return '<button type="button" aria-label="메인 비주얼 ' + (index + 1) + '번 보기"></button>';
    }).join('');

    heroPager.querySelectorAll('button').forEach(function (button, index) {
      button.addEventListener('click', function () {
        activateHeroSlide(index);
        startHeroLoop();
      });
    });

    activateHeroSlide(0);
    startHeroLoop();
  }
}());
