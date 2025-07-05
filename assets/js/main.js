// Tailwind CSS Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                secondary: '#10B981',
            }
        }
    }
}

// Internationalization (i18n) System
let i18nData = {};
let currentLanguage = 'vn';

// Theme System
let currentTheme = 'light';
const isUseMock = false;
const getDataDir = () => {
    return `assets/data/${isUseMock ? "mockup" : "personal"}/`;
}


// Function to load language data from JSON file
async function loadLanguageData(lang) {
    try {
        const response = await fetch(`${getDataDir()}${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${lang}.json`);
        }
        const data = await response.json();
        i18nData[lang] = data;
        return data;
    } catch (error) {
        console.error('Error loading language data:', error);
        return null;
    }
}

// Function to update text content based on data-i18n attributes
function updateTextContent() {
    // Update text content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = window.common.getNestedValue(i18nData[currentLanguage], key);
        if (text) {
            element.textContent = text;
        }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = window.common.getNestedValue(i18nData[currentLanguage], key);
        if (text) {
            element.placeholder = text;
        }
    });

    // Update page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const key = titleElement.getAttribute('data-i18n');
        const text = window.common.getNestedValue(i18nData[currentLanguage], key);
        if (text) {
            document.title = text;
        }
    }
}

function renderAboutInfo() {
    const info = window.common.getAboutInfo();
    const box = document.getElementById('aboutInfoBox');
    if (!box) return;
    box.innerHTML = `
        <div class='flex items-center gap-2 mb-2'><svg class='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z'/></svg><span>
            ${info.name_label}:</span> <span class='text-white'>${info.name}</span></div>
        <div class='flex items-center gap-2 mb-2'><svg class='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8c-3.866 0-7 1.343-7 3v5a2 2 0 002 2h10a2 2 0 002-2v-5c0-1.657-3.134-3-7-3z'/></svg><span>
            ${info.birth_label}:</span> <span class='text-white'>${info.birth}</span></div>
        <div class='flex items-center gap-2 mb-2'><svg class='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243A8 8 0 1112 20a8 8 0 01-5.657-3.343z'/></svg><span>
            ${info.address_label}:</span> <span class='text-white'>${info.address}</span></div>
        <div class='flex items-center gap-2'><svg class='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 14v7m0 0H5m7 0h7M12 14a4 4 0 100-8 4 4 0 000 8z'/></svg><span>
            ${info.gender_label}:</span> <span class='text-white'>${info.gender}</span></div>
        ${info.email ? `<div class='flex items-center gap-2 mb-2'><svg class='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1'/></svg><span>${info.email_label}:</span> <span class='text-white'>${info.email}</span></div>` : ''}
        ${info.phone ? `<div class='flex items-center gap-2'><svg class='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'/></svg><span>${info.phone_label}:</span> <span class='text-white'>${info.phone}</span></div>` : ''}
    `;
}

// Function to change language
async function changeLanguage(lang) {
    if (!i18nData[lang]) {
        const data = await loadLanguageData(lang);
        if (!data) {
            console.error(`Language ${lang} not available`);
            return;
        }
    }
    
    // Store language preference in localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    updateTextContent();
    updateLanguageDropdown(lang);
    renderAboutInfo();
    window.dispatchEvent(new Event('languageChanged'));
}

// Function to update language dropdown UI
function updateLanguageDropdown(lang) {
    const currentFlag = document.getElementById('currentFlag');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Update current flag
    const flagMap = {
        'vn': 'https://flagcdn.com/w80/vn.png',
        'en': 'https://flagcdn.com/w80/gb.png',
        'jp': 'https://flagcdn.com/w80/jp.png'
    };
    
    if (currentFlag && flagMap[lang]) {
        currentFlag.src = flagMap[lang];
    }
    
    // Update active state
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}

// Function to toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Function to close language dropdown
function closeLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// Function to select language from dropdown
function selectLanguage(lang) {
    changeLanguage(lang);
    closeLanguageDropdown();
}

// Function to get user's preferred language
function getPreferredLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem('preferredLanguage');
    if (stored) {
        return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('vi')) {
        return 'vn';
    } else if (browserLang.startsWith('en')) {
        return 'en';
    } else if (browserLang.startsWith('ja')) {
        return 'jp';
    }
    
    // Default to Vietnamese
    return 'vn';
}

