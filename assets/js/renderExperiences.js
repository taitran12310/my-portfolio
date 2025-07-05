const MAX_SHOW_COUNT = 2;
let currentShowCount = 0;
let allExperiences = [];

function getText(key) {
    if (key === 'expand') {
        return window.common.getLangText('timeline.expand', 'Xem thêm kinh nghiệm');
    }
    if (key === 'collapse') {
        return window.common.getLangText('timeline.collapse', 'Thu gọn');
    }
    return '';
}

function createTimelineItemHtml(exp, idx) {
    const isLeft = idx % 2 === 0;
    let itemHtml = '';
    if (isLeft) {
        itemHtml = `
        <div class="timeline-item visible relative flex flex-col md:flex-row items-center md:items-center">
            <div class="w-full md:w-1/2 p-0 md:pr-8 text-center md:text-right md:block">
                <div class="glass rounded-3xl p-6 transform hover:scale-105 transition-all duration-300 neon-glow mb-4 cursor-pointer" data-timeline-idx="${idx}">
                    <div class="flex items-center justify-center md:justify-end mb-3">
                        <span class="text-sm font-rajdhani font-medium text-blue-300">${exp.period}</span>
                    </div>
                    <h4 class="text-xl font-semibold text-white font-orbitron mb-2">${exp.title}</h4>
                    <p class="text-blue-100 font-exo mb-3">${exp.company}</p>
                    <p class="text-blue-100 text-sm font-exo">${exp.description}</p>
                    <div class="timeline-details hidden">
                        <div class="timeline-details-content">
                            <h5 class="text-lg font-semibold text-white mb-3 font-orbitron">${window.common.getLangText('timeline.responsibilities', 'Trách nhiệm chính:')}</h5>
                            <ul class="text-blue-100 text-sm space-y-2 font-exo">
                                ${exp.responsibilities.map(r => `<li>• ${r}</li>`).join('')}
                            </ul>
                            <div class="mt-4 pt-4 border-t border-blue-200/20">
                                <h6 class="text-md font-semibold text-white mb-2 font-rajdhani">${window.common.getLangText('timeline.tech', 'Công nghệ sử dụng:')}</h6>
                                <div class="flex flex-wrap gap-2">
                                    ${exp.technologies.map(tech => `<span class=\"px-2 py-1 bg-blue-600/20 rounded text-xs font-rajdhani font-medium ${window.common.getTechColor(tech)}\">${tech}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full flex justify-center md:block md:w-auto order-first md:order-none mb-4 md:mb-0">
                <div class="w-8 h-8 md:w-6 md:h-6 gradient-bg rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div class="hidden md:block w-1/2 pl-8"></div>
        </div>
        `;
    } else {
        itemHtml = `
        <div class="timeline-item visible relative flex flex-col md:flex-row items-center md:items-center">
            <div class="hidden md:block w-1/2 pr-8"></div>
            <div class="w-full flex justify-center md:block md:w-auto order-first md:order-none mb-4 md:mb-0">
                <div class="w-8 h-8 md:w-6 md:h-6 gradient-bg-alt rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div class="w-full md:w-1/2 p-0 md:pl-8 text-center md:text-left">
                <div class="glass rounded-3xl p-6 transform hover:scale-105 transition-all duration-300 neon-glow mb-4 cursor-pointer" data-timeline-idx="${idx}">
                    <div class="flex items-center justify-center md:justify-start mb-3">
                        <span class="text-sm font-rajdhani font-medium text-green-300">${exp.period}</span>
                    </div>
                    <h4 class="text-xl font-semibold text-white font-orbitron mb-2">${exp.title}</h4>
                    <p class="text-blue-100 font-exo mb-3">${exp.company}</p>
                    <p class="text-blue-100 text-sm font-exo">${exp.description}</p>
                    <div class="timeline-details hidden">
                        <div class="timeline-details-content">
                            <h5 class="text-lg font-semibold text-white mb-3 font-orbitron">${window.common.getLangText('timeline.responsibilities', 'Trách nhiệm chính:')}</h5>
                            <ul class="text-blue-100 text-sm space-y-2 font-exo">
                                ${exp.responsibilities.map(r => `<li>• ${r}</li>`).join('')}
                            </ul>
                            <div class="mt-4 pt-4 border-t border-green-200/20">
                                <h6 class="text-md font-semibold text-white mb-2 font-rajdhani">${window.common.getLangText('timeline.tech', 'Công nghệ sử dụng:')}</h6>
                                <div class="flex flex-wrap gap-2">
                                    ${exp.technologies.map(tech => `<span class=\"px-2 py-1 bg-green-600/20 rounded text-xs font-rajdhani font-medium ${window.common.getTechColor(tech)}\">${tech}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    return itemHtml;
}

function renderExperiences(count) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    container.innerHTML = '';
    const experiences = allExperiences.slice(0, count || MAX_SHOW_COUNT);
    experiences.forEach((exp, idx) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = createTimelineItemHtml(exp, idx);
        const item = wrapper.firstElementChild;
        container.appendChild(item);
    });
    currentShowCount = count || MAX_SHOW_COUNT;
    updateExpandButton();
    addGlassClickEvents();
}

function addMoreExperiences() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    const nextItems = allExperiences.slice(currentShowCount, currentShowCount + MAX_SHOW_COUNT);
    nextItems.forEach((exp, idx) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = createTimelineItemHtml(exp, currentShowCount + idx);
        const item = wrapper.firstElementChild;
        container.appendChild(item);
    });
    currentShowCount += nextItems.length;
    updateExpandButton();
    addGlassClickEvents();
}

function updateExpandButton() {
    let btn = document.getElementById('expandTimelineBtn');
    const container = document.getElementById('timelineBtnContainer');
    if (allExperiences.length < MAX_SHOW_COUNT) {
        // Lấy phần tử cha của nút và xóa nội dung bên trong
        container.innerHTML = null;
        return;
    } else {
        if (!btn) {
            const expandBtn = `
            <button id="expandTimelineBtn" class="neumorphism hover:neumorphism-inset text-gray-800 font-rajdhani font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 neon-glow">
                <span class="flex items-center space-x-2">
                    <span id="expandBtnText">${window.common ? window.common.getLangText('timeline.expand', 'Xem thêm kinh nghiệm') : 'Xem thêm kinh nghiệm'}</span>
                    <svg id="expandBtnIcon" class="w-6 h-6 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </span>
            </button>`;
            container.innerHTML = expandBtn;
            btn = document.getElementById('expandTimelineBtn');
            if (btn) btn.onclick = handleExpandTimeline;
        }
    };
    if (btn) {
        if (currentShowCount >= allExperiences.length) {
            btn.querySelector('#expandBtnText').textContent = window.common.getLangText('timeline.collapse', 'Thu gọn');
            btn.querySelector('#expandBtnIcon').style.transform = 'rotate(180deg)';
        } else {
            btn.querySelector('#expandBtnText').textContent = window.common.getLangText('timeline.expand', 'Xem thêm kinh nghiệm');
            btn.querySelector('#expandBtnIcon').style.transform = 'rotate(0deg)';
        }
    }
}

function addGlassClickEvents() {
    const container = document.getElementById('timelineContainer');
    Array.from(container.getElementsByClassName('timeline-item')).forEach(item => {
        item.onclick = function(e) {
            const details = this.querySelector('.timeline-details');
            if (details) details.classList.toggle('hidden');
            item.classList.toggle('expanded');
        };
    });
}

function handleExpandTimeline() {
    if (currentShowCount >= allExperiences.length) {
        renderExperiences(); // Thu gọn về 2 item đầu
    } else {
        addMoreExperiences(); // Thêm 2 item mới
    }
}

document.addEventListener('DOMContentLoaded', function() {
    function fetchAndRenderExperiences() {
        const lang = window.i18n.getPreferredLanguage();
        const file = `${window.interactions.getDataDir()}experiences_${lang}.json`;
        fetch(file)
            .then(response => response.json())
            .then(data => {
                allExperiences = data;
                renderExperiences(currentShowCount);
            });
    }
    fetchAndRenderExperiences();
    const btn = document.getElementById('expandTimelineBtn');
    if (btn) btn.onclick = handleExpandTimeline;
    // Lắng nghe sự kiện đổi ngôn ngữ để fetch lại đúng file
    window.addEventListener('languageChanged', function() {
        fetchAndRenderExperiences();
    });
}); 