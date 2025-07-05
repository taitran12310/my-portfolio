document.addEventListener('DOMContentLoaded', function() {
    function fetchAndRenderProjects() {
        const lang = window.i18n.getPreferredLanguage();
        const file = `${window.interactions.getDataDir()}projects_${lang}.json`;
        fetch(file)
            .then(response => response.json())
            .then(projects => {
                const container = document.getElementById('projectsScroll');
                if (!container) return;
                container.innerHTML = '';
                projects.forEach((project, idx) => {
                    container.innerHTML += `
                    <div class="project-card glass rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300 neon-glow min-w-[350px] md:min-w-[400px] cursor-pointer" data-project-idx="${idx}">
                        <div class="gradient-bg h-48 flex items-center justify-center relative">
                            <div class="w-16 h-16 opacity-60 float">
                                <lottie-player 
                                    src="${project.lottie}" 
                                    background="transparent" 
                                    speed="1" 
                                    style="width: 100%; height: 100%;" 
                                    loop 
                                    autoplay>
                                </lottie-player>
                            </div>
                            <span class="text-white font-rajdhani font-medium">${project.title}</span>
                        </div>
                        <div class="p-6">
                            <h4 class="text-xl font-semibold mb-3 text-white font-orbitron">${project.title}</h4>
                            <p class="text-blue-100 mb-4 font-exo">${project.description}</p>
                            <div class="flex flex-wrap gap-2">
                                ${project.tags.map(tag => `<span class=\"neumorphism px-3 py-1 rounded-full text-sm font-rajdhani font-medium ${window.common.getTechColor(tag)}\">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    `;
                });
                // Thêm sự kiện click cho từng project-card
                Array.from(container.getElementsByClassName('project-card')).forEach(card => {
                    card.onclick = function() {
                        const idx = this.getAttribute('data-project-idx');
                        showProjectDetails('project'+(parseInt(idx)+1));
                    };
                });
            });
    }
    fetchAndRenderProjects();
    // Lắng nghe sự kiện đổi ngôn ngữ để fetch lại đúng file
    window.addEventListener('languageChanged', function() {
        fetchAndRenderProjects();
    });

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

function showProjectDetails(projectId) {
    const lang = window.i18n.getPreferredLanguage();
    const file = `${window.interactions.getDataDir()}projects_${lang}.json`;
    fetch(file)
        .then(response => response.json())
        .then(projects => {
            let idx = -1;
            if (projectId.startsWith('project')) {
                idx = parseInt(projectId.replace('project', '')) - 1;
            }
            const defaultProject = {
                features: [],
                challenges: [],
                solutions: [],
                image: '',
                demoUrl: '#',
                githubUrl: '#',
                technologies: [],
                tags: []
            };
            const project = { ...defaultProject, ...projects[idx] };
            if (!project) return;
            const modal = document.getElementById('projectModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            const modalFooter = document.getElementById('modalFooter');
            modalTitle.textContent = project.title;
            modalContent.innerHTML = `
                <div class="project-details-image" style="background-image: url('${project.image || ''}')"></div>
                <div class="space-y-6">
                    <div>
                        <h4 class="text-xl font-semibold text-white mb-3 font-orbitron">${window.common.getLangText('project.desc', 'Mô tả')}</h4>
                        <p class="text-blue-100 font-exo leading-relaxed">${project.longDescription || project.description}</p>
                    </div>
                    <div>
                        <h4 class="text-xl font-semibold text-white mb-3 font-orbitron">${window.common.getLangText('project.tech', 'Công nghệ sử dụng')}</h4>
                        <div class="flex flex-wrap gap-2">
                            ${(project.technologies.length ? project.technologies : project.tags).map(tech => 
                                `<span class="neumorphism px-3 py-1 rounded-full text-sm font-rajdhani font-medium ${window.common.getTechColor(tech)}">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                    ${project.features.length ? `<div><h4 class=\"text-xl font-semibold text-white mb-3 font-orbitron\">${window.common.getLangText('project.features', 'Tính năng chính')}</h4><ul class=\"text-blue-100 space-y-2 font-exo\">${project.features.map(feature => `<li>• ${feature}</li>`).join('')}</ul></div>` : ''}
                    ${(project.challenges.length && project.solutions.length) ? `<div><h4 class=\"text-xl font-semibold text-white mb-3 font-orbitron\">${window.common.getLangText('project.challenges_solutions', 'Thách thức & Giải pháp')}</h4><div class=\"grid md:grid-cols-2 gap-6\"><div><h5 class=\"text-lg font-semibold text-red-300 mb-2 font-rajdhani\">${window.common.getLangText('project.challenges', 'Thách thức')}</h5><ul class=\"text-blue-100 space-y-1 font-exo text-sm\">${project.challenges.map(challenge => `<li>• ${challenge}</li>`).join('')}</ul></div><div><h5 class=\"text-lg font-semibold text-green-300 mb-2 font-rajdhani\">${window.common.getLangText('project.solutions', 'Giải pháp')}</h5><ul class=\"text-blue-100 space-y-1 font-exo text-sm\">${project.solutions.map(solution => `<li>• ${solution}</li>`).join('')}</ul></div></div></div>` : ''}
                </div>
            `;
            modalFooter.innerHTML = `
                <a href="${project.demoUrl || '#'}" class="project-btn hover:neumorphism-inset font-rajdhani font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow text-white">${window.common.getLangText('project.demo', 'Xem Demo')}</a>
                <a href="${project.githubUrl || '#'}" class="project-btn hover:neumorphism-inset font-rajdhani font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow-green text-white">${window.common.getLangText('project.github', 'GitHub')}</a>
            `;
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        });
}

function closeProjectDetails() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
}

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

window.projects = {
    showProjectDetails,
    closeProjectDetails,
    scrollProjects
};
