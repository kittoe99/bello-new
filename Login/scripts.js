// Toggle between Login and Sign Up forms
document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
});

// Handle Login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:y3EvLJkm/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            handleLogin(data.authToken); // Save token and redirect
        } else {
            console.error('Login failed:', response.status, data);
            alert('Login failed! Please check your credentials and try again.');
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        alert('An error occurred. Please try again later.');
    }
});

// Handle Sign Up form submission
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    
    try {
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:y3EvLJkm/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name: name, Email: email, Password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully! You can now log in.');
            document.getElementById('signup-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
        } else {
            console.error('Sign up failed:', response.status, data);
            alert('Sign up failed! Please try again.');
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        alert('An error occurred. Please try again later.');
    }
});

// Function to set the token in localStorage
function setAuthToken(token) {
    const expiryTime = new Date().getTime() + (30 * 60 * 1000); // 30 minutes from now
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiry', expiryTime);
}

// Function to get the token from localStorage
function getAuthToken() {
    const token = localStorage.getItem('authToken');
    const expiryTime = localStorage.getItem('authTokenExpiry');
    
    if (token && expiryTime) {
        const now = new Date().getTime();
        if (now < expiryTime) {
            return token;
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authTokenExpiry');
        }
    }
    return null;
}

// Function to check authentication
function checkAuthentication() {
    const token = getAuthToken();
    const loginPage = 'warm-croissant-4ed48d.netlify.app/login';
    const currentPage = window.location.href;

    if (!token && currentPage !== loginPage) {
        window.location.href = loginPage;
    }
}

// Function to handle login (this should be called after successful login)
function handleLogin(token) {
    setAuthToken(token);
    window.location.href = 'warm-croissant-4ed48d.netlify.app';
}

// Check authentication on page load
checkAuthentication();
