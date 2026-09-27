(function(){
  var EMAIL = document.getElementById('contact-email').textContent.trim();
  document.getElementById('year').textContent = new Date().getFullYear();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu */
  var menuBtn = document.getElementById('menu-btn'), links = document.getElementById('nav-links');
  menuBtn.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  links.addEventListener('click', function(e){
    if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); menuBtn.textContent = 'Menu'; }
  });

  /* pipeline animation: starts fully passed, then replays */
  var lines = Array.prototype.slice.call(document.querySelectorAll('#pipeline .term-line'));
  var status = document.getElementById('pipe-status');
  function setLine(el, state){
    el.classList.remove('run','pend');
    var st = el.querySelector('.st');
    if (state === 'done') st.textContent = '✓';
    else if (state === 'run') { el.classList.add('run'); st.textContent = '◐'; }
    else { el.classList.add('pend'); st.textContent = '·'; }
  }
  function replay(){
    var i = 0;
    lines.forEach(function(l){ setLine(l,'pend'); });
    status.textContent = '● deploying…'; status.style.color = 'var(--term-run)';
    (function tick(){
      if (i > 0) setLine(lines[i-1],'done');
      if (i < lines.length) { setLine(lines[i],'run'); i++; setTimeout(tick, 650); }
      else { status.textContent = '● released v2.14.0'; status.style.color = ''; setTimeout(replay, 6000); }
    })();
  }
  if (!reduce) setTimeout(replay, 3500);

  /* team builder */
  var ROLES = [
    ['frontend','Frontend engineer','React, Next.js, Vue',1],
    ['backend','Backend engineer','Node.js, Python, Go, Laravel',2],
    ['mobile','Mobile engineer','Flutter, React Native',1],
    ['devops','DevOps / cloud engineer','AWS, Terraform, Kubernetes',0],
    ['qa','QA engineer','Manual & automated testing',0],
    ['design','Product designer','Figma, research',0]
  ];
  var rolesEl = document.getElementById('roles');
  rolesEl.innerHTML = ROLES.map(function(r){
    return '<div class="role"><label for="r-'+r[0]+'">'+r[1]+'<small>'+r[2]+'</small></label>'+
      '<div class="step"><button type="button" data-d="-1" data-t="r-'+r[0]+'" aria-label="Fewer '+r[1]+'s">−</button>'+
      '<input type="number" id="r-'+r[0]+'" min="0" max="20" value="'+r[3]+'" inputmode="numeric">'+
      '<button type="button" data-d="1" data-t="r-'+r[0]+'" aria-label="More '+r[1]+'s">+</button></div></div>';
  }).join('');
  function counts(){
    return ROLES.map(function(r){
      var v = parseInt(document.getElementById('r-'+r[0]).value,10);
      return [r[1], isNaN(v) ? 0 : Math.max(0, Math.min(20, v))];
    });
  }
  function updateTeam(){
    var c = counts(), total = c.reduce(function(s,x){ return s + x[1]; }, 0);
    var days = total === 0 ? 0 : total <= 3 ? 5 : total <= 8 ? 7 : 10;
    document.getElementById('b-total').textContent = total + (total === 1 ? ' engineer' : ' engineers');
    document.getElementById('b-detail').textContent = total === 0 ? 'Add at least one role to get a shortlist'
      : 'Shortlist in about ' + days + ' working days' + (total >= 4 ? ' · includes a delivery lead' : '');
  }
  rolesEl.addEventListener('click', function(e){
    var b = e.target.closest('button[data-d]'); if (!b) return;
    var inp = document.getElementById(b.dataset.t);
    inp.value = Math.max(0, Math.min(20, (parseInt(inp.value,10) || 0) + parseInt(b.dataset.d,10)));
    updateTeam();
  });
  rolesEl.addEventListener('input', updateTeam);
  updateTeam();

  document.getElementById('builder').addEventListener('submit', function(e){
    e.preventDefault();
    var picked = counts().filter(function(x){ return x[1] > 0; });
    var msg = document.getElementById('c-msg');
    document.getElementById('c-need').value = 'Engineers for my team';
    msg.value = 'Team request:\n' + (picked.length ? picked.map(function(x){ return '- ' + x[1] + ' × ' + x[0]; }).join('\n') : '- (no roles picked yet)') +
      '\nSeniority: ' + document.getElementById('b-seniority').value +
      '\nHours: ' + document.getElementById('b-hours').value + '\n\n' + msg.value.replace(/^Team request:[\s\S]*?\n\n/, '');
    document.getElementById('contact').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
    setTimeout(function(){ document.getElementById('c-name').focus({preventScroll:true}); }, reduce ? 0 : 600);
  });

  /* industries */
  var IND = [
    ['Fintech','Payments, lending and wallets','Fintech moves fast and is heavily regulated. We build products that pass audits and handle failed transfers cleanly.',['Wallets, virtual accounts and payouts','Loan origination and repayment tracking','BVN/NIN KYC with tiered limits','Reconciliation against bank statements']],
    ['Agritech','Farmers, supply chains and markets','Tools for farmers, co-operatives and buyers who work far from reliable internet.',['Farmer registration that works offline','Input credit and repayment tracking','Produce marketplaces and logistics','USSD access for feature phones']],
    ['Health','Clinics, pharmacies and telemedicine','Patient-facing and clinical software that treats health data with the care the law requires.',['Appointment booking and telehealth','Electronic medical records','Pharmacy inventory and e-prescriptions','HMO claims processing']],
    ['Logistics','Delivery, fleets and warehousing','Software that tracks goods and drivers across cities with unreliable addresses.',['Rider and driver apps with live tracking','Proof of delivery and cash collection','Route planning and dispatch','Warehouse stock management']],
    ['Education','Schools, edtech and training','Learning platforms for students who share devices and pay for data by the megabyte.',['School management and fee payment','Low-data video and offline lessons','Exam practice (WAEC, JAMB)','Parent portals and SMS alerts']],
    ['Public sector','Government and NGOs','Citizen services and programme tools built for transparency and scale.',['Revenue collection portals','Beneficiary registration and payments','Field data collection','Open dashboards and reporting']]
  ];
  var tabs = document.getElementById('ind-tabs'), panel = document.getElementById('ind-panel');
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
  tabs.innerHTML = IND.map(function(d,i){ return '<button type="button" role="tab" id="tab-'+i+'" aria-controls="ind-panel" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'">'+d[0]+'</button>'; }).join('');
  function showInd(i){
    var d = IND[i];
    Array.prototype.forEach.call(tabs.children, function(b,j){ b.setAttribute('aria-selected', j===i); b.tabIndex = j===i ? 0 : -1; });
    panel.setAttribute('aria-labelledby','tab-'+i);
    panel.innerHTML = '<div><span class="label">'+d[1]+'</span><h3 style="margin-top:10px">'+d[0]+'</h3><p>'+d[2]+'</p></div>' +
      '<ul>' + d[3].map(function(x){ return '<li>'+check+'<span>'+x+'</span></li>'; }).join('') + '</ul>';
  }
  tabs.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) showInd(Array.prototype.indexOf.call(tabs.children, b)); });
  tabs.addEventListener('keydown', function(e){
    var cur = Array.prototype.findIndex.call(tabs.children, function(b){ return b.getAttribute('aria-selected') === 'true'; });
    var n = e.key === 'ArrowRight' ? (cur+1) % IND.length : e.key === 'ArrowLeft' ? (cur-1+IND.length) % IND.length : -1;
    if (n >= 0) { e.preventDefault(); showInd(n); tabs.children[n].focus(); }
  });
  showInd(0);

  /* contact form: builds the message, then offers email app + copy */
  Array.prototype.forEach.call(document.querySelectorAll('.email-slot'), function(s){ s.textContent = EMAIL; });
  var form = document.getElementById('contact-form'), err = document.getElementById('form-error');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var v = function(id){ return document.getElementById(id).value.trim(); };
    var name = v('c-name'), email = v('c-email');
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = !name ? 'Add your name so we know who to reply to.' : 'Enter a valid email address, like ada@company.com.';
      err.hidden = false; err.style.color = 'var(--amber)';
      document.getElementById(!name ? 'c-name' : 'c-email').focus();
      return;
    }
    err.hidden = true;
    var subject = (v('c-need') === 'Join the Academy' ? 'Academy application' : 'Project enquiry: ' + v('c-need')) + (v('c-company') ? ' (' + v('c-company') + ')' : '');
    var body = 'Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + (v('c-company') || '—') +
      '\nNeed: ' + v('c-need') + (v('c-need') === 'Join the Academy' ? '' : '\nBudget: ' + v('c-budget')) + '\n\n' + (v('c-msg') || '(no details yet)');
    document.getElementById('sent-body').textContent = 'To: ' + EMAIL + '\nSubject: ' + subject + '\n\n' + body;
    document.getElementById('mail-link').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    document.getElementById('sent').hidden = false;
  });
  document.getElementById('copy-btn').addEventListener('click', function(){
    var btn = this, text = document.getElementById('sent-body').textContent;
    function done(){ btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = 'Copy message'; }, 2000); }
    function fallback(){
      var r = document.createRange(); r.selectNodeContents(document.getElementById('sent-body'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = 'Selected: press Ctrl+C';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });

  /* Academy "Apply" links prefill the contact form */
  Array.prototype.forEach.call(document.querySelectorAll('[data-apply]'), function(a){
    a.addEventListener('click', function(){
      document.getElementById('c-need').value = 'Join the Academy';
      document.getElementById('c-budget').closest('.field').hidden = true;
      document.getElementById('c-msg').value = 'I would like to apply for the Tesler Academy: ' + a.dataset.apply + '.\n\nAbout me: ';
      setTimeout(function(){ document.getElementById('c-name').focus({preventScroll:true}); }, reduce ? 0 : 600);
    });
  });
  document.getElementById('c-need').addEventListener('change', function(){
    document.getElementById('c-budget').closest('.field').hidden = this.value === 'Join the Academy';
  });
})();
