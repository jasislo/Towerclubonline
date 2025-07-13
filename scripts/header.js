// Create different headers for different pages
const isOnboardingPage = window.location.pathname.includes('onboarding.html');
const isLandingPage = window.location.pathname.includes('index.html');

const landingHeader = `
<nav class="main-nav">
    <div class="nav-content">
        <!-- Brand Section -->
        <div style="display: flex; align-items: center;">
            <a href="/pages/index.html" class="nav-brand">
                <img src="../assets/images/towerclub_logo.png" alt="TowerClub Logo">
                <span class="brand-name">TowerClub</span>
            </a>
            <div id="google_translate_element" style="display:inline-block; vertical-align:middle; margin-left:10px;"></div>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links">
            <a href="#features" class="nav-link">Features</a>
            <a href="#pricing" class="nav-link">Pricing</a>
            <a href="#about" class="nav-link">About</a>
        </div>

        <!-- Navigation Actions -->
        <div class="nav-actions">
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="pay.html" class="btn btn-primary">Get Started</a>
        </div>
    </div>
</nav>
`;

const regularHeader = `
<nav class="main-nav">
    <div class="nav-content">
        <!-- Brand Section -->
        <a href="/pages/mainpage.html" class="nav-brand">
            <img src="../assets/images/towerclub_logo.png" alt="TowerClub Logo">
            <span class="brand-name">TowerClub</span>
        </a>
        <div id="google_translate_element" style="display:inline-block; margin-left:15px;"></div>

        <!-- Navigation Links -->
        <div class="nav-links">
            <a href="/pages/dashboard.html" class="nav-link">Dashboard</a>
            <a href="/pages/my_card.html" class="nav-link">Wallet</a>
            <a href="/pages/add-transaction.html" class="nav-link">Transfer</a>
            <a href="/pages/activities.html" class="nav-link">Activities</a>
            <a href="/pages/settings.html" class="nav-link">Settings</a>
        </div>

        <!-- Navigation Actions -->
        <div class="nav-actions">
            <!-- Profile Picture -->
            <div class="profile-picture-container">
                <img id="profilePicture" src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/finance-app-sample-kugwu4/assets/ijvuhvqbvns6/uiAvatar@2x.png" alt="Profile Picture" class="profile-picture">
                <input type="file" id="profilePictureInput" accept="image/*" style="display: none;">
            </div>
            <!-- Log Out Button -->
            <button id="logoutButton" class="btn-outline">Log out</button>
        </div>
    </div>
</nav>
`;

const onboardingHeader = `
<nav class="main-nav">
    <div class="nav-content">
        <!-- Brand Section -->
        <a href="/pages/mainpage.html" class="nav-brand">
            <img src="../assets/images/towerclub_logo.png" alt="TowerClub Logo">
            <span class="brand-name">TowerClub</span>
        </a>
        <div id="google_translate_element" style="display:inline-block; margin-left:15px;"></div>
    </div>
</nav>
`;

// Choose the appropriate header
const header = isLandingPage ? landingHeader : 
               isOnboardingPage ? onboardingHeader : 
               regularHeader;

// Append the header to the body or a specific container
document.body.insertAdjacentHTML('afterbegin', header);

// Add functionality for the profile picture upload only on pages that have it
const profilePicture = document.getElementById('profilePicture');
const profilePictureInput = document.getElementById('profilePictureInput');

if (profilePicture && profilePictureInput && !isOnboardingPage) {
    // Make the profile picture clickable
    profilePicture.addEventListener('click', () => {
        profilePictureInput.click();
    });
}

// Handle the file input change event
profilePictureInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicture.src = e.target.result; // Update the profile picture preview
        };
        reader.readAsDataURL(file);
    }
});

// Add functionality for navigation links
document.querySelector('.nav-brand').addEventListener('click', () => {
    window.location.href = '/pages/mainpage.html';
});

// Log Out Button Functionality
function handleLogout() {
    try {
        // Clear all session and local storage data
        const keysToRemove = [
            'memberProfile',
            'profilePicture',
            'paymentMethod',
            'cardDetails',
            'selectedPlan',
            'selectedLanguage',
            'authToken',
            'userSession',
            'lastLogin',
            'preferences',
            'userName',
            'userUsername',
            'userEmail',
            'darkMode'
        ];

        // Remove specific keys
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });

        // Clear any cookies
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Redirect to login page
        window.location.href = '/pages/login.html';
    } catch (error) {
        console.error('Error during logout:', error);
        // Still redirect even if there's an error
        window.location.href = '/pages/login.html';
    }
}

// Add click event listener to logout button after header is inserted
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Utility: Update all profile picture elements on the page
function updateAllProfilePictures(src) {
    // Add all possible profile picture element IDs here
    const picIds = ['profilePicture', 'profileImage', 'profileImg'];
    picIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.src = src;
    });
}

// On page load, sync profile pictures from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedPic = localStorage.getItem('profilePicture');
    if (savedPic) {
        updateAllProfilePictures(savedPic);
    }
});

// Handle profile picture upload and sync everywhere
profilePictureInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            // Save to localStorage
            localStorage.setItem('profilePicture', dataUrl);
            // Update all profile pictures immediately
            updateAllProfilePictures(dataUrl);
        };
        reader.readAsDataURL(file);
    }
});

// Initialize Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar,zh-CN,es,fr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

// Add Google Translate script
const googleTranslateScript = document.createElement('script');
googleTranslateScript.type = 'text/javascript';
googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(googleTranslateScript);