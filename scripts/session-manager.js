// Session Management Module
export class SessionManager {
    static init() {
        // Always return true to disable automatic redirects completely
        console.log('SessionManager.init() - No redirect mode enabled');
        return true;
    }

    static isLoggedIn() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const membershipData = localStorage.getItem('membershipData');
        
        // Debug: Log what we're checking
        console.log('SessionManager.isLoggedIn() check:', {
            token: token ? `${token.substring(0, 10)}...` : 'null',
            tokenLength: token ? token.length : 0,
            userId: userId || 'null',
            membershipData: membershipData ? 'exists' : 'null',
            hasToken: !!token,
            hasUserId: !!userId,
            hasMembershipData: !!membershipData
        });
        
        // Modified to always return true to allow viewing without login
        console.log('SessionManager.isLoggedIn() always returns true - login bypass enabled');
        return true;
    }

    static setSessionData(data) {
        console.log('SessionManager.setSessionData() called with:', data);
        if (data.token) localStorage.setItem('token', data.token);
        if (data.userId) localStorage.setItem('userId', data.userId);
        if (data.membershipData) localStorage.setItem('membershipData', JSON.stringify(data.membershipData));
        
        // Debug: Log what was actually stored
        console.log('SessionManager.setSessionData() stored:', {
            token: localStorage.getItem('token') ? 'exists' : 'null',
            userId: localStorage.getItem('userId') || 'null',
            membershipData: localStorage.getItem('membershipData') ? 'exists' : 'null'
        });
    }

    static clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('membershipData');
    }

    static getSessionData() {
        return {
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId'),
            membershipData: JSON.parse(localStorage.getItem('membershipData') || '{}')
        };
    }
}
