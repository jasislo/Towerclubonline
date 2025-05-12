document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const profileImage = document.getElementById('profileImage');
    const profileImg = document.getElementById('profileImg');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Handle profile image click
    profileImage.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(profileForm);
        const profileData = {
            name: formData.get('name'),
            username: formData.get('username'),
            age: formData.get('age'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            profileImage: profileImg.src
        };

        try {
            // Here you would typically send the data to your backend
            console.log('Profile data:', profileData);
            
            // Simulate successful submission
            alert('Profile completed successfully!');
            
            // Redirect to next page (replace with your actual redirect)
            window.location.href = '/onboarding';
        } catch (error) {
            console.error('Error submitting profile:', error);
            alert('Error submitting profile. Please try again.');
        }
    });

    // Add input validation
    const inputs = profileForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });
});

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.id) {
        case 'name':
            isValid = value.length >= 2;
            errorMessage = 'Name must be at least 2 characters long';
            break;
        case 'username':
            isValid = /^[a-zA-Z0-9_]{3,20}$/.test(value);
            errorMessage = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
            break;
        case 'age':
            isValid = value >= 18 && value <= 120;
            errorMessage = 'Age must be between 18 and 120';
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
        case 'phone':
            isValid = /^\+?[\d\s-]{10,}$/.test(value);
            errorMessage = 'Please enter a valid phone number';
            break;
    }

    input.setCustomValidity(isValid ? '' : errorMessage);
}

function redirectToPicturesProfile() {
    window.location.href = 'pictures_profile.html'; // Redirect to pictures_profile.html
}