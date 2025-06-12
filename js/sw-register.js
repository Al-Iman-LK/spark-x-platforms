// Service Worker Registration for Spark-X Platforms PWA

// PWA Install Prompt Variables
let deferredPrompt;
let installButton;

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        registerServiceWorker();
        setupInstallPrompt();
    });
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        console.log('✅ ServiceWorker registration successful with scope: ', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 New service worker found, installing...');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // New update available
                        showUpdateNotification();
                    } else {
                        // Content is cached for offline use
                        console.log('📱 Content is cached for offline use.');
                        showOfflineReadyNotification();
                    }
                }
            });
        });
        
    } catch (error) {
        console.log('❌ ServiceWorker registration failed: ', error);
    }
}

// Setup PWA Install Prompt
function setupInstallPrompt() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('🎯 Install prompt event triggered');
        
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        
        // Save the event so it can be triggered later
        deferredPrompt = e;
        
        // Show install button
        showInstallButton();
    });
    
    // Listen for successful installation
    window.addEventListener('appinstalled', (e) => {
        console.log('🎉 PWA was installed successfully');
        hideInstallButton();
        
        // Track installation (optional analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                'method': 'prompt'
            });
        }
        
        // Show success message
        showInstallSuccessMessage();
    });
    
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 App is running in standalone mode (already installed)');
    }
}

// Install Button Management
function showInstallButton() {
    // Create install button if it doesn't exist
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.id = 'install-pwa-btn';
        installButton.className = 'install-btn';
        installButton.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Install App</span>
        `;
        installButton.addEventListener('click', installPWA);
        
        // Add CSS styles
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2563eb, #8b5cf6);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
            z-index: 1000;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transform: scale(0.8);
            animation: fadeInScale 0.3s ease forwards;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#install-button-styles')) {
            const style = document.createElement('style');
            style.id = 'install-button-styles';
            style.textContent = `
                @keyframes fadeInScale {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                #install-pwa-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 25px rgba(37, 99, 235, 0.4);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(installButton);
    }
    
    installButton.style.display = 'flex';
    console.log('📲 Install button shown');
}

function hideInstallButton() {
    if (installButton) {
        installButton.style.display = 'none';
        console.log('🔒 Install button hidden');
    }
}

// Install PWA Function
async function installPWA() {
    if (!deferredPrompt) {
        console.log('⚠️ Install prompt not available');
        return;
    }
    
    try {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`🎯 User response to install prompt: ${outcome}`);
        
        // Track user choice (optional analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install_prompt', {
                'result': outcome
            });
        }
        
        // Clear the deferred prompt
        deferredPrompt = null;
        
        if (outcome === 'accepted') {
            hideInstallButton();
        }
        
    } catch (error) {
        console.error('❌ Error during PWA installation:', error);
    }
}

// Success Message
function showInstallSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'install-success-message';
    message.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle" style="font-size: 2rem; color: #22c55e; margin-bottom: 10px;"></i>
            <h3 style="margin: 0 0 10px 0; color: white;">🎉 App Installed Successfully!</h3>
            <p style="margin: 0; color: rgba(255,255,255,0.9);">Spark-X Platforms is now available on your device</p>
        </div>
    `;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(34, 197, 94, 0.95);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        z-index: 2000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        opacity: 0;
        animation: fadeInSuccess 0.5s ease forwards;
    `;
    
    // Add success animation
    if (!document.querySelector('#success-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'success-animation-styles';
        style.textContent = `
            @keyframes fadeInSuccess {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'fadeInSuccess 0.3s ease reverse';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }
    }, 3000);
}

// Show update notification
function showUpdateNotification() {
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
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2563eb;
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideInUp 0.3s ease-out;
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        gap: 1rem;
    `;
    
    document.body.appendChild(notification);
}

// Show offline ready notification
function showOfflineReadyNotification() {
    console.log('📱 App is ready for offline use!');
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
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Manual install trigger for testing
window.triggerInstall = function() {
    if (deferredPrompt) {
        installPWA();
    } else {
        console.log('⚠️ Install prompt not available. Try refreshing the page.');
    }
};
