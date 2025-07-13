// Membership Management System
class MembershipManager {
    constructor() {
        this.membershipLevels = {
            basic: {
                name: 'Basic',
                price: 12.95,
                interval: 'monthly',
                benefits: [
                    'Build Financial social Network',
                    'Transfers between Members',
                    'Profile and Chats',
                    '7 days Free trial'
                ],
                maxTransactions: 50,
                supportPriority: 'normal',
                cardType: 'virtual',
                trial: 7 // days
            },
            vip: {
                name: 'VIP Member',
                price: 14.95,
                interval: 'monthly',
                benefits: [
                    'Advanced analytics',
                    'Build Financial social Network',
                    'Financial News updates',
                    'Crypto Currencies updates',
                    'Priority support',
                    'Transfers between Members',
                    'Profile and Chats'
                ],
                maxTransactions: Infinity,
                supportPriority: 'high',
                cardType: 'premium-virtual',
                featured: true
            },
            business: {
                name: 'Business',
                price: 'Custom',
                interval: 'monthly',
                benefits: [
                    'All Pro features',
                    'Team management',
                    'Dedicated support'
                ],
                maxTransactions: Infinity,
                supportPriority: 'highest',
                cardType: 'metal',
                customPricing: true
            }
        };

        // Promotional rates and discounts
        this.promotions = {
            annual: {
                discount: 0.2, // 20% off for annual subscription
                minimumTerm: 12 // months
            },
            referral: {
                discount: 0.1, // 10% off for referred users
                duration: 3 // months
            }
        };

        // Define feature access permissions
        this.featureAccess = {
            cryptocurrency: ['vip', 'business'],
            bitcoin: ['vip', 'business'],
            analytics: ['vip', 'business'],
            financialNews: ['vip', 'business'],
            basicFeatures: ['basic', 'vip', 'business']
        };
    }

    // Get membership level details
    getMembershipLevel(level) {
        return this.membershipLevels[level.toLowerCase()];
    }

    // Calculate price with promotions
    calculatePrice(level, term = 'monthly', referralCode = null) {
        const membership = this.getMembershipLevel(level);
        if (!membership) return null;

        let price = membership.price;
        
        // Apply annual discount
        if (term === 'annual') {
            price = price * 12 * (1 - this.promotions.annual.discount);
        }

        // Apply referral discount if valid
        if (referralCode && this.validateReferralCode(referralCode)) {
            price = price * (1 - this.promotions.referral.discount);
        }

        return parseFloat(price.toFixed(2));
    }

    // Validate referral code
    validateReferralCode(code) {
        // Basic validation - should be integrated with your referral system
        return code && code.startsWith('#') && code.length >= 4;
    }

    // Check if user can upgrade
    canUpgrade(currentLevel, targetLevel) {
        const levels = ['basic', 'premium', 'enterprise'];
        const currentIndex = levels.indexOf(currentLevel.toLowerCase());
        const targetIndex = levels.indexOf(targetLevel.toLowerCase());
        
        return targetIndex > currentIndex;
    }

    // Get available upgrades for current level
    getAvailableUpgrades(currentLevel) {
        return Object.keys(this.membershipLevels).filter(level => 
            this.canUpgrade(currentLevel, level)
        ).map(level => this.membershipLevels[level]);
    }

    // Compare benefits between levels
    compareLevels(level1, level2) {
        const membership1 = this.getMembershipLevel(level1);
        const membership2 = this.getMembershipLevel(level2);
        
        if (!membership1 || !membership2) return null;

        return {
            priceDifference: membership2.price - membership1.price,
            additionalBenefits: membership2.benefits.filter(
                benefit => !membership1.benefits.includes(benefit)
            ),
            improvedFeatures: {
                transactions: membership2.maxTransactions > membership1.maxTransactions,
                support: membership2.supportPriority > membership1.supportPriority,
                cardUpgrade: membership2.cardType !== membership1.cardType
            }
        };
    }

    // Check if user has reached transaction limit
    hasReachedTransactionLimit(level, currentTransactions) {
        const membership = this.getMembershipLevel(level);
        return currentTransactions >= membership.maxTransactions;
    }

    // Get membership card type
    getCardType(level) {
        const membership = this.getMembershipLevel(level);
        return membership ? membership.cardType : null;
    }

