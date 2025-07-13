// Session Management Module
export class SessionManager {
    static init() {
        // Initialize session checking
        if (!this.isLoggedIn()) {
            // If not on login page, redirect to login
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/pages/login.html';
            }
            return false;
        }
        return true;
    }

    static isLoggedIn() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const membershipData = localStorage.getItem('membershipData');
        
        // Validate token format (basic check)
        const isValidToken = token && token.length > 32;
        
        return isValidToken && userId && membershipData;
    }

    static setSessionData(data) {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.userId) localStorage.setItem('userId', data.userId);
        if (data.membershipData) localStorage.setItem('membershipData', JSON.stringify(data.membershipData));
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
