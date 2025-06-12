// Spark-X Platforms Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize platform dropdowns
    initializePlatformDropdowns();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize platform navigation
    initializePlatformNavigation();
    
    console.log('Spark-X Platforms initialized successfully!');
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Update menu icon
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = navList.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Platform Dropdown Functionality
function initializePlatformDropdowns() {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const content = document.getElementById(target);
            const card = this.closest('.platform-card');
            
            if (content) {
                // Close other open dropdowns
                const allContents = document.querySelectorAll('.platform-content');
                const allBtns = document.querySelectorAll('.dropdown-btn');
                
                allContents.forEach(otherContent => {
                    if (otherContent !== content && otherContent.classList.contains('active')) {
                        otherContent.classList.remove('active');
                    }
                });
                
                allBtns.forEach(otherBtn => {
                    if (otherBtn !== this) {
                        otherBtn.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                content.classList.toggle('active');
                this.classList.toggle('active');
                
                // Add visual feedback to card
                if (content.classList.contains('active')) {
                    card.style.transform = 'translateY(-2px)';
                    card.style.boxShadow = 'var(--shadow-xl)';
                } else {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }
            }
        });
    });
}

// Platform Navigation
function initializePlatformNavigation() {
    // Make platform action buttons functional
    const actionButtons = document.querySelectorAll('.platform-action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platformCard = this.closest('.platform-card');
            const platform = platformCard.getAttribute('data-platform');
            openPlatform(platform);
        });
    });
}

// Open Platform Page
function openPlatform(platformType) {
    const mainContent = document.querySelector('.main-content');
    const platformPages = document.getElementById('platformPages');
    const targetPage = document.getElementById(`${platformType}-page`);
    
    if (platformPages && targetPage) {
        // Hide main content
        const heroSection = document.querySelector('.hero');
        const platformsSection = document.querySelector('.platforms-section');
        
        if (heroSection) heroSection.style.display = 'none';
        if (platformsSection) platformsSection.style.display = 'none';
        
        // Show platform pages container
        platformPages.classList.add('active');
        
        // Hide all platform pages
        const allPages = document.querySelectorAll('.platform-page');
        allPages.forEach(page => page.classList.remove('active'));
        
        // Show target platform page
        targetPage.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update browser history
        history.pushState({ platform: platformType }, '', `#${platformType}`);
        
        // Initialize platform-specific functionality
        initializePlatformFeatures(platformType);
    }
}