    // Save membership details to storage
    saveMembershipDetails(userId, level, startDate, term = 'monthly') {
        const membershipDetails = {
            userId,
            level,
            startDate,
            term,
            price: this.calculatePrice(level, term),
            expiryDate: this.calculateExpiryDate(startDate, term),
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage for demo/development
        localStorage.setItem(`membership_${userId}`, JSON.stringify(membershipDetails));
        
        // In production, you would save to your backend:
        // await this.saveMembershipToBackend(membershipDetails);
        
        return membershipDetails;
    }

    // Calculate expiry date based on term
    calculateExpiryDate(startDate, term) {
        const date = new Date(startDate);
        if (term === 'annual') {
            date.setFullYear(date.getFullYear() + 1);
        } else {
            date.setMonth(date.getMonth() + 1);
        }
        return date.toISOString();
    }

    // Check if membership is active
    isActive(userId) {
        const membership = JSON.parse(localStorage.getItem(`membership_${userId}`));
        if (!membership) return false;

        const now = new Date();
        const expiryDate = new Date(membership.expiryDate);
        return now < expiryDate;
    }

    // Get remaining days in current membership
    getRemainingDays(userId) {
        const membership = JSON.parse(localStorage.getItem(`membership_${userId}`));
        if (!membership) return 0;

        const now = new Date();
        const expiryDate = new Date(membership.expiryDate);
        const diffTime = Math.abs(expiryDate - now);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Initialize membership selection UI
    initializeMembershipUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        Object.entries(this.membershipLevels).forEach(([key, level]) => {
            const membershipCard = document.createElement('div');
            membershipCard.className = 'membership-card';
            membershipCard.innerHTML = `
                <h3>${level.name}</h3>
                <div class="price">$${level.price}/month</div>
                <ul class="benefits">
                    ${level.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
                <button class="select-plan" data-plan="${key}">
                    Select ${level.name}
                </button>
            `;
            container.appendChild(membershipCard);
        });

        // Add event listeners for plan selection
        container.querySelectorAll('.select-plan').forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedPlan = e.target.dataset.plan;
                const membership = this.getMembershipLevel(selectedPlan);
                
                // Store selection
                sessionStorage.setItem('selectedPlan', selectedPlan);
                sessionStorage.setItem('selectedPlanAmount', membership.price);
                
                // Redirect to payment page
                window.location.href = 'PAY.HTML';
            });
        });
    }

    // Check if user has access to a specific feature
    canAccessFeature(userId, feature) {
        const membership = JSON.parse(localStorage.getItem(`membership_${userId}`));
        if (!membership || !this.isActive(userId)) return false;

        const allowedLevels = this.featureAccess[feature] || [];
        return allowedLevels.includes(membership.level);
    }

    // Get all accessible features for a membership level
    getAccessibleFeatures(level) {
        const accessibleFeatures = [];
        for (const [feature, allowedLevels] of Object.entries(this.featureAccess)) {
            if (allowedLevels.includes(level)) {
                accessibleFeatures.push(feature);
            }
        }
        return accessibleFeatures;
    }

    // Check if user can access cryptocurrency features
    canAccessCrypto(userId) {
        return this.canAccessFeature(userId, 'cryptocurrency');
    }

    // Check if user can access bitcoin features
    canAccessBitcoin(userId) {
        return this.canAccessFeature(userId, 'bitcoin');
    }

    // Redirect user if feature is not accessible
    async checkFeatureAccess(userId, feature, redirectUrl = '/pages/upgrade.html') {
        if (!this.canAccessFeature(userId, feature)) {
            // Show upgrade modal or alert
            const membership = this.getMembershipLevel('vip');
            const shouldUpgrade = confirm(
                `This feature is only available for ${membership.name} and above plans. Would you like to upgrade your membership?`
            );
            
            if (shouldUpgrade) {
                window.location.href = redirectUrl;
                return false;
            }
            return false;
        }
        return true;
    }

    // Example usage in your crypto/bitcoin pages:
    /*
    document.addEventListener('DOMContentLoaded', async () => {
        const userId = localStorage.getItem('userId'); // Get current user ID
        const hasAccess = await membershipManager.checkFeatureAccess(userId, 'cryptocurrency');
        if (!hasAccess) {
            // Either user clicked "Cancel" on upgrade prompt, or there was an error
            window.location.href = 'dashboard.html'; // Redirect to safe page
            return;
        }
        // Continue loading cryptocurrency features...
    });
    */
}

// Export the membership manager
export const membershipManager = new MembershipManager();

// Example usage:
/*
import { membershipManager } from './membership-manager.js';

// Initialize membership UI
membershipManager.initializeMembershipUI('membership-plans');

// Calculate price with annual discount
const annualPrice = membershipManager.calculatePrice('premium', 'annual');

// Check if user can upgrade
const canUpgrade = membershipManager.canUpgrade('basic', 'premium');

// Compare levels
const comparison = membershipManager.compareLevels('basic', 'premium');

// Save membership
const membership = membershipManager.saveMembershipDetails('user123', 'premium', new Date());

// Check if active
const isActive = membershipManager.isActive('user123');

// Get remaining days
const daysLeft = membershipManager.getRemainingDays('user123');
*/