// Theme System Functions
function getPreferredTheme() {
    // Check localStorage first
    const stored = localStorage.getItem('preferredTheme');
    if (stored) {
        return stored;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    // Default to light theme
    return 'light';
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preferredTheme', theme);
    
    // Update theme toggle button state
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    // Nếu muốn lưu vào localStorage:
    localStorage.setItem('theme', next);
}

function initTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('preferredTheme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Function to update active navigation link
function updateActiveNavLink(activeSectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkTarget = link.getAttribute('href').substring(1);
        
        if (linkTarget === activeSectionId) {
            link.classList.add('active');
        }
    });
}

// Function to get current section based on scroll position
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            return section.getAttribute('id');
        }
    }
    
    return 'home'; // Default to home if no section found
}

// Function to initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Add ripple effect
                this.classList.add('ripple');
                setTimeout(() => {
                    this.classList.remove('ripple');
                }, 600);
                
                // Update URL hash
                window.history.pushState(null, null, `#${targetId}`);
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Intersection Observer for section visibility
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Update active navigation link
                const sectionId = entry.target.getAttribute('id');
                updateActiveNavLink(sectionId);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Handle scroll events for better navigation state
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const currentSection = getCurrentSection();
            updateActiveNavLink(currentSection);
        }, 100);
    });
}

// Function to initialize i18n system
async function initializeI18n() {
    // Set initial language before loading any content
    currentLanguage = getPreferredLanguage();
    document.documentElement.lang = currentLanguage;
    document.documentElement.setAttribute('data-lang', currentLanguage);
    
    // Load initial language data
    const data = await loadLanguageData(currentLanguage);
    if (data) {
        // Update all text content
        updateTextContent();
        // Update dropdown UI
        updateLanguageDropdown(currentLanguage);
        // renderAboutInfo
        renderAboutInfo();
    } else {
        console.error('Failed to load initial language data');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme first (immediate)
    initTheme();
    
    // Initialize i18n system
    await initializeI18n();
    
    // Initialize navigation
    initNavigation();
    
    // Handle URL hash if present
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Scroll to target section after a short delay to ensure everything is loaded
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                updateActiveNavLink(targetId);
            }, 200);
        }
    } else {
        // Set initial active state based on current scroll position
        setTimeout(() => {
            const currentSection = getCurrentSection();
            updateActiveNavLink(currentSection);
        }, 100);
    }
    
    // Theme toggle event listener cho cả desktop và mobile
    ['themeToggle', 'themeToggleMobile'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', toggleTheme);
    });
    
    // Language dropdown event listeners
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('languageDropdown');
        
        if (dropdown && !dropdown.contains(event.target)) {
            closeLanguageDropdown();
        }
    });
    
    // Mark as initialized
    document.body.classList.add('initialized');
});

// Export functions for external use
window.i18n = {
    changeLanguage,
    selectLanguage,
    toggleLanguageDropdown,
    closeLanguageDropdown,
    updateTextContent,
    getCurrentLanguage: () => currentLanguage,
    getPreferredLanguage,
    loadLanguageData,
    data: () => i18nData,
};

window.theme = {
    toggle: toggleTheme,
    set: setTheme,
    getCurrent: () => currentTheme
};

window.interactions = {
    toggleSkill,
    toggleTimeline,
    expandTimeline,
    scrollToProjects,
    getDataDir
};

// Function to toggle skill expansion
function toggleSkill(skillId) {
    const skillItem = document.querySelector(`[data-skill="${skillId}"]`);
    if (skillItem) {
        skillItem.classList.toggle('expanded');
    }
}

// Function to toggle timeline expansion
function toggleTimeline(timelineItem) {
    const details = timelineItem.querySelector('.timeline-details');
    const indicator = timelineItem.querySelector('.expand-indicator');
    
    // Toggle expanded class
    timelineItem.classList.toggle('expanded');
    
    if (timelineItem.classList.contains('expanded')) {
        // Expand
        details.style.maxHeight = details.scrollHeight + "px";
        details.classList.add('expanded');
        indicator.style.transform = 'rotate(180deg)';
        
        // Add smooth animation
        setTimeout(() => {
            details.style.opacity = '1';
            details.style.transform = 'translateY(0)';
        }, 50);
    } else {
        // Collapse
        details.style.maxHeight = "0";
        details.style.opacity = '0';
        details.style.transform = 'translateY(-10px)';
        indicator.style.transform = 'rotate(0deg)';
        
        // Remove expanded class after animation
        setTimeout(() => {
            details.classList.remove('expanded');
        }, 600);
    }
}

