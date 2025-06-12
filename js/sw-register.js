// Service Worker Registration for Spark-X Platforms PWA

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        registerServiceWorker();
    });
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('New service worker found, installing...');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // New update available
                        showUpdateNotification();
                    } else {
                        // Content is cached for offline use
                        console.log('Content is cached for offline use.');
                        showOfflineReadyNotification();
                    }
                }
            });
        });
        
    } catch (error) {
        console.log('ServiceWorker registration failed: ', error);
    }
}

// Show update notification
function showUpdateNotification() {
    if (window.SparkX && window.SparkX.showNotification) {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-download"></i>
                <span>New version available!</span>
                <button class="update-btn" onclick="updateApp()">Update</button>
                <button class="dismiss-btn" onclick="dismissUpdate()">&times;</button>
            </div>
        `;
        
        // Add styles
        if (!document.querySelector('#update-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'update-notification-styles';
            style.textContent = `
                .update-notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--primary-blue);
                    color: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    z-index: 10001;
                    animation: slideInUp 0.3s ease-out;
                }
                .update-content {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    gap: 1rem;
                }
                .update-btn {
                    background: var(--accent-orange);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-weight: 600;
                }
                .dismiss-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                }
                @keyframes slideInUp {
                    from { transform: translateX(-50%) translateY(100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
    }
}

// Show offline ready notification
function showOfflineReadyNotification() {
    if (window.SparkX && window.SparkX.showNotification) {
        window.SparkX.showNotification('App is ready for offline use!', 'success');
    }
}

// Update app
function updateApp() {
    navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
            registration.waiting.postMessage({ action: 'skipWaiting' });
        }
    });
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}

// Dismiss update notification
function dismissUpdate() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        notification.remove();
    }
}

// Check for updates periodically
setInterval(() => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.update();
        });
    }
}, 60000); // Check every minute

// Handle online/offline status
function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    console.log('Connection status:', status);
    
    if (window.SparkX && window.SparkX.showNotification) {
        if (navigator.onLine) {
            window.SparkX.showNotification('Back online!', 'success');
        } else {
            window.SparkX.showNotification('You are offline. Some features may be limited.', 'warning');
        }
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt triggered');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button
    showInstallPrompt();
});

function showInstallPrompt() {
    // Create install prompt
    const installPrompt = document.createElement('div');
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
        <div class="install-content">
            <i class="fas fa-mobile-alt"></i>
            <div class="install-text">
                <h4>Install Spark-X Platforms</h4>
                <p>Get the full app experience!</p>
            </div>
            <button class="install-btn" onclick="installPWA()">Install</button>
            <button class="install-dismiss" onclick="dismissInstall()">&times;</button>
        </div>
    `;
    
    // Add styles
    if (!document.querySelector('#install-prompt-styles')) {
        const style = document.createElement('style');
        style.id = 'install-prompt-styles';
        style.textContent = `
            .install-prompt {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                z-index: 10002;
                animation: slideInDown 0.3s ease-out;
                border: 2px solid var(--accent-orange);
            }
            .install-content {
                display: flex;
                align-items: center;
                padding: 1.5rem;
                gap: 1rem;
            }
            .install-content i {
                font-size: 2rem;
                color: var(--accent-orange);
            }
            .install-text h4 {
                margin: 0 0 0.25rem 0;
                color: var(--gray-800);
            }
            .install-text p {
                margin: 0;
                color: var(--gray-600);
                font-size: 0.9rem;
            }
            .install-btn {
                background: var(--accent-orange);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                margin-left: auto;
            }
            .install-dismiss {
                background: none;
                border: none;
                color: var(--gray-500);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
            }
            @keyframes slideInDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(installPrompt);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (installPrompt.parentNode) {
            installPrompt.remove();
        }
    }, 10000);
}

// Install PWA
async function installPWA() {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // Clear the deferredPrompt
        deferredPrompt = null;
        
        // Remove install prompt
        const installPrompt = document.querySelector('.install-prompt');
        if (installPrompt) {
            installPrompt.remove();
        }
        
        if (outcome === 'accepted' && window.SparkX && window.SparkX.showNotification) {
            window.SparkX.showNotification('Thanks for installing Spark-X Platforms!', 'success');
        }
    }
}

// Dismiss install prompt
function dismissInstall() {
    const installPrompt = document.querySelector('.install-prompt');
    if (installPrompt) {
        installPrompt.remove();
    }
}

// Handle app installed
window.addEventListener('appinstalled', (evt) => {
    console.log('Spark-X Platforms was installed');
    if (window.SparkX && window.SparkX.showNotification) {
        window.SparkX.showNotification('App installed successfully!', 'success');
    }
});

// Export for global access
window.PWAManager = {
    updateApp,
    dismissUpdate,
    installPWA,
    dismissInstall
};
