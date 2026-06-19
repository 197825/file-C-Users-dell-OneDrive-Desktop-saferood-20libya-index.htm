/* =============================================
   SafeRoad Libya - script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     NAVBAR - SCROLL & MOBILE MENU
     ========================================== */
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // تغيير الـ navbar عند التمرير
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  });

  // قائمة الهاتف
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // إغلاق القائمة عند النقر على رابط
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================
     تمييز الرابط النشط
     ========================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ==========================================
     ANIMATIONS ON SCROLL
     ========================================== */
  const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
  };

  observeElements();

  /* ==========================================
     عداد الأرقام
     ========================================== */
  const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target.toLocaleString('ar-LY');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString('ar-LY');
        }
      }, 16);
    });
  };

  // تشغيل العداد عند الظهور
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section, .dashboard-grid');
  if (statsSection) counterObserver.observe(statsSection);

  /* ==========================================
     MODAL - إضافة بلاغ
     ========================================== */
  const fab = document.querySelector('.fab');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const cancelBtn = document.querySelector('.modal-cancel');

  const openModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (fab) fab.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  /* ==========================================
     فلترة البلاغات
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const reportCards = document.querySelectorAll('.report-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.dataset.filter;
      reportCards.forEach(card => {
        if (type === 'all' || card.classList.contains(type)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================
     بحث الطرق
     ========================================== */
  const searchBtn = document.querySelector('.btn-search-road');
  const resultsContainer = document.querySelector('.search-results');

  // بيانات وهمية للطرق
  const roadsData = [
    {
      from: 'طرابلس', to: 'مصراتة',
      distance: '210 كم', time: '2.5 ساعة',
      status: 'safe', statusText: 'آمن',
      via: 'الطريق الساحلي'
    },
    {
      from: 'طرابلس', to: 'الزاوية',
      distance: '42 كم', time: '45 دقيقة',
      status: 'warning', statusText: 'ازدحام',
      via: 'الطريق الدائري'
    },
    {
      from: 'مصراتة', to: 'سرت',
      distance: '280 كم', time: '3 ساعات',
      status: 'safe', statusText: 'آمن',
      via: 'الطريق الساحلي'
    },
    {
      from: 'بنغازي', to: 'البيضاء',
      distance: '220 كم', time: '2.5 ساعة',
      status: 'danger', statusText: 'حادث',
      via: 'الطريق الجبلي'
    },
    {
      from: 'طرابلس', to: 'بنغازي',
      distance: '1050 كم', time: '11 ساعة',
      status: 'warning', statusText: 'ازدحام في بعض المقاطع',
      via: 'الطريق الساحلي الرئيسي'
    },
    {
      from: 'سبها', to: 'ترهونة',
      distance: '680 كم', time: '7 ساعات',
      status: 'closed', statusText: 'مغلق جزئياً',
      via: 'الطريق الصحراوي'
    }
  ];

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const fromVal = document.querySelector('#from-city')?.value?.trim() || '';
      const toVal   = document.querySelector('#to-city')?.value?.trim() || '';

      if (!fromVal || !toVal) {
        showToast('⚠️ يرجى تحديد مدينة الانطلاق والوجهة', 'warning');
        return;
      }

      // محاكاة تحميل
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<span class="spinner">⏳</span> جاري البحث...';

      setTimeout(() => {
        searchBtn.disabled = false;
        searchBtn.innerHTML = '🔍 بحث عن المسار';

        // فلترة أو إرجاع نتائج
        let results = roadsData.filter(r =>
          r.from.includes(fromVal) || r.to.includes(toVal) ||
          r.from.includes(toVal) || r.to.includes(fromVal)
        );

        if (results.length === 0) {
          results = roadsData.slice(0, 3);
        }

        renderSearchResults(results);
      }, 1200);
    });
  }

  const renderSearchResults = (results) => {
    if (!resultsContainer) return;

    const statusMap = {
      safe:    { class: 'badge-safe',    icon: '✅', color: '#00e676' },
      warning: { class: 'badge-warning', icon: '⚠️', color: '#ffd740' },
      danger:  { class: 'badge-danger',  icon: '🚨', color: '#ff4b4b' },
      closed:  { class: 'badge-closed',  icon: '🚫', color: '#9e9e9e' }
    };

    resultsContainer.innerHTML = `
      <h4 style="margin-bottom:1rem;font-size:0.95rem;color:var(--text-secondary)">
        📍 تم العثور على ${results.length} مسار
      </h4>
      ${results.map((r, i) => {
        const s = statusMap[r.status] || statusMap.safe;
        return `
          <div class="route-result-card animate-in" style="animation-delay:${i*0.1}s">
            <div class="route-result-header">
              <div class="route-cities">
                <span>${r.from}</span>
                <span class="arrow">←</span>
                <span>${r.to}</span>
              </div>
              <span class="badge ${s.class}">
                <span class="status-dot ${r.status}"></span>
                ${r.statusText}
              </span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">عبر: ${r.via}</div>
            <div class="route-meta">
              <div class="route-meta-item">
                <span class="rm-label">📏 المسافة</span>
                <span class="rm-value">${r.distance}</span>
              </div>
              <div class="route-meta-item">
                <span class="rm-label">⏱ الوقت المتوقع</span>
                <span class="rm-value">${r.time}</span>
              </div>
              <div style="margin-right:auto">
                <button class="btn-outline-green" onclick="showToast('🗺️ جاري عرض تفاصيل الطريق...', 'info')">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;

    // تفعيل animations
    setTimeout(() => {
      resultsContainer.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
    }, 50);
  };

  /* ==========================================
     نظام التوست (الإشعارات)
     ========================================== */
  window.showToast = (msg, type = 'info') => {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const colors = {
      info:    'var(--green-main)',
      warning: 'var(--accent-yellow)',
      error:   'var(--accent-red)',
      success: 'var(--green-main)'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:2rem; right:50%; transform:translateX(50%);
      background:var(--bg-card); border:1px solid ${colors[type]};
      border-radius:10px; padding:12px 20px; z-index:9999;
      font-size:0.9rem; color:var(--text-primary);
      box-shadow:0 8px 30px rgba(0,0,0,0.4);
      animation:fadeInUp 0.3s ease; white-space:nowrap;
      font-family:'Cairo',sans-serif;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  /* ==========================================
     نموذج التواصل
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = '⏳ جاري الإرسال...';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'إرسال الرسالة ✓';
        btn.style.background = 'linear-gradient(135deg,#00e676,#00b248)';
        showToast('✅ تم إرسال رسالتك بنجاح، سنرد عليك قريباً', 'success');
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = 'إرسال الرسالة';
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  /* ==========================================
     نموذج إضافة بلاغ
     ========================================== */
  const reportForm = document.querySelector('.report-form');
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('✅ تم إرسال بلاغك بنجاح، شكراً لمساهمتك!', 'success');
    });
  }

  /* ==========================================
     نموذج تسجيل الدخول
     ========================================== */
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = '⏳ جاري التحقق...';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'تسجيل الدخول';
        showToast('✅ تم تسجيل الدخول بنجاح!', 'success');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }, 1500);
    });

    // إظهار/إخفاء كلمة المرور
    const togglePwd = document.querySelector('.input-toggle');
    const pwdInput  = document.querySelector('#password');

    if (togglePwd && pwdInput) {
      togglePwd.addEventListener('click', () => {
        const isText = pwdInput.type === 'text';
        pwdInput.type = isText ? 'password' : 'text';
        togglePwd.textContent = isText ? '👁' : '🙈';
      });
    }
  }

  /* ==========================================
     أشرطة التقدم - Dashboard
     ========================================== */
  const progressBars = document.querySelectorAll('.progress-fill');
  if (progressBars.length) {
    setTimeout(() => {
      progressBars.forEach(bar => {
        const width = bar.dataset.width || '70';
        bar.style.width = width + '%';
      });
    }, 300);
  }

  /* ==========================================
     تأثيرات الخريطة التجريبية - roads.html
     ========================================== */
  const mapDots = document.querySelectorAll('.map-city-dot');
  mapDots.forEach(dot => {
    dot.addEventListener('mouseenter', () => {
      const tooltip = dot.querySelector('.map-tooltip');
      if (tooltip) tooltip.style.display = 'block';
    });
    dot.addEventListener('mouseleave', () => {
      const tooltip = dot.querySelector('.map-tooltip');
      if (tooltip) tooltip.style.display = 'none';
    });
  });

  /* ==========================================
     الساعة الحية - للـ dashboard
     ========================================== */
  const liveClock = document.querySelector('.live-clock');
  if (liveClock) {
    const updateClock = () => {
      const now = new Date();
      liveClock.textContent = now.toLocaleTimeString('ar-LY');
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ==========================================
     تهيئة الصفحة - Smooth entrance
     ========================================== */
  // إظهار الصفحة بشكل سلس بعد تحميل كامل
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

});
