 (function () {
    // ─────────────────────────────────────────
    // HAMBURGER MENU FUNCTIONALITY
    // ─────────────────────────────────────────
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');

    // Function to close menu
    const closeMenu = () => {
      hamburgerBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (hamburgerBtn && mobileNav && mobileNavOverlay) {
      // Toggle menu on hamburger button click
      hamburgerBtn.addEventListener('click', function () {
        hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu on overlay click
      mobileNavOverlay.addEventListener('click', closeMenu);

      // Close menu when clicking outside the open menu on mobile/tablet
      document.addEventListener('click', function (event) {
        if (
          mobileNav.classList.contains('active') &&
          !mobileNav.contains(event.target) &&
          !hamburgerBtn.contains(event.target)
        ) {
          closeMenu();
        }
      });

      // Close menu on close button click
      if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMenu);
      }

      // Close menu on nav link click
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }

    // ─────────────────────────────────────────
    // CONTACT EMAIL FUNCTIONALITY
    // ─────────────────────────────────────────
    const encoded = "d2lscmlja2RlbnVpbEBnbWFpbC5jb20=";
    const email = atob(encoded);

    const el = document.getElementById("mail");

    if (el) el.href = "mailto:" + email;
    const sub = el?.querySelector('.contact-link-sub');
    if (sub) {
      sub.textContent = email;
    } else if (el) {
      el.textContent = email;
    }

    const submit = document.getElementById('contact-submit');
    const feedback = document.getElementById('contact-feedback');
    if (submit) {
      submit.addEventListener('click', function () {
        try {
          console.log('Contact: submit clicked');
          const subject = document.getElementById('contact-subject')?.value.trim() || '';
          const message = document.getElementById('contact-message')?.value.trim() || '';

          const mailSubject = subject || 'Bericht via portfolio';

          let body = '';
          if (message) body += message + '\n\n';
          body += '--\nVerzonden vanaf portfolio';

          const mailto = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;

          // show feedback so user knows handler ran
          if (feedback) {
            feedback.textContent = 'Je e-mailclient wordt geopend...';
            feedback.style.display = 'block';
          }

          // primary: navigate
          try {
            window.location.href = mailto;
          } catch (e) {
            console.warn('window.location.href failed', e);
          }

          // try window.open as another method (may be blocked by popup blockers)
          try {
            const win = window.open(mailto);
            if (win) {
              console.log('window.open succeeded');
            }
          } catch (e) {
            console.warn('window.open failed', e);
          }

          // fallback: create and click temporary anchor after a short delay
          setTimeout(() => {
            try {
              const a = document.createElement('a');
              a.href = mailto;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              a.remove();
              console.log('Fallback anchor click attempted');
            } catch (err) {
              console.error('Fallback anchor failed', err);
            }

            // Ensure user still has a visible way: show a clickable mailto link and copy to clipboard
            try {
              const fallbackLink = document.getElementById('contact-fallback-link');
              const fallbackWrapper = document.getElementById('contact-fallback');
              if (fallbackLink && fallbackWrapper) {
                fallbackLink.href = mailto;
                fallbackLink.textContent = 'Als je mailclient niet opent: klik hier of kopieer de mailto-link';
                fallbackWrapper.style.display = 'block';
              }

              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(mailto).then(() => {
                  if (feedback) feedback.textContent = 'Mailto-link gekopieerd naar klembord.';
                }).catch(() => {
                  if (feedback) feedback.textContent = 'Klik de link om te openen of kopieer de link handmatig.';
                });
              } else {
                if (feedback) feedback.textContent = 'Klik de link om te openen of kopieer de link handmatig.';
              }
            } catch (err) {
              console.error('Fallback UI failed', err);
              if (feedback) feedback.textContent = 'Kan e-mailclient niet openen — kopieer de link handmatig.';
            }
          }, 300);
        } catch (err) {
          console.error('Contact handler error', err);
          if (feedback) {
            feedback.textContent = 'Er is een fout opgetreden. Probeer het opnieuw.';
            feedback.style.display = 'block';
          }
        }
      });
    }
})();
