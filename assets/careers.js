(function(){
  'use strict';
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  $('#year').textContent = new Date().getFullYear();

  var burger = $('#burger'), nav = $('#navlinks');
  burger.addEventListener('click', function(){ burger.setAttribute('aria-expanded', String(nav.classList.toggle('open'))); });
  nav.addEventListener('click', function(e){ if (e.target.closest('a')){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });

  /* Teams and roles. Edit these lists to publish or close roles. */
  var TEAMS = [
    { name: 'Field Operations', p: 'Register farmers, run field visits, soil tests and residue collection.' },
    { name: 'Production', p: 'Turn farm residue into quality bio-briquettes on our DBN-funded equipment.' },
    { name: 'Academy', p: 'Teach crop, livestock and agribusiness courses online and on the farm.' },
    { name: 'Partnerships & Grants', p: 'Win and manage programmes with governments, donors and companies.' },
    { name: 'Marketplace & Sales', p: 'Connect verified farmers with buyers and grow briquette sales.' },
    { name: 'Digital & Media', p: 'Tell the AgriRenew story and build the tools our teams use.' }
  ];
  var ROLES = [
    { title: 'Field Extension Officer', team: 'Field Operations', type: 'Full-time', where: 'Abuja + field travel',
      about: 'Be the person partner farmers trust: register farms, run soil tests, advise on planting and log residue deliveries.',
      do: ['Register and profile new partner farmers', 'Run soil tests and farm visits', 'Train farmers on residue collection', 'Keep accurate records on our apps'],
      need: ['Diploma or degree in agriculture, or equivalent field experience', 'Comfortable travelling to rural communities', 'Good with people and with a smartphone'] },
    { title: 'Briquette Production Technician', team: 'Production', type: 'Full-time', where: 'Abuja',
      about: 'Run our briquette line safely and keep quality high from raw residue to packed product.',
      do: ['Prepare, dry and crush feedstock', 'Operate and maintain the press', 'Run quality checks on each batch', 'Follow safety procedures'],
      need: ['Technical or vocational background', 'Experience with machinery', 'Attention to detail and safety'] },
    { title: 'Academy Instructor, Crop Production', team: 'Academy', type: 'Part-time', where: 'Hybrid',
      about: 'Teach practical crop production online and lead field days on demonstration farms.',
      do: ['Deliver weekly online lessons', 'Lead field days and practical sessions', 'Review learner assignments', 'Improve course materials'],
      need: ['Strong practical crop production experience', 'Clear communicator who enjoys teaching', 'Agriculture qualification preferred'] },
    { title: 'Partnerships & Grants Associate', team: 'Partnerships & Grants', type: 'Full-time', where: 'Abuja / hybrid',
      about: 'Help AgriRenew win and deliver programmes with governments, donors and companies.',
      do: ['Find and track funding and tender opportunities', 'Draft proposals, budgets and reports', 'Coordinate partner meetings', 'Maintain our impact data'],
      need: ['Excellent writing in English', 'Experience with proposals or development projects', 'Organised and deadline-driven'] },
    { title: 'Content & Social Media Intern', team: 'Digital & Media', type: 'Internship / NYSC', where: 'Abuja / hybrid',
      about: 'Capture life in the field and share it: photos, short videos and posts about our work.',
      do: ['Photograph and film field activities', 'Write and schedule social posts', 'Support Academy and events promotion'],
      need: ['A portfolio of photos, videos or posts', 'Comfortable in the field', 'Basic editing skills'] }
  ];

  var ALL = 'All teams', ALLT = 'All types';
  var teamSel = $('#rf-team'), typeSel = $('#rf-type'), list = $('#roleList');
  teamSel.innerHTML = [ALL].concat(TEAMS.map(function(t){ return t.name; })).map(function(t){ return '<option>' + esc(t) + '</option>'; }).join('');
  typeSel.innerHTML = [ALLT].concat(ROLES.map(function(r){ return r.type; }).filter(function(t, i, a){ return a.indexOf(t) === i; })).map(function(t){ return '<option>' + esc(t) + '</option>'; }).join('');

  $('#teamCards').innerHTML = TEAMS.map(function(t){
    var n = ROLES.filter(function(r){ return r.team === t.name; }).length;
    return '<button type="button" class="tcard" data-team="' + esc(t.name) + '"><h3>' + esc(t.name) + '</h3><p>' + esc(t.p) + '</p>' +
      '<span class="tc-count">' + (n ? n + ' open role' + (n > 1 ? 's' : '') + ' →' : 'Join the talent pool →') + '</span></button>';
  }).join('');
  $('#teamCards').addEventListener('click', function(e){
    var b = e.target.closest('.tcard'); if (!b) return;
    teamSel.value = b.getAttribute('data-team'); typeSel.value = ALLT;
    renderRoles();
    $('#roles').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  function renderRoles(){
    var shown = ROLES.filter(function(r){
      return (teamSel.value === ALL || r.team === teamSel.value) && (typeSel.value === ALLT || r.type === typeSel.value);
    });
    list.innerHTML = shown.map(function(r){
      return '<details class="role"><summary><h3>' + esc(r.title) + '</h3><span class="r-toggle">Details</span>' +
        '<div class="r-meta"><span>' + esc(r.team) + '</span><span>' + esc(r.type) + '</span><span>' + esc(r.where) + '</span></div></summary>' +
        '<div class="r-body"><p>' + esc(r.about) + '</p>' +
        '<div><h4>What you will do</h4><ul>' + r.do.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div><h4>What you need</h4><ul>' + r.need.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<a class="btn" href="#apply" data-role="' + esc(r.title) + '">Apply for this role</a></div></details>';
    }).join('');
    $('#roleEmpty').hidden = shown.length > 0;
    $('#roleCount').textContent = shown.length + ' open role' + (shown.length === 1 ? '' : 's');
  }
  teamSel.addEventListener('change', renderRoles);
  typeSel.addEventListener('change', renderRoles);
  renderRoles();

  var roleSel = $('#a-role');
  roleSel.innerHTML = ROLES.map(function(r){ return '<option>' + esc(r.title) + '</option>'; }).join('') +
    '<option>Internship / NYSC placement</option><option>General application (talent pool)</option>';
  document.addEventListener('click', function(e){
    var a = e.target.closest('[data-role]');
    if (a) roleSel.value = a.getAttribute('data-role');
  });

  var EMAIL = $('#orgEmail').textContent.trim();
  $$('.email-slot').forEach(function(s){ s.textContent = EMAIL; });
  $('#applyForm').addEventListener('submit', function(e){
    e.preventDefault();
    var v = function(id){ return $('#' + id).value.trim(); };
    var err = $('#formError');
    if (!v('a-name')){ err.textContent = 'Add your name so we know who is applying.'; err.hidden = false; $('#a-name').focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('a-email'))){ err.textContent = 'Enter a valid email address, like ada@example.com.'; err.hidden = false; $('#a-email').focus(); return; }
    err.hidden = true;
    var subject = 'Application: ' + v('a-role') + ' – ' + v('a-name');
    var body = 'Name: ' + v('a-name') + '\nEmail: ' + v('a-email') + '\nPhone: ' + (v('a-phone') || '—') + '\nLocation: ' + (v('a-loc') || '—') +
      '\nRole: ' + v('a-role') + '\nLinkedIn / portfolio: ' + (v('a-link') || '—') + '\n\n' + (v('a-msg') || '') + '\n\n[Please attach your CV]';
    $('#sentBody').textContent = 'To: ' + EMAIL + '\nSubject: ' + subject + '\n\n' + body;
    $('#mailLink').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    $('#sent').hidden = false;
  });
  $('#copyBtn').addEventListener('click', function(){
    var btn = this, pre = $('#sentBody');
    function fallback(){
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = 'Selected: press Ctrl+C';
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(pre.textContent).then(function(){ btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = 'Copy message'; }, 2000); }, fallback);
    } else fallback();
  });
})();
