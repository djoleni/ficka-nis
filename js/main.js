(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let cirMode = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = (html) => html; // imena pića ostaju na latinici (klasa .k)

  /* ---------- Izdvajamo: interaktivna lista ---------- */
  const DRINKS = [
    ['Pink Fićka', 'pink-ficka', 390, 'Cvekla, đumbir, cimet i kupina, toplo ili hladno.'],
    ['Ube Matcha Latte', 'ube-matcha', 440, 'Ljubičasti jam, batat, zeleni čaj, mleko.'],
    ['Espresso Martini', 'espresso-martini', 670, 'Votka, kafa, espreso, liker od kafe.'],
    ['Paja & Jare Ice Tea', 'ice-tea', 310, 'Dva ledena čaja, malina i kupina, sa listom nane.'],
    ['Italian Pink Sour', 'pink-sour', '', 'Roze koktel kiselkastog ukusa.'],
    ['Zastava 750', 'zastava-750', '', 'Kafa sa potpisom kuće: Fićko od kakaa u penici.'],
    ['Vruć Vetar', 'vruc-vetar', '', 'Topao napitak sa narandžom, uz staru štampu.'],
    ['Violet & White Kukumber', 'violet', '', 'Malina i krastavac u dva sveža koktela.']
  ];
  const dl = $('#dl'), frame = $('#frame'), capText = $('#capText'), capPrice = $('#capPrice');
  let cur = 0, timer, held = false;
  DRINKS.forEach(([n, img, p, d], i) => {
    const im = new Image(); im.src = `assets/img/${img}.webp`; im.alt = n; im.loading = 'lazy'; frame.appendChild(im);
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.className = 'k'; b.textContent = n;
    b.addEventListener('click', () => { held = true; show(i); });
    b.addEventListener('mouseenter', () => { held = true; show(i); });
    li.appendChild(b); dl.appendChild(li);
  });
  const imgs = $$('img', frame), btns = $$('button', dl);
  function show(i) {
    cur = i; clearTimeout(timer);
    imgs.forEach((m, k) => m.classList.toggle('on', k === i));
    btns.forEach((b, k) => { b.classList.toggle('on', k === i); b.style.setProperty('--t', '5s'); });
    capText.textContent = DRINKS[i][3];
    capText.dataset.o = DRINKS[i][3];
    if (cirMode) capText.textContent = toCyr(DRINKS[i][3]);
    capPrice.textContent = DRINKS[i][2] ? DRINKS[i][2] + ' din' : '';
    if (!held && !reduce) timer = setTimeout(() => show((i + 1) % DRINKS.length), 5000);
  }
  show(0);
  dl.addEventListener('mouseleave', () => { if (held) { held = false; show(cur); } });

  /* ---------- Novo u kafiću ---------- */
  const NEW = [
    ['Ube Latte malina', 'Ljubičasti jam, batat, pire malina, mleko', 390],
    ['Ube Espresso Latte', 'Ljubičasti jam, batat, espreso, mleko', 440],
    ['Matcha Latte malina', 'Zeleni čaj, pire malina, mleko', 390],
    ['Ube Matcha Latte', 'Ljubičasti jam, batat, zeleni čaj, mleko', 440],
    ['Golden Fićka', 'Kurkuma, cimet, đumbir, passion fruit', 390],
    ['Pink Fićka', 'Cvekla, đumbir, cimet, kupina', 390],
    ['Chai Fićka', 'Crni čaj, kardamom, cimet, vanila', 390],
    ['Ugljena Fićka', 'Kokosov šećer, kokos, aktivni ugalj', 390]
  ];
  $('#newlist').innerHTML = NEW.map(([n, d, p]) => `<li><b><span class="k">${n}</span><i class="k">${p}</i></b><span>${d}</span></li>`).join('');

  /* ---------- Karta ---------- */
  const MENU = {
    'Kafa': [['Espresso', '', 190], ['Americano', 'Espreso, topla voda', 190], ['Macchiato', 'Espreso, malo mleka', 210], ['Cappuccino', 'Espreso, mleko, mlečna pena', 230], ['Latte Macchiato', 'Mleko, espreso, mlečna pena', 250], ['Frappé', 'Instant kafa, mleko, led, šećer', 290], ['Mocha', 'Espreso, čokolada, mleko', 320], ['Freddo Espresso', 'Espreso, led', 340], ['Irish Coffee', 'Kafa, viski, šećer, šlag', 350], ['Flat White', 'Dupli espreso, mleko', 370], ['Freddo Cappuccino', 'Espreso, mlečna pena, led', 380], ['Ube Latte malina', 'Ljubičasti jam, batat, pire malina, mleko', 390]],
    'Čaj i toplo': [['Čaj', '', 210], ['Matcha Latte', '', 340], ['Raspberry Matcha Latte', '', 390], ['Ube Matcha Latte', 'Ljubičasti jam, batat, zeleni čaj, mleko', 440], ['Topla čokolada Eraclea', '', 390], ['Golden Fićka', 'Kurkuma, cimet, đumbir, passion fruit', 390], ['Chai Fićka', 'Crni čaj, kardamom, cimet, vanila', 390]],
    'Kokteli': [['Virgin Mojito', '', 420], ['Campari Fićka', '', 510], ['Hugo Spritz', 'Prosecco, zova, nana, limeta, soda', 590], ['Aperol Spritz', 'Aperol, prosecco, soda', 610], ['Mojito', 'Rum, limeta, nana, soda', 660], ['Negroni', 'Džin, kampari, vermut', 670], ['Espresso Martini', 'Votka, kafa, espreso, liker od kafe', 670], ['Whiskey Sour', 'Viski, limun, šećer', 690], ['Strawberry Mojito', 'Rum, limeta, nana, soda', 710], ['Pornstar Martini', 'Votka, marakuja, vanila, prosecco', 750]],
    'Osveženje': [['Ice Tea Paja', '', 155], ['Ice Tea Jare', '', 155], ['Coca-Cola', '0.25l', 230], ['Limunada', '', 270], ['Limunada malina / jagoda / kupina', '', 310], ['Paja Malina Ice Tea', '', 310], ['Jare Kupina Ice Tea', '', 310], ['Ceđena pomorandža', '', 340], ['Plazma Šejk', '', 370], ['Hladno ceđena malina', '', 390]],
    'Pivo i vino': [['Amstel', '0.33l', 310], ['Birra Moretti', '0.33l', 330], ['Heineken', '0.25l', 330], ['Somersby', '0.33l', 390], ['Vermut', '0.03l', 290], ['Prosecco', '', 420], ['Vino, čaša', 'Tamjanika, Bonaca, Barbara, Nostalgija · 0.187l', 420]]
  };
  const tabs = $('#tabs'), list = $('#list');
  const renderList = (name) => {
    list.innerHTML = MENU[name].map(([n, d, p]) => `<li><span><span class="n k">${n}</span>${d ? `<span class="d">${d}</span>` : ''}</span><span class="dots"></span><span class="p k">${p}</span></li>`).join('');
    list.classList.remove('swap'); void list.offsetWidth; list.classList.add('swap');
    if (cirMode) transliterate(list, true);
  };
  Object.keys(MENU).forEach((name, i) => {
    const b = document.createElement('button');
    b.className = 'tab'; b.type = 'button'; b.role = 'tab'; b.textContent = name; b.setAttribute('aria-selected', i === 0);
    b.addEventListener('click', () => { $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', t === b)); renderList(name); });
    tabs.appendChild(b);
  });
  renderList('Kafa');

  /* ---------- Radno vreme ---------- */
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Belgrade', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
  const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find(p => p.type === 'weekday').value);
  const h = +parts.find(p => p.type === 'hour').value % 24;
  $(`#hours li[data-d="${d}"]`)?.classList.add('today');
  const opens = d === 0 ? 10 : 8, st = $('#status');
  st.classList.toggle('open', h >= opens);
  st.textContent = h >= opens ? 'Otvoreno sada · radimo do 00:00' : `Trenutno zatvoreno · otvaramo u ${String(opens).padStart(2, '0')}:00`;

  /* ---------- Navigacija + auto na putu ---------- */
  const nav = $('#nav'), menu = $('#menu'), burger = $('#burger'), car = $('#roadCar');
  const links = $$('a', menu), SPY = ['onama', 'izdvajamo', 'novo', 'karta', 'dogadjaji', 'atmosfera', 'kontakt'].map(id => [id, document.getElementById(id)]);
  let lastY = scrollY;
  const onScroll = () => {
    nav.classList.toggle('solid', scrollY > 30);
    if (Math.abs(scrollY - lastY) > 2) { car.style.setProperty('--f', scrollY > lastY ? -1 : 1); lastY = scrollY; }
    const line = nav.offsetHeight + 120, atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    let cur = '';
    SPY.forEach(([id, el]) => { if (el.getBoundingClientRect().top <= line) cur = id; });
    if (atEnd) cur = 'kontakt';
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + (cur === 'novo' ? 'izdvajamo' : cur)));
    const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    car.style.transform = `translate3d(${p * (innerWidth - 40)}px,0,0)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggleMenu = (f) => { const o = f ?? !menu.classList.contains('open'); menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => toggleMenu());
  // Tačno sletanje: sadržaj sekcije (ne njen prazan padding) staje ispod navigacije
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1), t = id === 'top' ? null : document.getElementById(id);
    if (id !== 'top' && !t) return;
    e.preventDefault(); toggleMenu(false);
    const y = t ? t.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(t).paddingTop) - nav.offsetHeight - 24 : 0;
    scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
    cleanHash();
  }));
  // Bez # u adresi: URL ostaje čist posle navigacije
  function cleanHash() { if (location.hash) history.replaceState(null, '', location.pathname + location.search); }
  if (location.hash.length > 1) {
    const t0 = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t0) setTimeout(() => { const y = t0.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(t0).paddingTop) - nav.offsetHeight - 24; scrollTo({ top: Math.max(0, y), behavior: 'auto' }); cleanHash(); }, 50);
    else cleanHash();
  }

  /* ---------- Hero: reflektor + 3D nagib znaka ---------- */
  const hero = $('.hero'), sign = $('#sign'), spot = $('#spot');
  if (!reduce && matchMedia('(hover:hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      spot.style.setProperty('--mx', x * 100 + '%'); spot.style.setProperty('--my', y * 100 + '%');
      sign.style.transform = `rotateY(${(x - .5) * 8}deg) rotateX(${(.5 - y) * 6}deg)`;
    });
    hero.addEventListener('mouseleave', () => sign.style.transform = '');
  }

  /* ---------- Reveal ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Lightbox ---------- */
  const lb = $('#lb'), lbi = $('img', lb);
  $$('.mason img').forEach(i => i.addEventListener('click', () => { lbi.src = i.src; lbi.alt = i.alt; lb.hidden = false; }));
  lb.addEventListener('click', () => lb.hidden = true);
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

  /* ---------- Latinica → ćirilica (imena pića, DJ-evi i brend ostaju) ---------- */
  const DI = { lj: 'љ', Lj: 'Љ', LJ: 'Љ', nj: 'њ', Nj: 'Њ', NJ: 'Њ', dž: 'џ', Dž: 'Џ', DŽ: 'Џ' };
  const MAP = { a:'а',b:'б',c:'ц',č:'ч',ć:'ћ',d:'д',đ:'ђ',e:'е',f:'ф',g:'г',h:'х',i:'и',j:'ј',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',r:'р',s:'с',š:'ш',t:'т',u:'у',v:'в',z:'з',ž:'ж' };
  const FIX = [[/matcha?/gi, 'mača'], [/matchi/gi, 'mači'], [/match/gi, 'mač'], [/passion fruit/gi, 'pašn frut'], [/prosecco/gi, 'proseko'], [/espresso/gi, 'espreso'], [/w/gi, 'v'], [/y/gi, 'j'], [/x/gi, 'ks'], [/q/gi, 'k']];
  const norm = (s) => { FIX.forEach(([r, t]) => { s = s.replace(r, (m) => m[0] !== m[0].toLowerCase() ? t[0].toUpperCase() + t.slice(1) : t); }); return s; };
  function toCyr(s) {
    s = norm(s); let o = '';
    for (let i = 0; i < s.length; i++) {
      const t = s.substr(i, 2); if (DI[t]) { o += DI[t]; i++; continue; }
      const c = s[i], l = c.toLowerCase(); o += MAP[l] ? (c === l ? MAP[l] : MAP[l].toUpperCase()) : c;
    }
    return o;
  }
  const store = new WeakMap();
  function transliterate(root, on) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => !n.nodeValue.trim() || n.parentElement.closest('.k,script,style,iframe,.cap-price') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const ns = []; while (w.nextNode()) ns.push(w.currentNode);
    ns.forEach(n => { if (!store.has(n)) store.set(n, n.nodeValue); n.nodeValue = on ? toCyr(store.get(n)) : store.get(n); });
  }
  const applyScript = (cir) => {
    cirMode = cir; document.documentElement.lang = cir ? 'sr-Cyrl' : 'sr-Latn';
    $$('#scriptToggle span').forEach(s => s.classList.toggle('on', (s.dataset.s === 'cir') === cir));
    transliterate(document.body, cir); capText.textContent = cir ? toCyr(DRINKS[cur][3]) : DRINKS[cur][3];
    try { localStorage.setItem('ficka-script', cir ? 'cir' : 'lat'); } catch (e) {}
  };
  $('#scriptToggle').addEventListener('click', () => applyScript(!cirMode));
  let saved = null; try { saved = localStorage.getItem('ficka-script'); } catch (e) {}
  if (saved === 'cir') applyScript(true);
})();
