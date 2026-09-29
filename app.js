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

  /* --- 复制分享链接 --- */
  var copyBtn = document.getElementById('copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = location.href;
      var done = function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = '已复制 ✓';
        setTimeout(function () { copyBtn.textContent = old; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('复制此链接：', url); });
      } else {
        window.prompt('复制此链接：', url);
      }
    });
  }

  /* --- 碳排快算 --- */
  /* 排放因子（粗算用）：全国电网平均 0.5703 kgCO2e/kWh；天然气 2.16 kg/m3；
     柴油 2.63 kg/L；汽油 2.31 kg/L；外购蒸汽 110 kg/GJ；自来水 0.34 kg/m3 */
  var FACTORS = [
    { id: 'in-elec',   name: '外购电力', unit: 'kWh', f: 0.5703, scope: 'Scope 2' },
    { id: 'in-gas',    name: '天然气',   unit: 'm³',  f: 2.16,   scope: 'Scope 1' },
    { id: 'in-diesel', name: '柴油',     unit: 'L',   f: 2.63,   scope: 'Scope 1' },
    { id: 'in-petrol', name: '汽油',     unit: 'L',   f: 2.31,   scope: 'Scope 1' },
    { id: 'in-steam',  name: '外购蒸汽', unit: 'GJ',  f: 110,    scope: 'Scope 2' },
    { id: 'in-water',  name: '自来水',   unit: 'm³',  f: 0.34,   scope: 'Scope 3' }
  ];

  var calcBtn = document.getElementById('calcBtn');
  var calcOut = document.getElementById('calcOut');

  function num(id) {
    var el = document.getElementById(id);
    var v = el ? parseFloat(el.value) : 0;
    return (isNaN(v) || v < 0) ? 0 : v;
  }

  function runCalc() {
    if (!calcOut) return;
    var rows = FACTORS.map(function (x) {
      var q = num(x.id);
      return { name: x.name, unit: x.unit, scope: x.scope, kg: q * x.f, q: q };
    });
    var total = rows.reduce(function (s, r) { return s + r.kg; }, 0);
    var any = rows.some(function (r) { return r.q > 0; });

    if (!any) {
      calcOut.innerHTML = '<p class="muted">请先填入至少一项用量，再点「计算排放量」。</p>';
      return;
    }

    var max = Math.max.apply(null, rows.map(function (r) { return r.kg; })) || 1;
    var html = '<div class="calc-total"><b>' + (total / 1000).toFixed(3) +
      '</b><span>tCO₂e · 合计约 ' + Math.round(total).toLocaleString('zh-CN') + ' kg</span></div>';
    html += '<div class="calc-rows">';
    rows.forEach(function (r) {
      if (r.kg <= 0) return;
      var pct = (r.kg / max * 100).toFixed(1);
      html += '<div class="calc-row">' +
        '<span class="cr-name">' + r.name + ' <em style="color:#6B7A73;font-size:11px">' + r.scope + '</em></span>' +
        '<span class="cr-bar"><i style="width:' + pct + '%"></i></span>' +
        '<span class="cr-val">' + r.kg.toLocaleString('zh-CN', { maximumFractionDigits: 1 }) + ' kg</span>' +
        '</div>';
    });
    html += '</div><p class="calc-foot">粗算结果，仅供参考。正式盘查请用 GHG Protocol 与最新本地排放因子，' +
      '电力因子此处取全国电网平均值 0.5703 kgCO₂e/kWh。</p>';
    calcOut.innerHTML = html;
  }

  if (calcBtn) calcBtn.addEventListener('click', runCalc);
  var calcReset = document.getElementById('calcReset');
  if (calcReset) {
    calcReset.addEventListener('click', function () {
      FACTORS.forEach(function (x) {
        var el = document.getElementById(x.id);
        if (el) el.value = '';
      });
      if (calcOut) calcOut.innerHTML = '<p class="muted">填入数字后点「计算排放量」。</p>';
    });
  }

  /* --- 自查清单 --- */
  var chkList = document.getElementById('chkList');
  var chkBar = document.getElementById('chkBar');
  var chkCount = document.getElementById('chkCount');

  function refreshChk() {
    if (!chkList) return;
    var boxes = chkList.querySelectorAll('input[type=checkbox]');
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    if (chkBar) chkBar.style.width = (done / boxes.length * 100) + '%';
    if (chkCount) chkCount.textContent = done + ' / ' + boxes.length;
  }

  if (chkList) {
    chkList.addEventListener('change', refreshChk);
    refreshChk();
  }

  var chkCopy = document.getElementById('chkCopy');
  if (chkCopy) {
    chkCopy.addEventListener('click', function () {
      var lines = ['# ESG 报告自查清单\n'];
      chkList.querySelectorAll('li').forEach(function (li) {
        var b = li.querySelector('input[type=checkbox]');
        lines.push('- [' + (b.checked ? 'x' : ' ') + '] ' + li.textContent.trim());
      });
      var text = lines.join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var old = chkCopy.textContent;
          chkCopy.textContent = '已复制 ✓';
          setTimeout(function () { chkCopy.textContent = old; }, 1800);
        });
      } else {
        window.prompt('复制清单：', text);
      }
    });
  }

  var chkPrint = document.getElementById('chkPrint');
  if (chkPrint) {
    chkPrint.addEventListener('click', function () {
      var section = document.getElementById('tools');
      var card = chkList ? chkList.closest('.tool') : null;
      if (!section || !card) { window.print(); return; }
      section.classList.add('print-target');
      card.classList.add('print-me');
      window.print();
      setTimeout(function () {
        section.classList.remove('print-target');
        card.classList.remove('print-me');
      }, 500);
    });
  }
})();
