/* ESG Knowledge Hub · 交互脚本 */
(function () {
  'use strict';

  /* --- 移动端菜单 --- */
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) nav.classList.remove('open');
    });
  }

  /* --- 导航高亮（滚动监听） --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s;
    });
    links.forEach(function (a) {
      var on = current && a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('active', !!on);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* --- 通用过滤 --- */
  function bindFilter(inputId, gridId, countId) {
    var input = document.getElementById(inputId);
    var grid = document.getElementById(gridId);
    var count = document.getElementById(countId);
    if (!input || !grid) return;
    var items = Array.prototype.slice.call(grid.children);

    function run() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (el) {
        var hay = (el.textContent + ' ' + (el.dataset.k || '') + ' ' + (el.dataset.cat || '')).toLowerCase();
        var hit = !q || hay.indexOf(q) > -1;
        el.hidden = !hit;
        if (hit) shown++;
      });
      if (count) count.textContent = q ? ('匹配 ' + shown + ' / ' + items.length + ' 条') : ('共 ' + items.length + ' 条');
    }

    input.addEventListener('input', run);
    run();
  }

  bindFilter('resSearch', 'resGrid', 'resCount');
  bindFilter('glossarySearch', 'glossGrid', 'glossaryCount');
})();
