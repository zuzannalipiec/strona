document.addEventListener('DOMContentLoaded', () => {
    
    // Płynne przewijanie (Smooth Scroll) tylko dla poprawnych linków hash
    const links = document.querySelectorAll('.nav-links a[href^="#"], .hero-buttons a[href^="#"], .logo-link[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Obsługa kliknięcia w przycisk zapisu
    const alertButtons = document.querySelectorAll('.alert-trigger');
    alertButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert(btn.getAttribute('data-message'));
        });
    });

    // Reveal on scroll with stagger
    const sections = Array.from(document.querySelectorAll('section'));

    // prepare section children as reveal items
    sections.forEach(sec => {
        const children = Array.from(sec.children);
        children.forEach(child => child.classList.add('reveal-item'));

        const timelineItems = sec.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => item.classList.add('reveal-item'));

        const heroAccent = sec.querySelectorAll('.hero-text h1 .accent-text');
        heroAccent.forEach(item => item.classList.add('reveal-item'));
    });

    const revealSection = (sec) => {
        const isHero = sec.classList.contains('hero');
        const baseDelay = isHero ? 160 : 120;
        const sectionDelayOffset = isHero ? 200 : 0;
        const items = Array.from(sec.querySelectorAll('.reveal-item'));
        items.forEach((it, i) => {
            let delay = sectionDelayOffset + i * baseDelay;
            if (it.classList.contains('accent-text')) {
                delay += 240;
            }
            it.style.animationDelay = `${delay}ms`;
            it.classList.add('reveal--visible');
        });
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealSection(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });

    sections.forEach(sec => revealObserver.observe(sec));

    // when navigation links are clicked, ensure target section reveal is triggered
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // trigger reveal after short delay to allow scroll to begin
                    setTimeout(() => {
                        revealSection(targetSection);
                    }, 500);
                }
            }
        });
    });

    // If page loaded with hash, reveal that section
    if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) {
            setTimeout(() => {
                revealSection(target);
            }, 450);
        }
    }
});