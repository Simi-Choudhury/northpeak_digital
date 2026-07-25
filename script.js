
  (function(){
    /* Sticky header shadow on scroll */
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive:true });

    /* Mobile nav toggle */
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Animated stat counters, triggered on scroll into view */
    const counters = [
      { id:'stat-blocked', target:1428, suffix:'' },
      { id:'stat-endpoints', target:52300, suffix:'' },
      { id:'stat-response', target:9, suffix:'', hasUnit:true },
      { id:'stat-uptime', target:99.98, suffix:'', decimals:2, hasUnit:true }
    ];

    function animateCounter(cfg){
      const el = document.getElementById(cfg.id);
      if(!el) return;
      const unitEl = el.querySelector('.unit');
      const duration = 1400;
      const start = performance.now();

      function frame(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = cfg.target * eased;
        const display = cfg.decimals ? current.toFixed(cfg.decimals) : Math.round(current).toLocaleString();
        el.childNodes[0].nodeValue = display;
        if(unitEl) el.appendChild(unitEl);
        if(progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    const intelSection = document.querySelector('.intel');
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !animated){
          animated = true;
          counters.forEach(animateCounter);
        }
      });
    }, { threshold:0.3 });
    if(intelSection) observer.observe(intelSection);

    /* Contact form validation */
    const form = document.getElementById('contact-form');
    const status = form.querySelector('.form-status');

    const validators = {
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      company: (v) => v.trim().length >= 2,
      size: (v) => v.trim().length > 0,
      message: (v) => v.trim().length >= 10
    };

    function validateField(fieldEl){
      const name = fieldEl.dataset.field;
      const input = fieldEl.querySelector('input, textarea, select');
      if(!input || !validators[name]) return true;
      const valid = validators[name](input.value);
      fieldEl.classList.toggle('invalid', !valid);
      return valid;
    }

    form.querySelectorAll('.field').forEach(fieldEl => {
      const input = fieldEl.querySelector('input, textarea, select');
      if(!input) return;
      input.addEventListener('blur', () => validateField(fieldEl));
      input.addEventListener('input', () => {
        if(fieldEl.classList.contains('invalid')) validateField(fieldEl);
      });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll('.field').forEach(fieldEl => {
        if(!validateField(fieldEl)) allValid = false;
      });

      if(!allValid){
        status.textContent = 'Please fix the highlighted fields.';
        status.classList.remove('success');
        const firstInvalid = form.querySelector('.field.invalid input, .field.invalid textarea, .field.invalid select');
        if(firstInvalid) firstInvalid.focus();
        return;
      }

      status.textContent = 'Thanks — your request has been logged. We\'ll reply within one business day.';
      status.classList.add('success');
      form.reset();
    });
  })();