// Expand timeline to show more items
function expandTimeline() {
    const container = document.getElementById('timelineContainer');
    const hiddenItems = container.querySelectorAll('.timeline-item.hidden');
    const expandBtn = document.getElementById('expandTimelineBtn');
    const expandBtnText = document.getElementById('expandBtnText');
    const expandBtnIcon = document.getElementById('expandBtnIcon');
    
    // Show next 2 items
    let shownCount = 0;
    let lastShown = null;
    hiddenItems.forEach((item, index) => {
        if (shownCount < 2 && item.classList.contains('hidden')) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            // Animate in
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
            shownCount++;
            lastShown = item;
        }
    });
    // Nếu là mobile, scroll tới item mới nhất
    if (window.innerWidth <= 768 && lastShown) {
        setTimeout(() => {
            lastShown.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 700);
    }
    // Check if all items are shown
    const remainingHidden = container.querySelectorAll('.timeline-item.hidden').length;
    if (remainingHidden === 0) {
        expandBtn.style.display = 'none';
    } else {
        // Update button text
        expandBtnText.textContent = window.common.getLangText('timeline.expand_more', `Xem thêm ${remainingHidden} kinh nghiệm`).replace('{count}', remainingHidden);
    }
}

// Function to scroll to projects section
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        // Add ripple effect
        const button = event.target.closest('button');
        if (button) {
            button.classList.add('ripple');
            setTimeout(() => {
                button.classList.remove('ripple');
            }, 600);
        }
        
        // Smooth scroll to projects section
        projectsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active navigation link
        updateActiveNavLink('projects');
    }
}

// Responsive Hamburger Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMobile = document.getElementById('navMobile');
const closeMobileMenu = document.getElementById('closeMobileMenu');

if (mobileMenuBtn && navMobile) {
    mobileMenuBtn.addEventListener('click', () => {
        navMobile.classList.remove('hidden');
    });
}
if (closeMobileMenu && navMobile) {
    closeMobileMenu.addEventListener('click', () => {
        navMobile.classList.add('hidden');
    });
}
// Đóng menu khi click vào link
if (navMobile) {
    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMobile.classList.add('hidden');
        });
    });
}

// Đổi ngôn ngữ cho cả desktop và mobile
function setLanguage(lang, flag) {
    // Cập nhật cờ cho cả hai dropdown
    const flagEls = [
        document.getElementById('currentFlag'),
        document.getElementById('currentFlagMobile')
    ];
    flagEls.forEach(el => { if (el) el.src = flag; });
    // Lưu vào localStorage
    localStorage.setItem('lang', lang);
    // ... logic cập nhật giao diện đa ngôn ngữ ...
    // (nếu có hàm loadLanguage thì gọi ở đây)
    if (window.loadLanguage) window.loadLanguage(lang);
}

function bindLanguageDropdown(dropdownId, toggleId, menuId, flagId) {
    const dropdown = document.getElementById(dropdownId);
    const toggle = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    if (!dropdown || !toggle || !menu) return;
    // Toggle menu
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    // Chọn ngôn ngữ
    menu.querySelectorAll('.language-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            const flag = btn.getAttribute('data-flag');
            setLanguage(lang, flag);
            dropdown.classList.remove('active');
        });
    });
    // Đóng khi click ngoài, nhưng KHÔNG đóng nếu click vào toggle
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== toggle) {
            dropdown.classList.remove('active');
        }
    });
}
bindLanguageDropdown('languageDropdown', 'languageDropdownToggle', 'languageDropdownMenu', 'currentFlag');
bindLanguageDropdown('languageDropdownMobile', 'languageDropdownToggleMobile', 'languageDropdownMenuMobile', 'currentFlagMobile');

// Đóng dropdown language khi resize để tránh lỗi khi chuyển giữa mobile/desktop
window.addEventListener('resize', () => {
    document.getElementById('languageDropdown')?.classList.remove('active');
    document.getElementById('languageDropdownMobile')?.classList.remove('active');
});