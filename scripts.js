// Function to set the token with an expiry time in localStorage
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

// Function to check authentication on page load
function checkAuthentication() {
    const token = getAuthToken();
    const loginPage = 'https://bello-moving-test.netlify.app/login.html';
    const currentPage = window.location.href;

    if (!token && currentPage !== loginPage) {
        window.location.href = loginPage;
    }
}

// Function to handle login (this should be called after successful login)
function handleLogin(token) {
    setAuthToken(token);
    window.location.href = 'https://bello-moving-test.netlify.app'; // Redirect to home page or dashboard
}

// Function to handle sign-up process
async function handleSignUp(name, email, password) {
    try {
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:y3EvLJkm/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully! Please log in.');
            window.location.href = 'https://bello-moving-test.netlify.app/login'; // Redirect to login page
        } else {
            console.error('Sign-up failed:', response.status, data);
            alert('Sign-up failed! Please try again.');
        }
    } catch (error) {
        console.error('Error during sign-up fetch:', error);
        alert('An error occurred during sign-up. Please try again later.');
    }
}

// Call checkAuthentication on page load
checkAuthentication();

// Event listener for page load
document.addEventListener("DOMContentLoaded", function() {
    openTab('Home');
    fetchNextJob();
    fetchBookings();
    initializeCalendar();
});

function openTab(tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
}

async function fetchNextJob() {
    const endpoint = "https://x8ki-letl-twmt.n7.xano.io/api:y3EvLJkm/bookings";
    const authToken = getAuthToken();
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const nextJob = data.sort((a, b) => new Date(a.Move_date) - new Date(b.Move_date))[0];
            if (nextJob) {
                document.getElementById('next-job-details').innerHTML = `
                    <div class="booking-card" data-id="${nextJob.id}">
                        <div class="booking-id">#${nextJob.id}</div>
                        <div class="booking-size"><strong>${nextJob.Move_size || "N/A"}</strong></div>
                        <div class="booking-date"><strong>${nextJob.Move_date}</strong></div>
                    </div>
                `;
            } else {
                document.getElementById('next-job-details').innerHTML = '<p>No upcoming jobs.</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
    }
}

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    $(calendarEl).fullCalendar({
        header: { left: 'prev,next today', center: 'title', right: 'month,agendaWeek,agendaDay' },
    });
}
