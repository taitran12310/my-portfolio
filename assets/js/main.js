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

// Function to get nested object value by dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// Function to load language data from JSON file
async function loadLanguageData(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
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
        const text = getNestedValue(i18nData[currentLanguage], key);
        if (text) {
            element.textContent = text;
        }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = getNestedValue(i18nData[currentLanguage], key);
        if (text) {
            element.placeholder = text;
        }
    });

    // Update page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const key = titleElement.getAttribute('data-i18n');
        const text = getNestedValue(i18nData[currentLanguage], key);
        if (text) {
            document.title = text;
        }
    }
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
    
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    updateTextContent();
    updateLanguageDropdown(lang);
    
    // Store language preference in localStorage
    localStorage.setItem('preferredLanguage', lang);
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
    
    // Observe timeline items for animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-20px 0px -20px 0px'
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
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
    loadLanguageData
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
    showProjectDetails,
    closeProjectDetails,
    scrollProjects
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
        expandBtnText.textContent = `Xem thêm ${remainingHidden} kinh nghiệm`;
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

// Project data
const projectData = {
    project1: {
        title: "E-commerce Platform",
        description: "Nền tảng thương mại điện tử hiện đại với đầy đủ tính năng mua bán, quản lý đơn hàng, thanh toán trực tuyến và hệ thống quản trị.",
        longDescription: "Dự án E-commerce Platform là một hệ thống thương mại điện tử hoàn chỉnh được phát triển với công nghệ hiện đại. Ứng dụng bao gồm các tính năng chính như quản lý sản phẩm, giỏ hàng, thanh toán, quản lý đơn hàng và hệ thống quản trị admin.",
        technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe API", "JWT"],
        features: [
            "Giao diện người dùng responsive và thân thiện",
            "Hệ thống đăng ký/đăng nhập bảo mật",
            "Quản lý sản phẩm với hình ảnh và mô tả chi tiết",
            "Giỏ hàng và thanh toán trực tuyến",
            "Quản lý đơn hàng và theo dõi trạng thái",
            "Hệ thống đánh giá và bình luận",
            "Dashboard quản trị với thống kê chi tiết"
        ],
        challenges: [
            "Tối ưu hóa hiệu suất với lượng dữ liệu lớn",
            "Bảo mật thông tin thanh toán",
            "Xử lý đồng thời nhiều đơn hàng",
            "Tích hợp nhiều cổng thanh toán"
        ],
        solutions: [
            "Sử dụng Redis để cache dữ liệu",
            "Mã hóa SSL/TLS cho thanh toán",
            "Queue system để xử lý đơn hàng",
            "API gateway để tích hợp thanh toán"
        ],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        githubUrl: "#"
    },
    project2: {
        title: "Task Management App",
        description: "Ứng dụng quản lý công việc với giao diện đẹp mắt, hỗ trợ teamwork và theo dõi tiến độ dự án.",
        longDescription: "Task Management App là một ứng dụng web giúp quản lý công việc và dự án một cách hiệu quả. Ứng dụng hỗ trợ làm việc nhóm, theo dõi tiến độ và quản lý deadline.",
        technologies: ["Vue.js", "Firebase", "Tailwind CSS", "Vuex", "Vue Router"],
        features: [
            "Tạo và quản lý task với deadline",
            "Phân công công việc cho team members",
            "Theo dõi tiến độ với Kanban board",
            "Thông báo real-time",
            "Báo cáo và thống kê",
            "Tích hợp calendar"
        ],
        challenges: [
            "Đồng bộ dữ liệu real-time",
            "Quản lý quyền truy cập",
            "Tối ưu UX cho mobile"
        ],
        solutions: [
            "Firebase Realtime Database",
            "Role-based access control",
            "Progressive Web App (PWA)"
        ],
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        githubUrl: "#"
    },
    project3: {
        title: "Portfolio Website",
        description: "Website portfolio cá nhân với thiết kế hiện đại, responsive và hiệu ứng đẹp mắt.",
        longDescription: "Portfolio Website được thiết kế với giao diện hiện đại, responsive và các hiệu ứng animation mượt mà. Website showcase các dự án, kỹ năng và kinh nghiệm làm việc.",
        technologies: ["HTML/CSS", "JavaScript", "Tailwind CSS", "Lottie", "GSAP"],
        features: [
            "Giao diện responsive đẹp mắt",
            "Hiệu ứng animation mượt mà",
            "Dark/Light theme",
            "Đa ngôn ngữ (VN/EN/JP)",
            "Timeline kinh nghiệm",
            "Contact form"
        ],
        challenges: [
            "Tối ưu performance",
            "Cross-browser compatibility",
            "SEO optimization"
        ],
        solutions: [
            "Lazy loading và code splitting",
            "CSS fallbacks và polyfills",
            "Meta tags và structured data"
        ],
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        githubUrl: "#"
    },
    project4: {
        title: "Weather App",
        description: "Ứng dụng thời tiết với API real-time, dự báo chính xác và giao diện thân thiện.",
        longDescription: "Weather App cung cấp thông tin thời tiết real-time với dự báo chính xác. Ứng dụng có giao diện đẹp mắt và dễ sử dụng.",
        technologies: ["React Native", "Expo", "OpenWeather API", "AsyncStorage"],
        features: [
            "Thời tiết real-time",
            "Dự báo 7 ngày",
            "Định vị tự động",
            "Thông báo thời tiết",
            "Widget cho home screen"
        ],
        challenges: [
            "Tối ưu API calls",
            "Xử lý location permissions",
            "Offline functionality"
        ],
        solutions: [
            "Caching với AsyncStorage",
            "Request location permission",
            "Service worker cho offline"
        ],
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        githubUrl: "#"
    },
    project5: {
        title: "Chat Application",
        description: "Ứng dụng chat real-time với WebSocket, hỗ trợ nhóm chat và file sharing.",
        longDescription: "Chat Application là một ứng dụng chat real-time với khả năng tạo nhóm, chia sẻ file và gọi video. Ứng dụng sử dụng WebSocket để đảm bảo tốc độ truyền tin nhanh.",
        technologies: ["Socket.io", "Express.js", "MongoDB", "React", "WebRTC"],
        features: [
            "Chat real-time",
            "Tạo nhóm chat",
            "Chia sẻ file và hình ảnh",
            "Gọi video",
            "Emoji và reactions",
            "Tìm kiếm tin nhắn"
        ],
        challenges: [
            "Xử lý WebSocket connections",
            "File upload và storage",
            "Video call quality"
        ],
        solutions: [
            "Connection pooling",
            "Cloud storage (AWS S3)",
            "WebRTC optimization"
        ],
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        demoUrl: "#",
        githubUrl: "#"
    }
};