// Close Platform Page
function closePlatform() {
    const heroSection = document.querySelector('.hero');
    const platformsSection = document.querySelector('.platforms-section');
    const platformPages = document.getElementById('platformPages');
    
    // Show main content
    if (heroSection) heroSection.style.display = 'flex';
    if (platformsSection) platformsSection.style.display = 'block';
    
    // Hide platform pages
    if (platformPages) {
        platformPages.classList.remove('active');
        const allPages = document.querySelectorAll('.platform-page');
        allPages.forEach(page => page.classList.remove('active'));
    }
    
    // Scroll to platforms section
    const platformsElement = document.getElementById('platforms');
    if (platformsElement) {
        platformsElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update browser history
    history.pushState(null, '', '#platforms');
}

// Initialize Platform-Specific Features
function initializePlatformFeatures(platformType) {
    switch (platformType) {
        case 'online':
            initializeEcommerceFeatures();
            break;
        case 'jobs':
            initializeJobsFeatures();
            break;
        case 'donors':
            initializeDonorsFeatures();
            break;
        case 'wings':
            initializeWingsFeatures();
            break;
    }
}

// E-commerce Features
function initializeEcommerceFeatures() {
    console.log('Initializing e-commerce features...');
    
    // Add click handlers to category cards
    const categoryCards = document.querySelectorAll('#online-page .category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('span').textContent;
            showNotification(`Browsing ${category} products...`, 'info');
            
            // Add selection effect
            categoryCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Add CSS for selected state
    if (!document.querySelector('#category-selection-styles')) {
        const style = document.createElement('style');
        style.id = 'category-selection-styles';
        style.textContent = `
            .category-card.selected {
                background: var(--gradient-primary);
                color: white;
            }
            .category-card.selected i {
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
}

// Jobs Features
function initializeJobsFeatures() {
    console.log('Initializing jobs features...');
    
    const searchBtn = document.querySelector('#jobs-page .search-btn');
    const searchInput = document.querySelector('#jobs-page .search-input');
    const filterSelect = document.querySelector('#jobs-page .filter-select');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput ? searchInput.value.trim() : '';
            const category = filterSelect ? filterSelect.value : 'All Categories';
            
            if (query) {
                showNotification(`Searching for "${query}" in ${category}...`, 'info');
                simulateJobSearch(query, category);
            } else {
                showNotification('Please enter a search term', 'warning');
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// Donors Features
function initializeDonorsFeatures() {
    console.log('Initializing donors features...');
    
    const donationCards = document.querySelectorAll('#donors-page .donation-card');
    donationCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h4').textContent;
            showNotification(`Exploring ${category} donation opportunities...`, 'info');
            
            // Add selection effect
            donationCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Add CSS for selected state
    if (!document.querySelector('#donation-selection-styles')) {
        const style = document.createElement('style');
        style.id = 'donation-selection-styles';
        style.textContent = `
            .donation-card.selected {
                border: 2px solid var(--accent-red);
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// Wings Features
function initializeWingsFeatures() {
    console.log('Initializing wings features...');
    
    const serviceCards = document.querySelectorAll('#wings-page .service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.querySelector('h4').textContent;
            showNotification(`Joining ${service}...`, 'info');
            
            // Add selection effect
            serviceCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Add CSS for selected state
    if (!document.querySelector('#service-selection-styles')) {
        const style = document.createElement('style');
        style.id = 'service-selection-styles';
        style.textContent = `
            .service-card.selected {
                border: 2px solid var(--accent-purple);
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// Simulate Job Search
function simulateJobSearch(query, category) {
    // Create a simple job results display
    const jobsContent = document.querySelector('.jobs-content');
    let resultsContainer = document.querySelector('.job-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'job-results';
        jobsContent.appendChild(resultsContainer);
    }
    
    // Sample job data
    const sampleJobs = [
        { title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote', type: 'Full-time' },
        { title: 'UI/UX Designer', company: 'Design Studio', location: 'New York', type: 'Contract' },
        { title: 'Product Manager', company: 'Startup Inc', location: 'San Francisco', type: 'Full-time' },
        { title: 'Data Analyst', company: 'Analytics Co', location: 'Chicago', type: 'Part-time' }
    ];
    
    resultsContainer.innerHTML = `
        <h4>Search Results for "${query}" in ${category}</h4>
        <div class="job-list">
            ${sampleJobs.map(job => `
                <div class="job-item">
                    <h5>${job.title}</h5>
                    <p><i class="fas fa-building"></i> ${job.company}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    <p><i class="fas fa-clock"></i> ${job.type}</p>
                    <button class="apply-btn">Apply Now</button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add styles for job results
    if (!document.querySelector('#job-results-styles')) {
        const style = document.createElement('style');
        style.id = 'job-results-styles';
        style.textContent = `
            .job-results {
                margin-top: 2rem;
                padding: 1.5rem;
                background: var(--gray-50);
                border-radius: var(--radius-lg);
            }
            .job-list {
                display: grid;
                gap: 1rem;
                margin-top: 1rem;
            }
            .job-item {
                background: white;
                padding: 1.5rem;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-sm);
                border-left: 4px solid var(--accent-green);
            }
            .job-item h5 {
                color: var(--gray-800);
                margin-bottom: 0.5rem;
            }
            .job-item p {
                color: var(--gray-600);
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
            }
            .job-item i {
                width: 16px;
                margin-right: 0.5rem;
            }
            .apply-btn {
                background: var(--accent-green);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: var(--radius-sm);
                cursor: pointer;
                margin-top: 1rem;
                transition: all var(--transition-normal);
            }
            .apply-btn:hover {
                background: #059669;
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add click handlers to apply buttons
    const applyBtns = resultsContainer.querySelectorAll('.apply-btn');
    applyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const jobTitle = this.closest('.job-item').querySelector('h5').textContent;
            showNotification(`Application submitted for ${jobTitle}!`, 'success');
        });
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Animations on Scroll
function initializeAnimations() {
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        const animatedElements = document.querySelectorAll('.platform-card, .category-card, .donation-card, .service-card');
        animatedElements.forEach(el => animationObserver.observe(el));
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
                border-left: 4px solid var(--primary-blue);
            }
            .notification-info { border-left-color: var(--primary-blue); }
            .notification-success { border-left-color: var(--accent-green); }
            .notification-warning { border-left-color: var(--accent-orange); }
            .notification-error { border-left-color: var(--accent-red); }
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 0.75rem;
            }
            .notification-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            .notification-info .notification-icon { color: var(--primary-blue); }
            .notification-success .notification-icon { color: var(--accent-green); }
            .notification-warning .notification-icon { color: var(--accent-orange); }
            .notification-error .notification-icon { color: var(--accent-red); }
            .notification-message {
                flex: 1;
                color: var(--gray-800);
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--gray-500);
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .notification-close:hover {
                color: var(--gray-800);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'error': return 'fas fa-times-circle';
        default: return 'fas fa-info-circle';
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.platform) {
        openPlatform(event.state.platform);
    } else {
        closePlatform();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('Spark-X Platforms is now visible');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to close platform pages
    if (event.key === 'Escape') {
        const platformPages = document.getElementById('platformPages');
        if (platformPages && platformPages.classList.contains('active')) {
            closePlatform();
        }
    }
    
    // Ctrl/Cmd + K for search (future feature)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Future: Open search modal
        showNotification('Search feature coming soon!', 'info');
    }
});

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance monitoring
logPerformance();

// Export functions for global access
window.SparkX = {
    openPlatform,
    closePlatform,
    showNotification
};
