/* Felles for forsiden og galleriet: toppmeny, årringer og rolig innrulling */
(function () {
  document.documentElement.classList.add('js');

  const aar = document.getElementById('aar');
  if (aar) aar.textContent = new Date().getFullYear();

  /* samme "tilfeldige" tegning hver gang, så siden ikke ser ny ut ved hver lasting */
  const fro = (s) => () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const r1 = (v) => v.toFixed(1);

  /* ---------- toppmenyen får bakgrunn når man har rullet litt ---------- */
  const bar = document.querySelector('.bar');
  if (bar && !bar.classList.contains('alltid')) {
    const sjekk = () => bar.classList.toggle('solid', window.scrollY > 40);
    window.addEventListener('scroll', sjekk, { passive: true });
    sjekk();
  }

  /* ---------- menyknappen pa smale skjermer ---------- */
  const knapp = document.querySelector('.bar-meny');
  if (bar && knapp) {
    const sett = (apen) => {
      bar.classList.toggle('apen', apen);
      knapp.setAttribute('aria-expanded', apen ? 'true' : 'false');
      knapp.setAttribute('aria-label', apen ? 'Lukk menyen' : 'Meny');
    };
    knapp.addEventListener('click', () => sett(!bar.classList.contains('apen')));
    bar.querySelectorAll('.bar-links a').forEach((a) => a.addEventListener('click', () => sett(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') sett(false); });
    document.addEventListener('click', (e) => { if (!bar.contains(e.target)) sett(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 980) sett(false); });
  }

  /* ---------- årringer ---------- */
  document.querySelectorAll('.ringer').forEach((el, nr) => {
    const rnd = fro(41 + nr * 17);
    const n = 26;
    // samme ujevnhet i alle ringene, ellers ser det ut som bølger og ikke ved
    const fase = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    const ox = (rnd() - .5) * 26, oy = (rnd() - .5) * 26;      // margen sitter sjelden midt i stokken
    let ut = '';
    let radius = 2.5;
    for (let i = 0; i < n; i++) {
      radius += 2.1 + rnd() * 2.6;
      const k = 1 - i / (n - 1);
      const cx = ox * k, cy = oy * k;
      const a = .05 + i * .0012;
      let d = '';
      for (let p = 0; p <= 72; p++) {
        const v = p / 72 * 6.2832;
        const rr = radius * (1 + a * Math.sin(v * 2 + fase[0]) + a * .6 * Math.sin(v * 3 + fase[1]) + a * .35 * Math.sin(v * 7 + fase[2] + i * .12));
        d += (p ? 'L' : 'M') + r1(cx + Math.cos(v) * rr) + ' ' + r1(cy + Math.sin(v) * rr);
      }
      ut += `<path d="${d}Z" fill="none" stroke="currentColor" stroke-width="${(.25 + rnd() * .75).toFixed(2)}"/>`;
    }
    // tørkesprekk fra margen og ut
    const sv = fase[0];
    ut += `<path d="M${r1(ox)} ${r1(oy)} L${r1(ox * .4 + Math.cos(sv) * radius * .55)} ${r1(oy * .4 + Math.sin(sv) * radius * .55)} L${r1(Math.cos(sv + .04) * radius * 1.02)} ${r1(Math.sin(sv + .04) * radius * 1.02)}" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/>`;
    const s = radius * 1.1;
    el.innerHTML = `<svg viewBox="${r1(-s)} ${r1(-s)} ${r1(s * 2)} ${r1(s * 2)}" aria-hidden="true">${ut}</svg>`;
  });

  /* ---------- rolig innrulling ---------- */
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((treff) => {
      treff.forEach((t) => { if (t.isIntersecting) { t.target.classList.add('inn'); io.unobserve(t.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach((el) => io.observe(el));
  } else {
    rv.forEach((el) => el.classList.add('inn'));
  }
})();
