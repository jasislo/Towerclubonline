class ReferralBonusProgram {
    constructor() {
        this.levelBonuses = {
            'Standard': { multiplier: 1, baseReward: 10 },
            'VIP': { multiplier: 1.2, baseReward: 15 },
            'Silver': { multiplier: 1.5, baseReward: 20 },
            'Gold': { multiplier: 2, baseReward: 25 },
            'Platinum': { multiplier: 3, baseReward: 30 }
        };
    }

    calculateBonus(referrer, referredUser) {
        const baseStats = this.getReferrerStats(referrer);
        const level = this.determineLevel(baseStats.totalReferrals);
        const bonus = this.computeBonus(level, baseStats);
        
        return {
            immediateBonus: bonus.immediate,
            recurringBonus: bonus.recurring,
            level: level
        };
    }

    computeBonus(level, stats) {
        const levelData = this.levelBonuses[level];
        const baseReward = levelData.baseReward;
        const multiplier = levelData.multiplier;

        // Immediate signup bonus
        const immediateBonus = baseReward * multiplier;

        // Recurring bonus based on referral activity
        const recurringBonus = Math.floor(stats.activeReferrals / 10) * 5 * multiplier;

        // Additional bonuses for milestones
        const milestoneBonuses = this.calculateMilestoneBonuses(stats.totalReferrals);

        return {
            immediate: immediateBonus + milestoneBonuses,
            recurring: recurringBonus
        };
    }

    calculateMilestoneBonuses(totalReferrals) {
        let bonus = 0;
        const milestones = [
            { count: 10, reward: 50 },
            { count: 50, reward: 100 },
            { count: 100, reward: 200 },
            { count: 500, reward: 500 },
            { count: 1000, reward: 1000 }
        ];

        milestones.forEach(milestone => {
            if (totalReferrals >= milestone.count) {
                bonus += milestone.reward;
            }
        });

        return bonus;
    }

    getReferrerStats(referrer) {
        const stats = JSON.parse(localStorage.getItem('referralStats') || '{}');
        return stats[referrer] || {
            totalReferrals: 0,
            activeReferrals: 0,
            totalRewards: 0
        };
    }

    determineLevel(referralCount) {
        if (referralCount >= 50000) return 'Platinum';
        if (referralCount >= 10000) return 'Gold';
        if (referralCount >= 1000) return 'Silver';
        if (referralCount >= 100) return 'VIP';
        return 'Standard';
    }

    updateReferralStats(referrer, bonus) {
        const stats = this.getReferrerStats(referrer);
        stats.totalReferrals++;
        stats.activeReferrals++;
        stats.totalRewards += bonus.immediateBonus;
        
        const allStats = JSON.parse(localStorage.getItem('referralStats') || '{}');
        allStats[referrer] = stats;
        localStorage.setItem('referralStats', JSON.stringify(allStats));
    }
}