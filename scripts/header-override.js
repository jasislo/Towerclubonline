// Header Override - Includes navigation but prevents redirects to login
console.log('Loading header override - preventing login redirects but keeping navigation');

// Create regular header HTML
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
            <div class="profile-picture-container" id="profilePictureContainer">
                <img id="profilePicture" src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/finance-app-sample-kugwu4/assets/ijvuhvqbvns6/uiAvatar@2x.png" alt="Profile Picture" class="profile-picture">
                <input type="file" id="profilePictureInput" accept="image/*" style="display: none;">
            </div>
            <!-- Log Out Button -->
            <button id="logoutButton" class="btn-outline">Log out</button>
        </div>
    </div>
</nav>
`;

// Append the header to the body or a specific container
document.addEventListener('DOMContentLoaded', function() {
    // Insert the header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', regularHeader);
    
    // Override logout functions to handle real logout now
    window.logout = function() {
        console.log('Logging out - redirecting to login page');
        // Clear any session data
        if (typeof SessionManager !== 'undefined' && SessionManager.clearSession) {
            SessionManager.clearSession();
        }
        // Redirect to login page
        window.location.href = '/pages/login.html';
        return true;
    };
    
    // Set fake user data for display purposes
    window.currentUser = window.currentUser || {
        name: 'Preview User',
        avatar: '../assets/images/default-avatar.png',
        email: 'preview@example.com'
    };
    
    // Add functionality for the profile picture upload
    const profilePicture = document.getElementById('profilePicture');
    const profilePictureInput = document.getElementById('profilePictureInput');

    if (profilePicture && profilePictureInput) {
        // Make the profile picture clickable
        profilePicture.addEventListener('click', () => {
            profilePictureInput.click();
        });
        
        // Handle the file input change event
        profilePictureInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicture.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Set up logout button to redirect to login.html
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logout clicked - redirecting to login page');
            if (confirm('Are you sure you want to log out?')) {
                // Clear any session data
                if (typeof SessionManager !== 'undefined' && SessionManager.clearSession) {
                    SessionManager.clearSession();
                }
                // Redirect to login page
                window.location.href = '/pages/login.html';
            }
        });
    }
    
    console.log('Header has been added with navigation bar but without redirect functionality');
});
