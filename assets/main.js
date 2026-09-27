(function(){
  'use strict';
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IMG = function(id, w){ return 'https://images.unsplash.com/' + id + '?q=70&w=' + (w || 900) + '&auto=format&fit=crop'; };
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

  $('#year').textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  var burger = $('#burger'), nav = $('#navlinks');
  function closeMenu(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function(e){ if (e.target.closest('a')) closeMenu(); });

  /* ---------- links that preselect the enquiry type ---------- */
  document.addEventListener('click', function(e){
    var a = e.target.closest('[data-topic]');
    if (a) $('#f-topic').value = a.getAttribute('data-topic');
  });

  /* ---------- hero carousel ---------- */
  var slides = $$('.hero-slides .slide'), dots = $('#heroDots'), cur = 0, timer = null, paused = reduce;
  slides.forEach(function(s, i){
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + slides.length);
    b.addEventListener('click', function(){ go(i); restart(); });
    dots.appendChild(b);
  });
  function go(i){
    cur = (i + slides.length) % slides.length;
    slides.forEach(function(s, j){ s.classList.toggle('on', j === cur); });
    $$('button', dots).forEach(function(b, j){ b.setAttribute('aria-current', String(j === cur)); });
  }
  function restart(){
    clearInterval(timer);
    if (!paused) timer = setInterval(function(){ go(cur + 1); }, 6500);
  }
  $('#heroPrev').addEventListener('click', function(){ go(cur - 1); restart(); });
  $('#heroNext').addEventListener('click', function(){ go(cur + 1); restart(); });
  var pauseBtn = $('#heroPause');
  function syncPause(){
    pauseBtn.textContent = paused ? '▶' : '❚❚';
    pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  }
  pauseBtn.addEventListener('click', function(){ paused = !paused; syncPause(); restart(); });
  go(0); syncPause(); restart();

  /* ---------- waste-to-wealth loop ---------- */
  var LOOP = [
    ['Farm waste in', 'Registered farmers supply crop residues and farm waste that would otherwise be burned or dumped.'],
    ['Clean energy out', 'We press the waste into bio-briquettes: a cleaner, cheaper cooking fuel than charcoal or firewood.'],
    ['Credit earned', 'Every delivery is logged. Volume builds each farmer\'s credit level in their AgriRenew account.'],
    ['Farms grow', 'Credit unlocks inputs, equipment, land support and forward purchase, so farms produce more, and more waste returns to the loop.']
  ];
  var nodes = $$('.loop-node'), readout = $('#loopReadout');
  function showLoop(i){
    nodes.forEach(function(n, j){ n.classList.toggle('active', j === i); });
    readout.innerHTML = '<b>' + LOOP[i][0] + '</b><p>' + LOOP[i][1] + '</p>';
  }
  nodes.forEach(function(n, i){
    n.addEventListener('click', function(){ showLoop(i); });
    n.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); showLoop(i); } });
  });

  /* ---------- tab helper (who we serve, ecosystem) ---------- */
  function tabs(list, render){
    var btns = $$('[role="tab"]', list);
    function select(i, focus){
      btns.forEach(function(b, j){ b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
      render(i);
      if (focus) btns[i].focus();
    }
    btns.forEach(function(b, i){ b.addEventListener('click', function(){ select(i); }); });
    list.addEventListener('keydown', function(e){
      var i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight'){ e.preventDefault(); select((i + 1) % btns.length, true); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); select((i - 1 + btns.length) % btns.length, true); }
    });
    select(0);
  }

  var SERVE = [
    { h: 'Deliver agriculture programmes that reach real farmers',
      p: 'Ministries, state governments and agencies use AgriRenew to turn policy into results in the field, with records you can audit.',
      li: ['Farmer registration, profiling and verification', 'Extension services and training at scale', 'Input distribution tracked through farmer credit accounts', 'Waste-to-energy and clean cooking programmes', 'Youth and women in agriculture schemes'],
      cta: 'Request our capability statement', topic: 'Government / institution' },
    { h: 'An implementing partner that reports what donors need',
      p: 'We co-design, deliver and measure grant-funded projects, from baseline survey to final impact report.',
      li: ['Implementing partner for food security and climate projects', 'Baseline surveys and monitoring with drone and field data', 'Indicators aligned to SDGs 1, 2, 7, 13 and 15', 'Transparent budgets and regular progress reports', 'Community entry through our farmer network'],
      cta: 'Discuss a grant partnership', topic: 'Development partner / donor' },
    { h: 'Verified supply, bankable projects, measurable returns',
      p: 'Processors, offtakers and investors work with us to secure supply and build agribusinesses that last.',
      li: ['Verified farmer supply and outgrower schemes', 'Feasibility studies and investor-ready business plans', 'Waste-to-energy expansion and processing hubs', 'Market linkage and export readiness', 'Farm establishment and management support'],
      cta: 'Book a consultation', topic: 'Investor / agribusiness' },
    { h: 'Grow more, earn more, waste nothing',
      p: 'Farmers and cooperatives join free and get support that grows with every season.',
      li: ['Free registration and your own AgriRenew account', 'Credit for inputs, equipment and land support', 'Cheaper briquettes for your household', 'Forward purchase of your produce at agreed prices', 'Practical training through the AgriRenew Academy'],
      cta: 'Register as a farmer', topic: 'Farmer / cooperative' }
  ];
  tabs($('.serve-tabs'), function(i){
    var d = SERVE[i];
    $('#servePanel').innerHTML = '<div><h3>' + d.h + '</h3><p>' + d.p + '</p>' +
      '<a class="btn" href="#contact" data-topic="' + esc(d.topic) + '">' + d.cta + '</a></div>' +
      '<ul>' + d.li.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>';
  });

  var ECO = [
    { t: 'Waste-to-Energy', h: 'Waste-to-Energy Division', img: 'flagged/photo-1605816140734-df2c839f0b75', alt: 'Baled agricultural residue ready for conversion into bio-briquettes',
      p: 'We convert agricultural waste into clean, affordable bio-briquettes for cooking, and we are building toward waste-to-electricity conversion.',
      li: ['Bio-briquettes: cleaner and cheaper than charcoal and firewood', 'Waste-to-electricity programmes in development', 'Partner farmers supply waste and buy briquettes below market price', 'DBN-backed production capacity with room to scale'],
      cta: 'Order briquettes', topic: 'Briquette order' },
    { t: 'Academy', h: 'AgriRenew Academy', img: 'photo-1741874299706-2b8e16839aaa', alt: 'A farmer tending crops in a green field',
      p: 'Practical, business-first training that takes people from curiosity to their own running agribusiness, from soil science to sales.',
      li: ['Crop production, soil texture and land preparation', 'Livestock, poultry and fish farming, from starter to commercial scale', 'AI, drones and precision technology in agriculture', 'Agribusiness start-up mentoring and export readiness'],
      cta: 'Enrol in the Academy', topic: 'Academy enrolment' },
    { t: 'Farmer Credit & Inputs', h: 'Farmer Credit & Inputs Programme', img: 'photo-1740741706386-0a211c4a87df', alt: 'A woman farmer in her field',
      p: 'Every registered farmer gets an AgriRenew account. Supplying farm waste builds credit, and credit unlocks real support.',
      li: ['Briquettes at below-market prices', 'Input loans for fertiliser, seed and equipment', 'Support with land acquisition for growing farmers', 'Forward purchase at agreed prices, protecting farmers from price swings'],
      cta: 'Register as a farmer', topic: 'Farmer / cooperative' },
    { t: 'Marketplace', h: 'AgriRenew Marketplace', img: 'photo-1627989147125-a004d05946d3', alt: 'Fresh vegetables in a woven basket',
      p: 'A direct bridge between verified farmers and real buyers. Farmers register, get verified and receive a licence to list.',
      li: ['Verified farmer profiles with recorded production details', 'Fresh, perishable and processed goods listed by producers', 'Every seller vetted and licensed', 'An export pathway for licensed producers'],
      cta: 'Register as a farmer or buyer', topic: 'Buyer (marketplace)' },
    { t: 'Climate & Advisory', h: 'Climate & Advisory', img: 'photo-1509110646989-7ca4308edb3e', alt: 'Aerial view of green farmland',
      p: 'We monitor climate patterns and design practical climate solutions for agriculture, for governments, businesses and partners in Nigeria and beyond.',
      li: ['Climate-smart agriculture design for public and private projects', 'Advisory across the full agricultural value chain', 'Drone and AI-assisted monitoring', 'Built for Africa, not just Nigeria'],
      cta: 'Book a consultation', topic: 'Government / institution' },
    { t: 'Events & Community', h: 'Events & Community', img: 'photo-1473605768212-7e1f2c756179', alt: 'Rural community life',
      p: 'AgriRenew gives back to communities through education, events and grassroots empowerment.',
      li: ['Seminars, workshops and agricultural innovation events', 'Community empowerment and youth development', 'Training in AI, media and technology for agriculture', 'Support for local producers to grow, sell and export'],
      cta: 'Invite us to your event', topic: 'Media / events' }
  ];
  var ecoTabs = $('#ecoTabs');
  ecoTabs.innerHTML = ECO.map(function(d, i){ return '<button type="button" role="tab" aria-selected="' + (i === 0) + '"' + (i ? ' tabindex="-1"' : '') + '>' + esc(d.t) + '</button>'; }).join('');
  tabs(ecoTabs, function(i){
    var d = ECO[i];
    $('#ecoPanel').innerHTML = '<div><h3>' + esc(d.h) + '</h3><p>' + d.p + '</p><ul>' +
      d.li.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<a class="btn" href="#contact" data-topic="' + esc(d.topic) + '">' + d.cta + '</a></div>' +
      '<figure><img src="' + IMG(d.img, 1000) + '" alt="' + esc(d.alt) + '" loading="lazy"></figure>';
  });

  /* ---------- process stepper ---------- */
  var PROC = [
    { t: 'Register & profile', img: 'photo-1740741706386-0a211c4a87df', who: 'Farmer + AgriRenew field officer',
      p: 'The farmer joins free. A field officer visits, maps the farm and opens the farmer\'s AgriRenew account.',
      rec: 'Farm location and size, crops grown, household and contact details' },
    { t: 'Soil test & farm plan', img: 'photo-1464226184884-fa280b87c399', who: 'Field officer + agronomist',
      p: 'We test the soil and agree a season plan: which crops, which inputs, and when to plant.',
      rec: 'Soil texture and fertility results, recommended crops and input schedule' },
    { t: 'Certified seed & planting', img: 'photo-1574943320219-553eb213f72d', who: 'Farmer, with input credit',
      p: 'Farmers plant certified, non-GMO seed at the right spacing and time. Inputs can be taken on credit.',
      rec: 'Seed variety and source, planting date, inputs issued on credit' },
    { t: 'Crop care & monitoring', img: 'photo-1509110646989-7ca4308edb3e', who: 'Farmer + field officer + drone team',
      p: 'Regular field visits and drone images catch pests, disease and water stress early.',
      rec: 'Scouting notes, crop health images, treatments applied' },
    { t: 'Harvest & post-harvest', img: 'photo-1515276427842-f85802d514a2', who: 'Farmer + AgriRenew buyers',
      p: 'We advise on harvest timing and handling. Produce can be sold to AgriRenew at the agreed forward price or listed on the marketplace.',
      rec: 'Yield per hectare, quality grade, volumes sold and prices' },
    { t: 'Residue collection', img: 'photo-1741940365425-1b9a575d373e', who: 'Farmer + collection team',
      p: 'Instead of burning stalks, husks and cobs, farmers bundle them for collection. Every load is weighed.',
      rec: 'Residue type and weight, logged to the farmer\'s credit account' },
    { t: 'Drying & preparation', img: 'flagged/photo-1605816140734-df2c839f0b75', who: 'Production team',
      p: 'Residue is dried, sorted and crushed to an even size, then mixed with a natural binder.',
      rec: 'Moisture level, batch number, feedstock mix' },
    { t: 'Briquette pressing & quality', img: 'photo-1618265317491-8b7b2324320e', who: 'Production team, on DBN-funded equipment',
      p: 'The mix is pressed into briquettes, dried again and checked for density, moisture and clean burning.',
      rec: 'Batch output, quality test results, packaging date' },
    { t: 'Distribution & credit', img: 'photo-1473605768212-7e1f2c756179', who: 'AgriRenew + partner farmers + households',
      p: 'Briquettes reach households below charcoal prices. Partner farmers use their credit for inputs, equipment and land support, and the next season starts stronger.',
      rec: 'Households supplied, credit balances, inputs issued for next season' }
  ];
  var procSteps = $('#procSteps'), procView = $('#procView'), procCur = 0;
  procSteps.innerHTML = PROC.map(function(d, i){
    return '<li><button type="button" role="tab" id="ps-' + i + '" aria-controls="procView" aria-selected="' + (i === 0) + '"' + (i ? ' tabindex="-1"' : '') + '>' + esc(d.t) + '</button></li>';
  }).join('');
  var procBtns = $$('button', procSteps);
  function showProc(i, focus){
    procCur = i;
    procBtns.forEach(function(b, j){
      b.setAttribute('aria-selected', String(j === i));
      b.tabIndex = j === i ? 0 : -1;
      b.classList.toggle('past', j < i);
    });
    var d = PROC[i];
    procView.setAttribute('aria-labelledby', 'ps-' + i);
    procView.innerHTML = '<figure><img src="' + IMG(d.img, 1000) + '" alt="" loading="lazy"><figcaption>Step ' + (i + 1) + ' of ' + PROC.length + '</figcaption></figure>' +
      '<div class="proc-body"><h3>' + esc(d.t) + '</h3><p>' + esc(d.p) + '</p>' +
      '<dl><div><dt>Who</dt><dd>' + esc(d.who) + '</dd></div><div><dt>What we record</dt><dd>' + esc(d.rec) + '</dd></div></dl>' +
      '<div class="proc-nav">' + (i > 0 ? '<button type="button" class="btn ghost sm" data-proc="-1">← Previous</button>' : '') +
      (i < PROC.length - 1 ? '<button type="button" class="btn sm" data-proc="1">Next step →</button>' : '<a class="btn sm" href="#credit">See the credit programme</a>') + '</div></div>';
    if (focus) procBtns[i].focus();
  }
  procSteps.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) showProc(procBtns.indexOf(b)); });
  procSteps.addEventListener('keydown', function(e){
    var i = procBtns.indexOf(document.activeElement); if (i < 0) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); showProc(Math.min(i + 1, PROC.length - 1), true); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); showProc(Math.max(i - 1, 0), true); }
  });
  procView.addEventListener('click', function(e){
    var b = e.target.closest('[data-proc]'); if (!b) return;
    showProc(procCur + Number(b.getAttribute('data-proc')), true);
  });
  showProc(0);

  /* ---------- scroll carousels (crops, videos) ---------- */
  $$('.car-btn').forEach(function(b){
    b.addEventListener('click', function(){
      var car = $('#car-' + b.getAttribute('data-car'));
      var step = car.firstElementChild ? car.firstElementChild.getBoundingClientRect().width + 16 : 300;
      car.scrollBy({ left: step * Number(b.getAttribute('data-dir')), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- videos: load YouTube only when played ---------- */
  $$('.vid').forEach(function(v){
    var id = (v.getAttribute('data-video') || '').trim();
    var poster = $('.vid-poster', v);
    if (!id){
      var s = document.createElement('span');
      s.className = 'soon';
      s.textContent = 'Coming soon';
      poster.appendChild(s);
    }
    $('.play', v).addEventListener('click', function(){
      if (!id){ s.textContent = 'Video coming soon'; return; }
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = v.getAttribute('data-title');
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      poster.innerHTML = '';
      poster.appendChild(f);
    });
  });

  /* ---------- insights: filterable guides with a reader ---------- */
  var POSTS = [
    { cat: 'Crops', mins: 4, img: 'photo-1464226184884-fa280b87c399', title: 'Test your soil texture with a glass jar',
      sum: 'A free test that tells you whether your soil is sandy, loamy or clay, and what that means for planting.',
      body: '<p>Soil texture decides how fast water drains, how often you irrigate and which crops do best. You can measure it with a clear jar, water and a pinch of detergent.</p><h4>Steps</h4><ol><li>Dig about 15 cm down and collect a cup of soil. Remove stones and roots.</li><li>Fill a straight-sided jar one-third with soil, then top up with water to three-quarters. Add a pinch of detergent.</li><li>Close the lid and shake hard for three minutes.</li><li>Set it down and mark the sand layer after one minute and the silt layer after about two hours.</li><li>Leave it for a day or two until the water clears, then mark the clay layer on top.</li></ol><h4>Reading the result</h4><p>Measure each layer and divide by the total height. Mostly sand drains fast and needs more organic matter and frequent watering. Mostly clay holds water and needs careful drainage. A balanced mix of sand, silt and clay is loam, which suits most crops.</p>' },
    { cat: 'Climate & energy', mins: 3, img: 'photo-1618265317491-8b7b2324320e', title: 'Why burning crop residue costs you money',
      sum: 'Open burning looks like a quick clean-up. It quietly takes nutrients and soil life from your next harvest.',
      body: '<p>Burning straw, stalks and husks after harvest is common because it is fast. But the fire destroys organic matter, kills the soil organisms that feed your crops, and sends much of the nitrogen and sulphur in the residue into the air as smoke.</p><h4>Better uses for residue</h4><ul><li><b>Mulch:</b> leave chopped residue on the surface to keep moisture in and weeds down.</li><li><b>Compost:</b> mix with manure to return nutrients to the field.</li><li><b>Clean fuel:</b> supply it to AgriRenew. It becomes bio-briquettes, and every delivery builds your farmer credit.</li></ul><p>Keeping residue out of the fire protects your soil, your community\'s air and your wallet.</p>' },
    { cat: 'Climate & energy', mins: 3, img: 'flagged/photo-1605816140734-df2c839f0b75', title: 'Bio-briquettes vs charcoal: a household guide',
      sum: 'What briquettes are, how to store and light them, and why they help keep forests standing.',
      body: '<p>Bio-briquettes are blocks of compressed agricultural waste such as husks, stalks and sawdust. No trees are cut to make them.</p><h4>Using them well</h4><ul><li>Store briquettes somewhere dry and off the floor. Damp briquettes are hard to light and smoky.</li><li>Light them the way you light charcoal, with a little kindling underneath.</li><li>Control the heat with your stove\'s air vent rather than adding more fuel.</li></ul><h4>Why it matters</h4><p>Charcoal production is a major driver of forest loss. Every household that cooks with briquettes reduces that pressure, and turns farm waste into income for farmers.</p>' },
    { cat: 'Crops', mins: 3, img: 'photo-1629398781739-9caec1eb9409', title: 'Keep tomatoes fresh longer after harvest',
      sum: 'Simple handling habits that cut post-harvest losses between the farm and the market.',
      body: '<p>A large share of tomatoes is lost between harvest and sale, mostly from heat and crushing. Small changes make a big difference.</p><ol><li><b>Harvest in the cool of the morning</b> and move the fruit into shade immediately.</li><li><b>Pick at the right stage.</b> For long journeys, harvest when the fruit first shows colour, not fully red.</li><li><b>Sort at the farm.</b> Remove cracked or diseased fruit so rot does not spread.</li><li><b>Use ventilated plastic crates, not sacks or deep baskets.</b> Fruit at the bottom of a deep basket gets crushed.</li><li><b>Keep them dry.</b> If you wash tomatoes, let them dry fully before packing.</li></ol>' },
    { cat: 'Business & grants', mins: 5, img: 'photo-1602516818688-715dfc1b77d5', title: 'Grant-readiness checklist for agribusinesses',
      sum: 'What funders and public institutions look for before they trust you with money.',
      body: '<p>Most agribusiness grant applications fail on basics, not ideas. Prepare these before a call for proposals opens.</p><h4>Paperwork</h4><ul><li>Company registration (CAC in Nigeria) and tax identification</li><li>A bank account in the business name</li><li>At least 12 months of simple financial records</li></ul><h4>Your case</h4><ul><li>A clear problem, who it affects and where</li><li>Baseline numbers: farmers, hectares, yields or incomes today</li><li>Measurable targets and how you will track them</li><li>A realistic budget linked to activities</li><li>Photos, reports and partner letters as evidence</li><li>How the work continues after the grant ends</li></ul><p>AgriRenew helps partners prepare programme designs, baselines and monitoring plans that meet funder requirements.</p>' },
    { cat: 'Livestock', mins: 4, img: 'photo-1622676566956-b42b50c84c31', title: 'Biosecurity basics for small poultry farms',
      sum: 'Low-cost habits that keep disease out of your flock.',
      body: '<p>Most poultry disease arrives on people, equipment and new birds. Biosecurity is the set of habits that keeps it out.</p><ul><li><b>Limit visitors</b> and keep a footbath with disinfectant at the pen entrance.</li><li><b>Quarantine new birds</b> for at least two weeks before they join the flock.</li><li><b>All in, all out:</b> raise one batch at a time, then clean and rest the house before the next.</li><li><b>Clean water and feed,</b> stored away from rodents and wild birds.</li><li><b>Vaccinate on schedule</b> with advice from a veterinarian, and keep records.</li><li><b>Report sudden deaths</b> to a vet quickly.</li></ul>' },
    { cat: 'Crops', mins: 4, img: 'photo-1574943320219-553eb213f72d', title: 'Choosing seed: certified, open-pollinated or hybrid',
      sum: 'The right seed decision is the cheapest yield gain on your farm.',
      body: '<p>Good seed is the foundation of a good harvest. Know what you are buying.</p><ul><li><b>Certified seed</b> comes from registered seed companies and is tested for purity and germination. In Nigeria, look for seed certified under the National Agricultural Seeds Council (NASC).</li><li><b>Open-pollinated varieties (OPVs)</b> can be saved and replanted for a few seasons if kept pure.</li><li><b>Hybrids</b> give higher yields but must be bought fresh every season.</li></ul><h4>Quick germination test</h4><p>Place 10 seeds on damp paper in a covered dish. After 5 to 7 days, count how many sprouted. Eight or more is good seed.</p><p>AgriRenew works with certified, non-GMO seed.</p>' }
  ];
  var CATS = ['All'].concat(POSTS.map(function(p){ return p.cat; }).filter(function(c, i, a){ return a.indexOf(c) === i; }));
  var filters = $('#insightFilters'), grid = $('#postGrid'), active = 'All';
  filters.innerHTML = CATS.map(function(c){ return '<button type="button" aria-pressed="' + (c === 'All') + '">' + esc(c) + '</button>'; }).join('');
  function renderPosts(){
    grid.innerHTML = POSTS.map(function(p, i){
      if (active !== 'All' && p.cat !== active) return '';
      return '<button type="button" class="post" data-post="' + i + '">' +
        '<div class="post-img"><img src="' + IMG(p.img, 700) + '" alt="" loading="lazy"></div>' +
        '<div class="post-body"><span class="post-meta">' + esc(p.cat) + ' · ' + p.mins + ' min read</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.sum) + '</p><span class="more">Read guide →</span></div></button>';
    }).join('');
  }
  filters.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    active = b.textContent;
    $$('button', filters).forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
    renderPosts();
  });
  renderPosts();

  var reader = $('#reader'), lastOpener = null;
  grid.addEventListener('click', function(e){
    var b = e.target.closest('.post'); if (!b) return;
    var p = POSTS[Number(b.getAttribute('data-post'))];
    lastOpener = b;
    $('#readerMeta').textContent = p.cat + ' · ' + p.mins + ' min read';
    $('#readerTitle').textContent = p.title;
    $('#readerBody').innerHTML = p.body;
    if (typeof reader.showModal === 'function') reader.showModal(); else reader.setAttribute('open', '');
  });
  function closeReader(){ if (reader.open) reader.close ? reader.close() : reader.removeAttribute('open'); }
  $('#readerClose').addEventListener('click', closeReader);
  reader.addEventListener('click', function(e){ if (e.target === reader) closeReader(); });
  reader.addEventListener('close', function(){ if (lastOpener) lastOpener.focus(); });
  $('#readerCta').addEventListener('click', function(){ closeReader(); });

  /* ---------- enquiry form: prepares an email ---------- */
  var EMAIL = $('#orgEmail').textContent.trim();
  $$('.email-slot').forEach(function(s){ s.textContent = EMAIL; });
  $('#contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var v = function(id){ return $('#' + id).value.trim(); };
    var err = $('#formError');
    if (!v('f-name')){ err.textContent = 'Add your name so we know who to reply to.'; err.hidden = false; $('#f-name').focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('f-email'))){ err.textContent = 'Enter a valid email address, like ada@example.com.'; err.hidden = false; $('#f-email').focus(); return; }
    err.hidden = true;
    var subject = 'Website enquiry: ' + v('f-topic') + (v('f-org') ? ' (' + v('f-org') + ')' : '');
    var body = 'Name: ' + v('f-name') + '\nEmail: ' + v('f-email') + '\nPhone: ' + (v('f-phone') || '—') +
      '\nOrganisation: ' + (v('f-org') || '—') + '\nEnquiry type: ' + v('f-topic') + '\n\n' + (v('f-msg') || '(no details yet)');
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
      navigator.clipboard.writeText(pre.textContent).then(function(){
        btn.textContent = 'Copied';
        setTimeout(function(){ btn.textContent = 'Copy message'; }, 2000);
      }, fallback);
    } else fallback();
  });
})();
