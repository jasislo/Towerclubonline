// Feature Access Control
import { membershipManager } from './membership-manager.js';

export function initializeFeatureAccess() {
    // Check if we're on a restricted page
    const currentPage = window.location.pathname.toLowerCase();
    const userId = localStorage.getItem('userId');

    if (!userId) {
        window.location.href = '/pages/login.html';
        return;
    }

    // Define restricted pages and their required features
    const restrictedPages = {
        '/pages/crypto.html': 'cryptocurrency',
        '/pages/bitcoin.html': 'bitcoin'
    };

    // Check if current page is restricted
    const requiredFeature = restrictedPages[currentPage];
    if (requiredFeature) {
        membershipManager.checkFeatureAccess(userId, requiredFeature).then(hasAccess => {
            if (!hasAccess) {
                // User either declined to upgrade or doesn't have access
                window.location.href = '/pages/dashboard.html';
            }
        });
    }
}

// Add feature-specific UI elements
export function updateFeatureUI() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Update cryptocurrency-related UI elements
    const cryptoElements = document.querySelectorAll('[data-feature="cryptocurrency"]');
    const hasCryptoAccess = membershipManager.canAccessCrypto(userId);
    
    cryptoElements.forEach(element => {
        if (!hasCryptoAccess) {
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
            
            // Add upgrade prompt
            const upgradePrompt = document.createElement('div');
            upgradePrompt.className = 'upgrade-prompt';
            upgradePrompt.innerHTML = `
                <p>Upgrade to VIP Member to access cryptocurrency features</p>
                <button onclick="window.location.href='/pages/upgrade.html'">Upgrade Now</button>
            `;
            element.parentNode.insertBefore(upgradePrompt, element.nextSibling);
        }
    });

    // Update bitcoin-related UI elements
    const bitcoinElements = document.querySelectorAll('[data-feature="bitcoin"]');
    const hasBitcoinAccess = membershipManager.canAccessBitcoin(userId);
    
    bitcoinElements.forEach(element => {
        if (!hasBitcoinAccess) {
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
            
            // Add upgrade prompt
            const upgradePrompt = document.createElement('div');
            upgradePrompt.className = 'upgrade-prompt';
            upgradePrompt.innerHTML = `
                <p>Upgrade to VIP Member to access Bitcoin features</p>
                <button onclick="window.location.href='/pages/upgrade.html'">Upgrade Now</button>
            `;
            element.parentNode.insertBefore(upgradePrompt, element.nextSibling);
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFeatureAccess();
    updateFeatureUI();
});
