// Render Skills functionality
window.skills = {
    // Data for skills
    skillsData: {
        vn: [
            {
                id: "frontend",
                name: "Frontend Development",
                percentage: 90,
                color: "blue",
                gradient: "from-blue-500 to-purple-600",
                children: [
                    { name: "React.js", level: "Expert" },
                    { name: "Vue.js", level: "Advanced" },
                    { name: "TypeScript", level: "Advanced" },
                    { name: "Tailwind CSS", level: "Expert" }
                ]
            },
            {
                id: "backend",
                name: "Backend Development",
                percentage: 85,
                color: "green",
                gradient: "from-green-500 to-blue-600",
                children: [
                    { name: "Node.js", level: "Advanced" },
                    { name: "Express.js", level: "Advanced" },
                    { name: "MongoDB", level: "Intermediate" },
                    { name: "PostgreSQL", level: "Intermediate" }
                ]
            },
            {
                id: "design",
                name: "UI/UX Design",
                percentage: 80,
                color: "purple",
                gradient: "from-purple-500 to-pink-600",
                children: [
                    { name: "Figma", level: "Advanced" },
                    { name: "Adobe XD", level: "Intermediate" },
                    { name: "Sketch", level: "Basic" },
                    { name: "Prototyping", level: "Advanced" }
                ]
            }
        ],
        en: [
            {
                id: "frontend",
                name: "Frontend Development",
                percentage: 90,
                color: "blue",
                gradient: "from-blue-500 to-purple-600",
                children: [
                    { name: "React.js", level: "Expert" },
                    { name: "Vue.js", level: "Advanced" },
                    { name: "TypeScript", level: "Advanced" },
                    { name: "Tailwind CSS", level: "Expert" }
                ]
            },
            {
                id: "backend",
                name: "Backend Development",
                percentage: 85,
                color: "green",
                gradient: "from-green-500 to-blue-600",
                children: [
                    { name: "Node.js", level: "Advanced" },
                    { name: "Express.js", level: "Advanced" },
                    { name: "MongoDB", level: "Intermediate" },
                    { name: "PostgreSQL", level: "Intermediate" }
                ]
            },
            {
                id: "design",
                name: "UI/UX Design",
                percentage: 80,
                color: "purple",
                gradient: "from-purple-500 to-pink-600",
                children: [
                    { name: "Figma", level: "Advanced" },
                    { name: "Adobe XD", level: "Intermediate" },
                    { name: "Sketch", level: "Basic" },
                    { name: "Prototyping", level: "Advanced" }
                ]
            }
        ],
        jp: [
            {
                id: "frontend",
                name: "フロントエンド開発",
                percentage: 90,
                color: "blue",
                gradient: "from-blue-500 to-purple-600",
                children: [
                    { name: "React.js", level: "エキスパート" },
                    { name: "Vue.js", level: "上級" },
                    { name: "TypeScript", level: "上級" },
                    { name: "Tailwind CSS", level: "エキスパート" }
                ]
            },
            {
                id: "backend",
                name: "バックエンド開発",
                percentage: 85,
                color: "green",
                gradient: "from-green-500 to-blue-600",
                children: [
                    { name: "Node.js", level: "上級" },
                    { name: "Express.js", level: "上級" },
                    { name: "MongoDB", level: "中級" },
                    { name: "PostgreSQL", level: "中級" }
                ]
            },
            {
                id: "design",
                name: "UI/UXデザイン",
                percentage: 80,
                color: "purple",
                gradient: "from-purple-500 to-pink-600",
                children: [
                    { name: "Figma", level: "上級" },
                    { name: "Adobe XD", level: "中級" },
                    { name: "Sketch", level: "初級" },
                    { name: "プロトタイピング", level: "上級" }
                ]
            }
        ]
    },

    // Render skills based on current language
    renderSkills: function() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;

        const currentLang = window.currentLanguage || 'vn';
        const skills = this.skillsData[currentLang] || this.skillsData.vn;

        const skillsHTML = `
            <div class="mt-8 space-y-4">
                ${skills.map(skill => `
                    <div class="skill-item neumorphism rounded-xl p-4" data-skill="${skill.id}">
                        <div class="flex items-center justify-between mb-2 cursor-pointer" onclick="window.interactions.toggleSkill('${skill.id}')">
                            <span class="font-rajdhani font-semibold text-gray-700">${skill.name}</span>
                            <div class="flex items-center">
                                <span class="skill-percentage text-${skill.color}-600 font-bold mr-2" data-target="${skill.percentage}">0%</span>
                                <svg class="expand-indicator w-5 h-5 text-${skill.color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="skill-progress bg-gradient-to-r ${skill.gradient} h-2 rounded-full transition-all duration-1000 ease-out" style="width: 0%"></div>
                        </div>
                        <div class="skill-children">
                            ${skill.children.map(child => `
                                <div class="child-skill">
                                    <span class="child-skill-name">${child.name}</span>
                                    <span class="child-skill-level">${child.level}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = skillsHTML;
        
        // Animate skill progress bars after rendering
        this.animateSkillProgress();
    },

    // Animate skill progress bars
    animateSkillProgress: function() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            const percentageElement = item.querySelector('.skill-percentage');
            const progressBar = item.querySelector('.skill-progress');
            const targetPercentage = parseInt(percentageElement.getAttribute('data-target'));
            
            // Delay animation for each skill item
            setTimeout(() => {
                this.animateProgress(percentageElement, progressBar, targetPercentage);
            }, index * 200); // 200ms delay between each skill
        });
    },

    // Animate individual progress bar
    animateProgress: function(percentageElement, progressBar, targetPercentage) {
        let currentPercentage = 0;
        const duration = 1500; // 1.5 seconds
        const increment = targetPercentage / (duration / 16); // 60fps
        
        const animate = () => {
            currentPercentage += increment;
            
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
            }
            
            percentageElement.textContent = Math.round(currentPercentage) + '%';
            progressBar.style.width = currentPercentage + '%';
            
            if (currentPercentage < targetPercentage) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    },

    // Initialize skills
    init: function() {
        this.renderSkills();
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.skills.init();
}); 