// Function to show project details
function showProjectDetails(projectId) {
    const project = projectData[projectId];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalFooter = document.getElementById('modalFooter');
    
    modalTitle.textContent = project.title;
    
    modalContent.innerHTML = `
        <div class="project-details-image" style="background-image: url('${project.image}')"></div>
        
        <div class="space-y-6">
            <div>
                <h4 class="text-xl font-semibold text-white mb-3 font-orbitron">Mô tả</h4>
                <p class="text-blue-100 font-exo leading-relaxed">${project.longDescription}</p>
            </div>
            
            <div>
                <h4 class="text-xl font-semibold text-white mb-3 font-orbitron">Công nghệ sử dụng</h4>
                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => 
                        `<span class="neumorphism px-3 py-1 rounded-full text-sm font-rajdhani font-medium text-blue-600">${tech}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div>
                <h4 class="text-xl font-semibold text-white mb-3 font-orbitron">Tính năng chính</h4>
                <ul class="text-blue-100 space-y-2 font-exo">
                    ${project.features.map(feature => `<li>• ${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div>
                <h4 class="text-xl font-semibold text-white mb-3 font-orbitron">Thách thức & Giải pháp</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h5 class="text-lg font-semibold text-red-300 mb-2 font-rajdhani">Thách thức</h5>
                        <ul class="text-blue-100 space-y-1 font-exo text-sm">
                            ${project.challenges.map(challenge => `<li>• ${challenge}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h5 class="text-lg font-semibold text-green-300 mb-2 font-rajdhani">Giải pháp</h5>
                        <ul class="text-blue-100 space-y-1 font-exo text-sm">
                            ${project.solutions.map(solution => `<li>• ${solution}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add action buttons to footer
    modalFooter.innerHTML = `
        <a href="${project.demoUrl}" class="neumorphism hover:neumorphism-inset font-rajdhani font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow text-white">
            Xem Demo
        </a>
        <a href="${project.githubUrl}" class="neumorphism hover:neumorphism-inset font-rajdhani font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow-green text-white">
            GitHub
        </a>
    `;
    
    // Show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add blur class to body instead of using filter
    document.body.classList.add('modal-open');
}

// Function to close project details
function closeProjectDetails() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Remove blur class from body
    document.body.classList.remove('modal-open');
}

// Function to scroll projects
function scrollProjects(index) {
    const scrollContainer = document.getElementById('projectsScroll');
    const projectCards = scrollContainer.querySelectorAll('.project-card');
    const indicators = document.querySelectorAll('.scroll-indicator');
    
    if (projectCards[index]) {
        projectCards[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
        
        // Update active indicator
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
}

// Initialize scroll indicators
document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.getElementById('projectsScroll');
    const indicators = document.querySelectorAll('.scroll-indicator');
    
    if (scrollContainer && indicators.length > 0) {
        // Set first indicator as active
        indicators[0].classList.add('active');
        
        // Update indicators on scroll
        scrollContainer.addEventListener('scroll', function() {
            const scrollLeft = scrollContainer.scrollLeft;
            const cardWidth = scrollContainer.querySelector('.project-card').offsetWidth + 24; // 24px gap
            const currentIndex = Math.round(scrollLeft / cardWidth);
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProjectDetails();
            }
        });
    }
});