/* =========================================================================
   LEVEL 0 — 사이트 동작
   주소 끝의 # 값에 따라 페이지를 바꿔 그립니다. (서버 설정 없이 동작)
     #               → 홈
     #jams           → 전체 게임잼
     #about          → 동아리 소개
     #jam-<잼id>      → 게임잼 상세   예) #jam-2026-fall
     #game-<게임id>   → 게임 상세/플레이 예) #game-block-drop
   ※ 게임 id는 모든 게임잼을 통틀어 겹치지 않게 지어주세요.
   ========================================================================= */
(() => {
  const DATA = window.LEVEL0;
  // 각 게임잼의 게임을 팀 번호(teamNo) 순서대로 정렬 (팀 번호가 없는 게임은 맨 뒤, 원래 순서 유지)
  DATA.jams.forEach(jam => {
    const num = g => (typeof g.teamNo === 'number' ? g.teamNo : parseInt(g.teamNo, 10));
    jam.games = jam.games
      .map((g, i) => ({ g, i }))
      .sort((a, b) => {
        const na = num(a.g), nb = num(b.g);
        const ha = !isNaN(na), hb = !isNaN(nb);
        if (ha && hb && na !== nb) return na - nb;
        if (ha !== hb) return ha ? -1 : 1;
        return a.i - b.i;
      })
      .map(x => x.g);
  });
  const app = document.getElementById('app');

  /* ---------- 작은 도우미 함수들 ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const allGames = () => DATA.jams.flatMap(jam => jam.games.map(g => ({ ...g, jam })));
  const findJam = id => DATA.jams.find(j => j.id === id);
  const findGame = id => allGames().find(g => g.id === id);
  const aspectOf = g => {
    if (g.play?.width > 0 && g.play?.height > 0) return `${g.play.width} / ${g.play.height}`;
    const [w, h] = String(g.play?.aspect || '16:9').split(':').map(Number);
    return w > 0 && h > 0 ? `${w} / ${h}` : '16 / 9';
  };

  /* 썸네일이 없을 때 로고 모티프(기울어진 블록)로 자동 생성하는 이미지 */
  function autoThumb(game) {
    let h = 0;
    for (const ch of game.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => (h = (h * 1103515245 + 12345) >>> 0) / 4294967296;
    const bgs = ['#16161a', '#1a1d14', '#141a1d', '#1d1416', '#18161d'];
    const bg = bgs[h % bgs.length];
    let shapes = '';
    for (let i = 0; i < 5; i++) {
      const x = 40 + rnd() * 360, y = -20 + rnd() * 200, w = 60 + rnd() * 160, hh = 18 + rnd() * 26;
      const rot = -40 + (rnd() > .5 ? 0 : 80);
      const kind = rnd();
      const fill = i === 0 ? '#d4ff3a' : kind < .35 ? 'none' : 'rgba(255,255,255,.9)';
      const stroke = fill === 'none' ? 'stroke="rgba(255,255,255,.75)" stroke-width="4"' : '';
      shapes += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${hh.toFixed(0)}" fill="${fill}" ${stroke} transform="rotate(${rot} ${(x + w / 2).toFixed(0)} ${(y + hh / 2).toFixed(0)})"/>`;
    }
    return `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(game.title)}">
      <rect width="480" height="270" fill="${bg}"/>
      <g opacity=".9">${shapes}</g>
      <rect width="480" height="270" fill="url(#fade-${esc(game.id)})"/>
      <defs><linearGradient id="fade-${esc(game.id)}" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="${bg}" stop-opacity=".95"/></linearGradient></defs>
    </svg>`;
  }
  /* 몇 팀인지 표시 (teamNo: 1 → "1팀", 글자로 적으면 그대로 표시) */
  const teamLabel = g => g.teamNo === undefined || g.teamNo === '' ? '' : (typeof g.teamNo === 'number' ? `${g.teamNo}팀` : String(g.teamNo));
  const thumb = g => g.thumbnail ? `<img src="${esc(g.thumbnail)}" alt="${esc(g.title)}" loading="lazy">` : autoThumb(g);

  /* ---------- 조각 UI ---------- */
  const gameCard = g => `
    <a class="card" href="#game-${esc(g.id)}">
      <div class="card-thumb">
        ${thumb(g)}
        ${g.play ? '<span class="badge badge-play">▶ PLAY</span>' : ''}
      </div>
      <div class="card-body">
        ${teamLabel(g) ? `<span class="team-no">${esc(teamLabel(g))}</span>` : ''}
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.summary)}</p>
        <div class="card-meta">
          ${g.engine ? `<span class="badge">${esc(g.engine)}</span>` : ''}
          ${g.genre ? `<span class="badge">${esc(g.genre)}</span>` : ''}
        </div>
      </div>
    </a>`;

  const jamRow = j => `
    <a class="jam-row" href="#jam-${esc(j.id)}">
      <div class="jam-date">${esc(j.date)}</div>
      <div>
        <h3>${esc(j.title)}</h3>
        <div class="jam-theme">주제 <b>${esc(j.theme)}</b>${j.hours ? ` · ${j.hours}시간` : ''}</div>
      </div>
      <div class="jam-count">${j.games.length} GAMES →</div>
    </a>`;

  /* ---------- 페이지들 ---------- */
  function pageHome() {
    const latest = DATA.jams[0];
    const past = DATA.jams.slice(1);   // 지난 게임잼들 (목록으로만 표시, 눌러서 들어가면 게임이 보임)
    return `
      <section class="hero">
        <div>
          <p class="hero-sub">${esc(DATA.club.school)} '${esc(DATA.club.name)}'</p>
          <h1>0에서부터 시작해<br><em>무한히</em> 성장하다.</h1>
          <div class="hero-actions">
            ${latest ? `<a class="btn btn-accent" href="#jam-${esc(latest.id)}">최신 게임잼 보기</a>` : ''}
            <a class="btn" href="#jams">전체 게임잼</a>
          </div>
        </div>
        <div class="hero-logo"><img src="assets/logo-white.png" alt="LEVEL 0 로고"></div>
      </section>

      ${latest ? `
      <section class="section">
        <div class="section-head">
          <div><p class="eyebrow">Latest Jam · ${esc(latest.theme)}</p><h2>${esc(latest.title)}</h2></div>
          <a class="link-more" href="#jam-${esc(latest.id)}">자세히 →</a>
        </div>
        <div class="grid">${latest.games.map(g => gameCard({ ...g, jam: latest })).join('')}</div>
      </section>` : ''}

      ${past.length ? `
      <section class="section">
        <div class="section-head">
          <div><p class="eyebrow">Archive</p><h2>지난 게임잼</h2></div>
          <a class="link-more" href="#jams">전체 보기 →</a>
        </div>
        <div class="jam-list">${past.map(jamRow).join('')}</div>
      </section>` : ''}`;
  }

  function pageJams() {
    return `
      <div class="page-head">
        <p class="eyebrow">Archive</p>
        <h1>게임잼</h1>
        <p>지금까지 진행한 LEVEL 0 게임잼과 출품작입니다.</p>
      </div>
      <section class="section" style="margin-top:32px">
        ${DATA.jams.length ? `<div class="jam-list">${DATA.jams.map(jamRow).join('')}</div>` : '<div class="empty">아직 등록된 게임잼이 없습니다.</div>'}
      </section>`;
  }

  function pageJam(jam) {
    return `
      <div class="page-head">
        <div class="crumbs"><a href="#jams">게임잼</a><span>/</span><span>${esc(jam.title)}</span></div>
        <h1>${esc(jam.title)}</h1>
        <p>${esc(jam.description)}</p>
        <div class="jam-facts">
          <span>기간 <b>${esc(jam.date)}</b></span>
          <span>주제 <b>${esc(jam.theme)}</b></span>
          ${jam.hours ? `<span>제한 시간 <b>${jam.hours}시간</b></span>` : ''}
          <span>출품작 <b>${jam.games.length}개</b></span>
        </div>
      </div>
      <section class="section" style="margin-top:36px">
        ${jam.games.length ? `<div class="grid">${jam.games.map(g => gameCard({ ...g, jam })).join('')}</div>` : '<div class="empty">아직 등록된 게임이 없습니다.</div>'}
      </section>`;
  }

  function pageGame(g) {
    const L = g.links || {};
    const linkBtns = [
      L.page && `<a class="btn" href="${esc(L.page)}" target="_blank" rel="noopener">↗ itch.io 페이지</a>`,
      L.download && `<a class="btn" href="${esc(L.download)}" target="_blank" rel="noopener">⬇ 다운로드</a>`,
      L.video && `<a class="btn" href="${esc(L.video)}" target="_blank" rel="noopener">▶ 플레이 영상</a>`,
      L.source && `<a class="btn" href="${esc(L.source)}" target="_blank" rel="noopener">{ } 소스 코드</a>`
    ].filter(Boolean).join('');

    const player = g.play ? `
      <div class="player" id="player" style="aspect-ratio:${aspectOf(g)}">
        <button class="player-cover" id="play-cover" aria-label="${esc(g.title)} 플레이" style="all:unset;position:absolute;inset:0;display:grid;place-items:center;cursor:pointer">
          ${thumb(g)}
          <span class="play-btn">
            <span class="play-icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z"/></svg></span>
            CLICK TO PLAY
            <span class="hint">게임을 불러오는 데 시간이 걸릴 수 있습니다.</span>
          </span>
        </button>
      </div>
      <div class="player-bar">
        <button class="btn" id="btn-reload" hidden>↻ 다시 불러오기</button>
        <button class="btn" id="btn-full">⛶ 전체 화면</button>
      </div>` : `
      <div class="player" style="aspect-ratio:16 / 9">
        <div class="player-none">${thumb(g)}<div><b style="color:var(--text)">웹 플레이를 지원하지 않는 게임입니다.</b><br>다운로드 링크나 플레이 영상을 확인해 주세요.</div></div>
      </div>`;

    return `
      <div class="page-head">
        <div class="crumbs"><a href="#jams">게임잼</a><span>/</span><a href="#jam-${esc(g.jam.id)}">${esc(g.jam.title)}</a><span>/</span><span>${esc(g.title)}</span></div>
        ${teamLabel(g) ? `<span class="team-no team-no-lg">${esc(teamLabel(g))}</span>` : ''}
        <h1>${esc(g.title)}</h1>
        <p>${esc(g.summary)}</p>
      </div>
      <div class="game-layout">
        <div>
          ${player}
        </div>
        <aside class="game-side">
          ${g.engine || g.genre ? `<div class="panel">
            <h4>Info</h4>
            <div class="card-meta" style="padding:0">
              ${g.engine ? `<span class="badge">${esc(g.engine)}</span>` : ''}
              ${g.genre ? `<span class="badge">${esc(g.genre)}</span>` : ''}
            </div>
          </div>` : ''}
          ${g.team?.length ? `<div class="panel"><h4>Team</h4><ul class="team">${[...g.team].sort((x, y) => x.localeCompare(y, 'ko')).map(n => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}
          ${g.controls?.length ? `<div class="panel"><h4>Controls</h4><ul class="controls">${g.controls.map(([k, v]) => `<li><kbd>${esc(k)}</kbd><span>${esc(v)}</span></li>`).join('')}</ul></div>` : ''}
          ${linkBtns ? `<div class="panel links"><h4>Links</h4>${linkBtns}</div>` : ''}
        </aside>
      </div>`;
  }

  function pageAbout() {
    const L = DATA.club.links || {};
    return `
      <section class="about">
        <img src="assets/logo-white.png" alt="LEVEL 0 로고">
        <div>
          <p class="eyebrow">About</p>
          <h1 style="font-size:clamp(30px,4.4vw,48px);font-weight:900;margin:6px 0 16px">${esc(DATA.club.name)}</h1>
          <p>${esc(DATA.club.intro)}</p>
          <div class="hero-actions" style="margin-top:24px">
            ${L.instagram ? `<a class="btn" href="${esc(L.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ''}
            ${L.github ? `<a class="btn" href="${esc(L.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
            ${L.contact ? `<span class="btn">✉ ${esc(L.contact)}</span>` : ''}
            <a class="btn btn-accent" href="#jams">게임잼 결과물 보기</a>
          </div>
        </div>
      </section>
      ${officersSection()}`;
  }

  /* 이름 여러 명("김OO, 이OO")은 가나다순으로 정렬 */
  const sortNames = str => String(str).split(',').map(n => n.trim()).filter(Boolean)
    .sort((x, y) => x.localeCompare(y, 'ko')).join(', ');

  /* 사람 이름 + (있으면) 학과·학번 — data/games.js 의 people 에서 찾아요 */
  const personInfo = name => {
    const p = (DATA.people || {})[name];
    if (!p) return '';
    return [p.dept, p.year ? `${p.year}학번` : ''].filter(Boolean).join(' · ');
  };
  const peopleHtml = (str, cls = '') => String(str).split(',').map(n => n.trim()).filter(Boolean)
    .sort((x, y) => x.localeCompare(y, 'ko'))
    .map(n => {
      const info = personInfo(n);
      return `<span class="person ${cls}"><span class="person-name">${esc(n)}</span>${info ? `<small class="person-info">${esc(info)}</small>` : ''}</span>`;
    }).join('');

  /* 역대 임원진 (data/games.js 의 officers) — 최신 기수가 맨 위 */
  function officersSection() {
    const list = DATA.officers || [];
    if (!list.length) return '';
    return `
      <section class="section officers">
        <div class="section-head">
          <div><p class="eyebrow">Officers</p><h2>역대 임원진</h2></div>
        </div>
        <ol class="officer-timeline">
          ${list.map((t, idx) => {
            const lead = (t.members || []).filter(([role]) => role === '회장');
            const rest = (t.members || []).filter(([role]) => role !== '회장' && role !== '파트장');
            // 파트장: { 기획: "...", 프로그래밍: "...", 아트: "..." } 형태면 파트별로, 글자면 한 줄로 표시
            const partRaw = (t.members || []).find(([role]) => role === '파트장');
            const partObj = partRaw && typeof partRaw[1] === 'object' ? partRaw[1] : null;
            if (partRaw && !partObj) rest.push(partRaw);
            const PART_ORDER = ['기획', '프로그래밍', '아트'];
            const parts = partObj ? Object.keys(partObj).sort((a, b) => {
              const ia = PART_ORDER.indexOf(a), ib = PART_ORDER.indexOf(b);
              return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
            }) : [];
            return `
            <li class="officer-term${idx === 0 ? ' is-current' : ''}">
              <div class="officer-when">
                <b>${esc(t.label || '')}</b>
                <span>${esc(t.year || '')}</span>
                ${idx === 0 ? '<em>현재</em>' : ''}
              </div>
              <div class="officer-card">
                ${lead.map(([role, name]) => `
                  <div class="officer-lead"><span class="officer-role">${esc(role)}</span><div class="officer-people">${peopleHtml(name, 'person-lead')}</div></div>`).join('')}
                ${rest.length ? `<ul class="officer-list">${rest.map(([role, name]) => `
                  <li><span class="officer-role">${esc(role)}</span><span class="officer-people">${peopleHtml(name)}</span></li>`).join('')}</ul>` : ''}
                ${parts.length ? `
                <div class="officer-parts">
                  <span class="officer-parts-title">파트장</span>
                  <div class="officer-parts-grid">
                    ${parts.map(part => `
                    <div class="officer-part" data-part="${esc(part)}">
                      <span class="officer-part-name">${esc(part)}</span>
                      <span class="officer-part-people">${peopleHtml(partObj[part])}</span>
                    </div>`).join('')}
                  </div>
                </div>` : ''}
              </div>
            </li>`;
          }).join('')}
        </ol>
      </section>`;
  }

  const pageNotFound = () => `<div class="page-head"><h1>페이지를 찾을 수 없어요</h1><p><a class="link-more" href="#">← 홈으로</a></p></div>`;

  /* ---------- 플레이 화면 동작 ---------- */
  function bindPlayer(g) {
    const box = document.getElementById('player');
    const cover = document.getElementById('play-cover');
    if (!box || !cover) return;
    const reload = document.getElementById('btn-reload');
    const full = document.getElementById('btn-full');

    // play.width / play.height 가 있으면: 게임을 원래 크기(px)로 띄운 뒤 플레이 칸에 맞게 축소/확대합니다.
    // (크기가 고정된 게임이 잘리는 문제 해결용 — itch.io Embed game 화면의 Width/Height 값을 넣으면 됨)
    let observer = null;
    const fitFrame = f => {
      const W = Number(g.play.width), H = Number(g.play.height);
      if (!(W > 0 && H > 0)) return;
      Object.assign(f.style, { inset: 'auto', left: '0', top: '0', width: W + 'px', height: H + 'px', transformOrigin: '0 0' });
      const fit = () => {
        const bw = box.clientWidth, bh = box.clientHeight;
        const sc = Math.min(bw / W, bh / H);
        f.style.transform = `translate(${(bw - W * sc) / 2}px, ${(bh - H * sc) / 2}px) scale(${sc})`;
      };
      fit();
      observer?.disconnect();
      observer = new ResizeObserver(fit);
      observer.observe(box);
    };

    // 무거운 게임(특히 Unity)은 페이지를 열자마자 불러오지 않고, 클릭했을 때 불러옵니다.
    const start = () => {
      box.querySelector('iframe')?.remove();
      const f = document.createElement('iframe');
      f.src = g.play.path;
      f.title = g.title;
      f.allow = 'autoplay; fullscreen; gamepad';
      f.allowFullscreen = true;
      box.appendChild(f);
      fitFrame(f);
      cover.hidden = true;
      cover.style.display = 'none';
      reload.hidden = false;
      f.addEventListener('load', () => f.focus());
      f.focus();
    };
    cover.addEventListener('click', start);
    reload.addEventListener('click', start);
    full.addEventListener('click', () => {
      if (!box.querySelector('iframe')) start();
      (box.requestFullscreen || box.webkitRequestFullscreen)?.call(box)?.catch?.(() => {});
    });
  }

  /* ---------- 라우터: # 값에 맞는 페이지 그리기 ---------- */
  function render() {
    const hash = decodeURIComponent(location.hash.slice(1));
    let html, nav = '', title = 'LEVEL 0 — 대구대학교 게임 개발 동아리', game = null;

    if (!hash) { html = pageHome(); nav = 'home'; }
    else if (hash === 'jams') { html = pageJams(); nav = 'jams'; title = '게임잼 — LEVEL 0'; }
    else if (hash === 'about') { html = pageAbout(); nav = 'about'; title = '동아리 소개 — LEVEL 0'; }
    else if (hash.startsWith('jam-') && findJam(hash.slice(4))) {
      const jam = findJam(hash.slice(4));
      html = pageJam(jam); nav = 'jams'; title = `${jam.title} — LEVEL 0`;
    } else if (hash.startsWith('game-') && (game = findGame(hash.slice(5)))) {
      html = pageGame(game); nav = 'jams'; title = `${game.title} — LEVEL 0`;
    } else html = pageNotFound();

    app.innerHTML = html;
    document.title = title;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
    if (game) bindPlayer(game);
    window.scrollTo(0, 0);
  }

  /* 푸터 링크 */
  const L = DATA.club.links || {};
  document.getElementById('footer-links').innerHTML = [
    L.instagram && `<a href="${esc(L.instagram)}" target="_blank" rel="noopener">Instagram</a>`,
    L.github && `<a href="${esc(L.github)}" target="_blank" rel="noopener">GitHub</a>`,
    L.contact && esc(L.contact)
  ].filter(Boolean).join(' · ') || '© LEVEL 0';

  addEventListener('hashchange', render);
  render();
})();
