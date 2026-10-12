/* Let's Camel Tours: cookie consent + Google tag loader.
   Nothing is sent to Google until the visitor clicks "Accept".
   Choice is stored in localStorage ("lct-cookie-consent": "granted" | "denied"). */
(function () {
  var ADS_ID = 'AW-18468814926';
  var GA_ID = 'G-DEQTNVP5PH';
  var KEY = 'lct-cookie-consent';
  var LANGS = ['en', 'fr', 'es', 'de'];

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // --- gtag stub: safe to call from page scripts (e.g. WhatsApp conversion) at any time.
  // Until the visitor clicks "Accept" every call is dropped, so nothing is queued or sent to Google.
  window.dataLayer = window.dataLayer || [];
  var state = getChoice() === 'granted' ? 'granted' : (getChoice() === 'denied' ? 'denied' : 'pending');
  window.gtag = function () {
    if (state !== 'granted') return;
    window.dataLayer.push(arguments);
  };

  var loaded = false;
  function loadGoogle() {
    if (loaded) return;
    loaded = true;
    state = 'granted';
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', ADS_ID);
    window.gtag('config', GA_ID);
  }

  function clearGoogleCookies() {
    // Remove first-party Google cookies (_ga, _ga_XXXX, _gcl_*, _gid) set earlier.
    var host = location.hostname.split('.');
    var domains = ['', location.hostname, '.' + location.hostname];
    if (host.length > 2) domains.push('.' + host.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_gcl_)/.test(name)) {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  // --- Translations (also usable by the site's applyLang through data-* attributes)
  var T = {
    text: {
      en: 'We use cookies to understand how visitors use our site and to measure our ads. You can accept or refuse.',
      fr: 'Nous utilisons des cookies pour comprendre comment le site est utilisé et mesurer nos publicités. Vous pouvez accepter ou refuser.',
      es: 'Usamos cookies para entender cómo se usa nuestro sitio y medir nuestros anuncios. Puedes aceptar o rechazar.',
      de: 'Wir verwenden Cookies, um die Nutzung unserer Website zu verstehen und unsere Werbung zu messen. Sie können akzeptieren oder ablehnen.'
    },
    more: { en: 'Privacy Policy', fr: 'Politique de Confidentialité', es: 'Política de Privacidad', de: 'Datenschutz' },
    accept: { en: 'Accept', fr: 'Accepter', es: 'Aceptar', de: 'Akzeptieren' },
    refuse: { en: 'Refuse', fr: 'Refuser', es: 'Rechazar', de: 'Ablehnen' },
    settings: { en: 'Cookie settings', fr: 'Paramètres des cookies', es: 'Configuración de cookies', de: 'Cookie-Einstellungen' }
  };

  function currentLang() {
    var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return LANGS.indexOf(l) !== -1 ? l : 'en';
  }
  function attrs(key) {
    return ' data-en="' + T[key].en + '" data-fr="' + T[key].fr + '" data-es="' + T[key].es + '" data-de="' + T[key].de + '"';
  }

  var CSS = '' +
    '#lct-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:760px;margin:0 auto;' +
    'background:#001f3f;color:rgba(255,255,255,.9);border-radius:14px;padding:16px 18px;box-shadow:0 12px 40px rgba(0,0,0,.35);' +
    'display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-size:14px;line-height:1.5;font-family:inherit;border:1px solid rgba(255,255,255,.12)}' +
    '#lct-consent[hidden]{display:none}' +
    '#lct-consent p{margin:0;flex:1 1 320px;font-size:13.5px}' +
    '#lct-consent p a{color:#ea9868;text-decoration:underline;white-space:nowrap}' +
    '#lct-consent .lct-btns{display:flex;gap:10px;flex:0 0 auto}' +
    '#lct-consent button{font:inherit;font-size:14px;font-weight:700;cursor:pointer;border-radius:999px;padding:11px 22px;min-height:44px;border:2px solid #E07A3E;transition:background .2s,color .2s}' +
    '#lct-consent .lct-accept{background:#E07A3E;color:#fff}' +
    '#lct-consent .lct-accept:hover{background:#ea9868;border-color:#ea9868}' +
    '#lct-consent .lct-refuse{background:transparent;color:#fff;border-color:rgba(255,255,255,.45)}' +
    '#lct-consent .lct-refuse:hover{border-color:#fff}' +
    '#lct-consent button:focus-visible{outline:2px solid #ea9868;outline-offset:2px}' +
    '.lct-consent-open .whatsapp-btn{bottom:calc(var(--lct-h,120px) + 28px) !important}' +
    '.lct-cookie-settings{background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;opacity:.9}' +
    '.lct-cookie-settings:hover{color:#ea9868}' +
    '@media(max-width:600px){#lct-consent{left:10px;right:10px;bottom:10px;padding:14px;gap:12px}' +
    '#lct-consent .lct-btns{width:100%}#lct-consent .lct-btns button{flex:1}}';

  function setText(root, lang) {
    root.querySelectorAll('[data-en]').forEach(function (el) { el.textContent = el.dataset[lang]; });
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'lct-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookies');
    banner.hidden = true;
    banner.innerHTML =
      '<p><span' + attrs('text') + '></span> <a href="privacy-policy.html"' + attrs('more') + '></a></p>' +
      '<div class="lct-btns">' +
      '<button type="button" class="lct-refuse"' + attrs('refuse') + '></button>' +
      '<button type="button" class="lct-accept"' + attrs('accept') + '></button>' +
      '</div>';
    document.body.appendChild(banner);
    setText(banner, currentLang());

    function place() { document.documentElement.style.setProperty('--lct-h', banner.offsetHeight + 'px'); }
    function show() { setText(banner, currentLang()); banner.hidden = false; document.body.classList.add('lct-consent-open'); place(); }
    function hide() { banner.hidden = true; document.body.classList.remove('lct-consent-open'); }
    window.addEventListener('resize', function () { if (!banner.hidden) place(); });

    banner.querySelector('.lct-accept').addEventListener('click', function () {
      setChoice('granted'); hide(); loadGoogle();
    });
    banner.querySelector('.lct-refuse').addEventListener('click', function () {
      var wasGranted = state === 'granted';
      setChoice('denied'); state = 'denied'; window.dataLayer.length = 0; hide();
      window['ga-disable-' + GA_ID] = true; window['ga-disable-' + ADS_ID] = true;
      if (wasGranted) { clearGoogleCookies(); }
    });

    // Footer link to change the choice
    var fb = document.querySelector('.footer-bottom');
    if (fb) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lct-cookie-settings';
      btn.setAttribute('data-en', T.settings.en);
      btn.setAttribute('data-fr', T.settings.fr);
      btn.setAttribute('data-es', T.settings.es);
      btn.setAttribute('data-de', T.settings.de);
      btn.textContent = T.settings[currentLang()];
      btn.addEventListener('click', show);
      fb.appendChild(btn);
    }

    if (state === 'pending') show();
  }

  if (state === 'granted') loadGoogle();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
