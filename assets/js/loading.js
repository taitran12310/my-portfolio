// Theme detection and setup
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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('preferredTheme', theme);
}

// Initialize theme immediately
(function() {
    const theme = getPreferredTheme();
    setTheme(theme);
})();

// Loading text animation
const loadingTexts = [
    'Initializing',
    'Loading Assets',
    'Setting Theme',
    'Preparing UI',
    'Almost Ready'
];

let currentTextIndex = 0;
let loadingTextInterval;

function updateLoadingText() {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.style.opacity = '0';
        setTimeout(() => {
            loadingText.textContent = loadingTexts[currentTextIndex];
            loadingText.style.opacity = '1';
            currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
        }, 200);
    }
}

function startLoadingAnimation() {
    updateLoadingText();
    loadingTextInterval = setInterval(updateLoadingText, 2000);
}

function stopLoadingAnimation() {
    if (loadingTextInterval) {
        clearInterval(loadingTextInterval);
    }
}

// Function to redirect to main page
function redirectToMain() {
    stopLoadingAnimation();
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    }
}

// Start loading animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    startLoadingAnimation();
    
    // Simulate loading time and redirect
    setTimeout(() => {
        redirectToMain();
    }, 3000); // 3 seconds loading time
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('preferredTheme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
} 