// Authentication check
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated using hybrid auth system
    if (!hybridAuth || !hybridAuth.isAuthenticated()) {
        // Redirect to landing page if not authenticated
        window.location.href = 'index.html';
        return;
    }

    // Load current user info from hybrid auth system
    const currentUser = hybridAuth.getCurrentUser();
    if (currentUser) {
        // Update user info in the account section
        updateUserInfo(currentUser);
    }

    // Initialize the app
    initializeApp().then(() => {
        console.log('App initialized successfully');
    }).catch((error) => {
        console.error('Error initializing app:', error);
    });
});

// Page elements - define variables for page sections
const homePage = document.getElementById('home-section');
const schedulePage = document.getElementById('schedule-section');
const requestPage = document.getElementById('request-section');
const accountPage = document.getElementById('account-section');
const panelBox = document.getElementById('panelOpenBox');
const panelBinBox = document.getElementById('panelBinBox');
const panelReportBox = document.getElementById('panelReportBox');
const panelContactBox = document.getElementById('panelContactBox');
const panelPickupBox = document.getElementById('panelPickupBox');

// Function to update user info display
function updateUserInfo(user) {
    console.log('Updating user info:', user);
    
    if (user) {
        // Update user display with data from auth system
        const userNameElement = document.getElementById('user-name');
        const displayNameElement = document.getElementById('display-name');
        
        if (userNameElement) {
            userNameElement.textContent = `${user.firstname} ${user.lastname}` || 'User';
        }
        
        if (displayNameElement) {
            displayNameElement.textContent = `${user.firstname} ${user.lastname}` || 'User';
        }
        
        // Update phone display
        const displayPhoneElement = document.getElementById('display-phone');
        if (displayPhoneElement && user.phone) {
            displayPhoneElement.textContent = user.phone;
        }
        
        // Update profile photo if available
        if (user.profilePhoto) {
            const displayPhotoElement = document.getElementById('display-photo');
            const editPhotoElement = document.getElementById('edit-photo');
            
            if (displayPhotoElement) {
                displayPhotoElement.src = user.profilePhoto;
            }
            if (editPhotoElement) {
                editPhotoElement.src = user.profilePhoto;
            }
        }
        
        // Show admin navigation link for admin users
        // console.log('Checking admin status:', user.is_admin);
        // if (user.is_admin) {
        //     console.log('User is admin, showing admin controls');
        //     const adminNavLink = document.getElementById('admin-nav-link');
        //     if (adminNavLink) {
        //         adminNavLink.style.display = 'flex';
        //         console.log('Admin nav link displayed');
        //     } else {
        //         console.log('Admin nav link element not found');
        //     }
        // } else {
        //     console.log('User is not admin');
        // }
    }
}

// Logout function
function logout() {
    console.log('Logout requested');
    showLogoutModal();
}

// Show custom logout modal
function showLogoutModal() {
    console.log('showLogoutModal called');
    const modalOverlay = document.getElementById('logout-modal-overlay');
    console.log('Modal overlay element:', modalOverlay);
    
    if (modalOverlay) {
        console.log('Adding show class to modal');
        modalOverlay.classList.add('show');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeLogoutModal();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', handleEscapeKey);
        
        console.log('Modal should now be visible with classes:', modalOverlay.classList.toString());
    } else {
        console.error('logout-modal-overlay element not found!');
    }
}

// Close logout modal
function closeLogoutModal() {
    const modalOverlay = document.getElementById('logout-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('show');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Handle escape key press
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeLogoutModal();
    }
}

// Confirm logout action
function confirmLogout() {
    console.log('Logout confirmed');
    
    // Close modal first
    closeLogoutModal();
    
    // Add a small delay for smooth transition
    setTimeout(() => {
        // Use hybrid auth system logout
        if (typeof hybridAuth !== 'undefined') {
            hybridAuth.logout();
        } else {
            // Fallback logout
            localStorage.clear();
            window.location.href = 'index.html';
        }
    }, 300);
}



// Setup navigation with authentication context
// function setupNavigation() {
//     // Add logout button to account section if it doesn't exist
//     const accountSection = document.querySelector('.user-profile');
//     if (accountSection && !document.querySelector('.logout-btn')) {
//         const logoutBtn = document.createElement('button');
//         logoutBtn.className = 'logout-btn btn-logout';
//         logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
//         logoutBtn.onclick = logout;
        
//         // Add logout button styles
//         logoutBtn.style.cssText = `
//             margin-top: 1rem;
//             padding: 0.75rem 1.5rem;
//             background: linear-gradient(135deg, #ff6b6b, #ee5a52);
//             color: white;
//             border: none;
//             border-radius: 20px;
//             font-family: Poppins, sans-serif;
//             font-size: 14px;
//             font-weight: bold;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
//             position: relative;
//             overflow: hidden;
//         `;
        
//         accountSection.appendChild(logoutBtn);
        
//         // Add hover effects
//         logoutBtn.addEventListener('mouseenter', () => {
//             logoutBtn.style.transform = 'translateY(-2px)';
//             logoutBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
//         });
        
//         logoutBtn.addEventListener('mouseleave', () => {
//             logoutBtn.style.transform = 'translateY(0)';
//             logoutBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
//         });
//     }
// }

// active menu click code 
const activeMenuLinks = document.querySelectorAll(".link-menu");
activeMenuLinks.forEach(activeMenuLink => {
    activeMenuLink.addEventListener('click', () =>{
        document.querySelector(".active")?.classList.remove("active");
        activeMenuLink.classList.add("active");
    })
})

// loading page timeout function
setTimeout(() => {
    const loadPage = document.getElementById("show-Loading");
    if (loadPage) {
        loadPage.style.display = "none";
    }
}, 3000);

// function for schedule page show
function openSchedule(){
    schedulePage.classList.add("pageShowSection");
    homePage.classList.remove("pageShowSection");
    accountPage.classList.remove("pageShowSection");
    requestPage.classList.remove("pageShowSection");
    panelBox.classList.remove("panelOpenBoxShow");
    
    // Update active navigation tab
    document.querySelector(".active")?.classList.remove("active");
    const scheduleLink = document.querySelector('a[onclick="openSchedule()"]');
    if (scheduleLink) {
        scheduleLink.classList.add("active");
    }
    
    // Save current page state
    saveCurrentPage('schedule');
}

// function for home page show
function openHome(){
    schedulePage.classList.remove("pageShowSection");
    accountPage.classList.remove("pageShowSection");
    requestPage.classList.remove("pageShowSection");
    panelBox.classList.remove("panelOpenBoxShow");
    
    // Ensure home page is visible (it's the default visible page)
    if (homePage) {
        homePage.classList.add("pageShowSection");
    }
    
    // Update active navigation tab
    document.querySelector(".active")?.classList.remove("active");
    const homeLink = document.querySelector('a[onclick="openHome()"]');
    if (homeLink) {
        homeLink.classList.add("active");
    }
    
    // Save current page state
    saveCurrentPage('home');
}

// function for request page show
function openRequest(){
    requestPage.classList.add("pageShowSection");
    schedulePage.classList.remove("pageShowSection");
    homePage.classList.remove("pageShowSection");
    accountPage.classList.remove("pageShowSection");
    panelBox.classList.remove("panelOpenBoxShow");
    
    // Update active navigation tab
    document.querySelector(".active")?.classList.remove("active");
    const requestLink = document.querySelector('a[onclick="openRequest()"]');
    if (requestLink) {
        requestLink.classList.add("active");
    }
    
    // Save current page state
    saveCurrentPage('request');
    
    // Load both current requests and all requests
    loadUserRequests();
    loadAllRequests();
}

// function for account page show
function openAccount(){
    accountPage.classList.add("pageShowSection");
    requestPage.classList.remove("pageShowSection");
    schedulePage.classList.remove("pageShowSection");
    homePage.classList.remove("pageShowSection");
    
    // Update active navigation tab
    document.querySelector(".active")?.classList.remove("active");
    const accountLink = document.querySelector('a[onclick="openAccount()"]');
    if (accountLink) {
        accountLink.classList.add("active");
    }
    
    // Save current page state
    saveCurrentPage('account');
}

// function to open each frequent action card on home dashboard
function openPaymentPanel(){
    panelBox.classList.add("panelOpenBoxShow");
    homePage.classList.remove("pageShowSection");
}

// function to close closePanelBox()
function closePanelPayBox(){
    panelBox.classList.remove("panelOpenBoxShow");
    
    // Restore the last active page instead of always going to home
    restoreLastActivePage();
}

// function for open new bin
function openBinPanel(){
    panelBinBox.classList.add("panelOpenBoxShow");
    homePage.classList.remove("pageShowSection");    
}

// function to close closePanel bin Box()
function closePanelBinBox(){
    panelBinBox.classList.remove("panelOpenBoxShow");
    
    // Restore the last active page instead of always going to home
    restoreLastActivePage();
}

// // function for open report
function openReportPanel(){
    panelReportBox.classList.add("panelOpenBoxShow");
    homePage.classList.remove("pageShowSection");    
}

// // function to close closePanel report Box()
function closePanelReportBox(){
    panelReportBox.classList.remove("panelOpenBoxShow");
    
    // Restore the last active page instead of always going to home
    restoreLastActivePage();
}

// // function for open contact
function openContactPanel(){
    panelContactBox .classList.add("panelOpenBoxShow");
    homePage.classList.remove("pageShowSection");    
}

// // function to close closePanel contact Box()
function closePanelContactBox(){
    panelContactBox .classList.remove("panelOpenBoxShow");
    
    // Restore the last active page instead of always going to home
    restoreLastActivePage();
}

// function for closePanelScheduletBox()
function closePanelScheduletBox(){
    schedulePage.classList.remove("pageShowSection");
}

// function closePanelRequestBox() 
function closePanelRequestBox(){
    requestPage.classList.remove("pageShowSection");
}

// function for closePanelAccount box
function closePanelAccountBox(){
    accountPage.classList.remove("pageShowSection");
}

// function for open PanelPickupBox()
function openPickupWaste(){
    panelPickupBox.classList.add("pageShowSection");
}

// function to closePanelPickupBox()
 function closePanelPickupBox(){
    panelPickupBox.classList.remove("pageShowSection");
}

// Profile management using SQLite API
async function saveUserProfile(profileData) {
    try {
        if (!hybridAuth || !hybridAuth.isAuthenticated()) {
            showErrorMessage('Please log in to update your profile.');
            return;
        }

        const response = await hybridAuth.updateProfile(profileData);
        console.log('Profile saved successfully');
        showSuccessMessage('Profile updated successfully!');
        loadUserProfile();
        toggleEditMode(); // Close edit mode
        
    } catch (error) {
        console.error('Error saving profile:', error);
        showErrorMessage('Error saving profile. Please try again.');
    }
}

// Load user profile from SQLite API
async function loadUserProfile() {
    try {
        if (!hybridAuth || !hybridAuth.isAuthenticated()) {
            console.log('User not authenticated, skipping profile load');
            return;
        }

        const user = hybridAuth.getCurrentUser();
        if (user) {
            updateProfileDisplay(user);
        }
        
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update profile display elements
// function updateProfileDisplay(profile) {
//     const displayName = document.getElementById('display-name');
//     const displayPhone = document.getElementById('display-phone');
//     const displayEmail = document.getElementById('display-email');
//     const displayPhoto = document.getElementById('display-photo');
//     const editPhoto = document.getElementById('edit-photo');
    
//     if (displayName) {
//         displayName.textContent = `${profile.firstname || 'User'} ${profile.lastname || ''}`.trim();
//     }
    
//     if (displayPhone) {
//         displayPhone.textContent = profile.phone || '+233 000 000 000';
//     }
    
//     if (displayEmail) {
//         displayEmail.textContent = profile.email || 'user@example.com';
//     }
    
//     if (profile.profile_photo) {
//         if (displayPhoto) {
//             displayPhoto.src = profile.profile_photo;
//         }
//         if (editPhoto) {
//             editPhoto.src = profile.profile_photo;
//         }
//     }
// }

// Toggle between view and edit mode
// function toggleEditMode() {
//     const displayMode = document.getElementById('profile-display');
//     const editMode = document.getElementById('profile-edit');
    
//     if (!displayMode || !editMode) {
//         console.log('Profile display elements not found');
//         return;
//     }
    
//     if (editMode.style.display === 'none') {
//         // Switch to edit mode
//         displayMode.style.display = 'none';
//         editMode.style.display = 'block';
//         populateEditForm();
//     } else {
//         // Switch to display mode
//         editMode.style.display = 'none';
//         displayMode.style.display = 'flex';
//     }
// }

// Cancel edit mode
// function cancelEdit() {
//     toggleEditMode();
// }

// Populate edit form with current data
// function populateEditForm() {
//     try {
//         if (!hybridAuth || !hybridAuth.isAuthenticated()) {
//             console.log('User not authenticated, cannot populate form');
//             return;
//         }

//         const user = hybridAuth.getCurrentUser();
//         if (user) {
//             const editName = document.getElementById('edit-name');
//             const editPhone = document.getElementById('edit-phone');
//             const editEmail = document.getElementById('edit-email');
//             const editAddress = document.getElementById('edit-address');
//             const editPhoto = document.getElementById('edit-photo');
            
//             if (editName) editName.value = `${user.firstname || ''} ${user.lastname || ''}`.trim();
//             if (editPhone) editPhone.value = user.phone || '';
//             if (editEmail) editEmail.value = user.email || '';
//             if (editAddress) editAddress.value = user.address || '';
            
//             if (user.profile_photo && editPhoto) {
//                 editPhoto.src = user.profile_photo;
//             }
//         }
//     } catch (error) {
//         console.error('Error populating edit form:', error);
//     }
// }

// Handle photo upload
// function handlePhotoUpload() {
//     const photoInput = document.getElementById('photo-input');
//     if (!photoInput) {
//         console.log('Photo input element not found, skipping photo upload setup');
//         return;
//     }
    
//     photoInput.addEventListener('change', function(event) {
//         const file = event.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) { // 5MB limit
//                 showErrorMessage('Photo size must be less than 5MB');
//                 return;
//             }
            
//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 const photoData = e.target.result;
//                 const editPhoto = document.getElementById('edit-photo');
//                 if (editPhoto) {
//                     editPhoto.src = photoData;
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     });
// }

// Show success message
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-success';
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4CAF50, #66BB6A);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        font-family: Poppins, sans-serif;
        font-weight: 600;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-error';
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f44336, #ff6b6b);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
        z-index: 10000;
        font-family: Poppins, sans-serif;
        font-weight: 600;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// Save current page to localStorage
function saveCurrentPage(pageName) {
    try {
        localStorage.setItem('currentPage', pageName);
        console.log('Saved current page:', pageName);
    } catch (error) {
        console.error('Error saving current page:', error);
    }
}

// Restore last active page from localStorage
function restoreLastActivePage() {
    try {
        const lastPage = localStorage.getItem('currentPage');
        console.log('Restoring last page:', lastPage);
        
        if (lastPage) {
            switch (lastPage) {
                case 'schedule':
                    openSchedule();
                    break;
                case 'request':
                    openRequest();
                    break;
                case 'account':
                    openAccount();
                    break;
                case 'home':
                default:
                    openHome();
                    break;
            }
        } else {
            // Default to home page if no saved page
            openHome();
        }
    } catch (error) {
        console.error('Error restoring last page:', error);
        // Fallback to home page
        openHome();
    }
}

// Request functionality
// async function loadUserRequests() {
//     const requestsList = document.getElementById('requests-list');
//     if (!requestsList) return;

//     try {
//         // Show loading state
//         requestsList.innerHTML = '<p class="loading-text">Loading current requests...</p>';

//         // Get requests from API using correct method
//         const response = await hybridAuth.getRequests();
        
//         if (response && response.requests) {
//             // Filter for current requests only (pending, in-progress)
//             const currentRequests = response.requests.filter(request => 
//                 request.status === 'pending' || request.status === 'in-progress'
//             );
//             displayCurrentRequests(currentRequests);
//         } else {
//             displayNoCurrentRequests();
//         }
//     } catch (error) {
//         console.error('Error loading current requests:', error);
//         requestsList.innerHTML = '<p class="no-requests"><i class="fas fa-exclamation-triangle"></i><br>Error loading current requests. Please try again.</p>';
//     }
// }

// Load all requests for the history section
// async function loadAllRequests() {
//     const allRequestsList = document.getElementById('all-requests-list');
//     if (!allRequestsList) return;

//     try {
//         // Show loading state
//         allRequestsList.innerHTML = '<p class="loading-text">Loading all requests...</p>';

//         // Get all requests from API
//         const response = await hybridAuth.getRequests();
        
//         if (response && response.requests) {
//             displayAllRequests(response.requests);
//         } else {
//             displayNoAllRequests();
//         }
//     } catch (error) {
//         console.error('Error loading all requests:', error);
//         allRequestsList.innerHTML = '<p class="no-requests"><i class="fas fa-exclamation-triangle"></i><br>Error loading requests history. Please try again.</p>';
//     }
// }

// function displayCurrentRequests(requests) {
//     const requestsList = document.getElementById('requests-list');
//     if (!requestsList) return;

//     if (requests.length === 0) {
//         displayNoCurrentRequests();
//         return;
//     }

//     // Sort by creation date and take only the most recent current request
//     const sortedRequests = requests.sort((a, b) => 
//         new Date(b.created_at) - new Date(a.created_at)
//     );
//     const mostRecentRequest = sortedRequests[0]; // Take only the first (most recent) request

//     const createdDate = new Date(mostRecentRequest.created_at).toLocaleDateString();
//     const priority = mostRecentRequest.priority || 'medium';
//     const status = mostRecentRequest.status || 'pending';
    
//     const requestHTML = `
//         <div class="request-item">
//             <div class="request-item-header">
//                 <span class="request-type">${mostRecentRequest.request_type}</span>
//                 <span class="request-status ${status}">${status}</span>
//             </div>
//             <div class="request-description">${mostRecentRequest.description}</div>
//             <div class="request-details">
//                 <span>📍 ${mostRecentRequest.location}</span>
//                 <span>📞 ${mostRecentRequest.phone}</span>
//                 <span class="request-priority ${priority}">Priority: ${priority}</span>
//                 <span>📅 ${createdDate}</span>
//             </div>
//         </div>
//     `;

//     requestsList.innerHTML = requestHTML;
// }

// function displayAllRequests(requests) {
//     const allRequestsList = document.getElementById('all-requests-list');
//     if (!allRequestsList) return;

//     if (requests.length === 0) {
//         displayNoAllRequests();
//         return;
//     }

//     // Sort requests by creation date (newest first)
//     const sortedRequests = requests.sort((a, b) => 
//         new Date(b.created_at) - new Date(a.created_at)
//     );

//     const requestsHTML = sortedRequests.map(request => {
//         const createdDate = new Date(request.created_at).toLocaleDateString();
//         const priority = request.priority || 'medium';
//         const status = request.status || 'pending';
        
//         return `
//             <div class="request-item">
//                 <div class="request-item-header">
//                     <span class="request-type">${request.request_type}</span>
//                     <span class="request-status ${status}">${status}</span>
//                 </div>
//                 <div class="request-description">${request.description}</div>
//                 <div class="request-details">
//                     <span>📍 ${request.location}</span>
//                     <span>📞 ${request.phone}</span>
//                     <span class="request-priority ${priority}">Priority: ${priority}</span>
//                     <span>📅 ${createdDate}</span>
//                 </div>
//             </div>
//         `;
//     }).join('');

//     allRequestsList.innerHTML = requestsHTML;
// }

// function displayNoCurrentRequests() {
//     const requestsList = document.getElementById('requests-list');
//     if (!requestsList) return;

//     requestsList.innerHTML = `
//         <div class="no-requests">
//             <i class="fas fa-clipboard-check"></i>
//             <p>No current requests</p>
//             <p style="font-size: 12px; margin-top: 0.5rem;">All your requests have been completed</p>
//         </div>
//     `;
// }

// function displayNoAllRequests() {
//     const allRequestsList = document.getElementById('all-requests-list');
//     if (!allRequestsList) return;

//     allRequestsList.innerHTML = `
//         <div class="no-requests">
//             <i class="fas fa-clipboard-list"></i>
//             <p>No requests found</p>
//             <p style="font-size: 12px; margin-top: 0.5rem;">Submit your first request using the form above</p>
//         </div>
//     `;
// }

function displayRequests(requests) {
    // This function is kept for backward compatibility
    displayCurrentRequests(requests);
}

function displayNoRequests() {
    // This function is kept for backward compatibility
    displayNoCurrentRequests();
}

function selectRequestType(type) {
    // Clear any existing selections
    document.querySelectorAll('.card-action').forEach(card => {
        card.classList.remove('selected');
    });

    // Select the clicked card
    event.target.closest('.card-action').classList.add('selected');

    // Set the request type in the form
    const requestTypeSelect = document.getElementById('request-type');
    if (requestTypeSelect) {
        requestTypeSelect.value = type;
        
        // Scroll to the form
        document.getElementById('request-form').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

        // Focus on description field
        setTimeout(() => {
            document.getElementById('request-description').focus();
        }, 500);
    }
}

async function submitRequest(formData) {
    try {
        const response = await hybridAuth.createRequest(formData);

        if (response && response.message) {
            showSuccessMessage('Request submitted successfully!');
            
            // Clear the form
            document.getElementById('request-form').reset();
            
            // Clear any selections
            document.querySelectorAll('.card-action').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Reload both request lists
            loadUserRequests();
            loadAllRequests();
            
            return true;
        } else {
            throw new Error('Failed to submit request');
        }
    } catch (error) {
        console.error('Error submitting request:', error);
        showErrorMessage('Failed to submit request. Please try again.');
        return false;
    }
// }

// function initializeRequestForm() {
//     const requestForm = document.getElementById('request-form');
//     if (!requestForm) return;

//     requestForm.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         // Get form data
//         const formData = {
//             request_type: document.getElementById('request-type').value,
//             description: document.getElementById('request-description').value,
//             location: document.getElementById('request-location').value,
//             phone: document.getElementById('request-phone').value,
//             quantity: document.getElementById('request-quantity').value || null,
//             priority: document.getElementById('request-priority').value
//         };

//         // Validate required fields
//         if (!formData.request_type || !formData.description || !formData.location || !formData.phone) {
//             showErrorMessage('Please fill in all required fields');
//             return;
//         }

//         // Validate phone number
//         const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
//         if (!phoneRegex.test(formData.phone)) {
//             showErrorMessage('Please enter a valid phone number');
//             return;
//         }

//         // Show loading state
//         const submitBtn = requestForm.querySelector('.btn-requst');
//         const originalText = submitBtn.innerHTML;
//         submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
//         submitBtn.disabled = true;

//         // Submit the request
//         const success = await submitRequest(formData);

//         // Reset button state
//         submitBtn.innerHTML = originalText;
//         submitBtn.disabled = false;
//     });

    // Auto-fill phone number from user profile if available
    // const currentUser = hybridAuth.getCurrentUser();
    // if (currentUser && currentUser.phone) {
    //     const phoneInput = document.getElementById('request-phone');
    //     if (phoneInput && !phoneInput.value) {
    //         phoneInput.value = currentUser.phone;
    //     }
    // }
}

// Initialize request functionality when page loads
function initializeRequestSystem() {
    console.log('Initializing request system...');
    
    // Initialize form
    initializeRequestForm();
    
    // Load both request sections when request section is opened
    if (document.getElementById('request-section').classList.contains('pageShowSection')) {
        loadUserRequests();
        loadAllRequests();
    }
}

// ============= PAYMENT SYSTEM =============

// Initialize payment functionality
function initializePaymentSystem() {
    console.log('Initializing payment system...');
    
    // Initialize payment form
    initializePaymentForm();
    
    // Load payment services
    loadPaymentServices();
    
    // Pre-fill user data if available
    prefillUserData();
}

// Initialize payment form
function initializePaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;

    // Mobile money provider handlers
    setupMobileMoneyHandlers();
    
    // Enhanced form interactions
    setupFormInteractions();
    
    // Setup different number toggle
    setupDifferentNumberToggle();

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handlePaymentSubmission(e);
    });

    // Service type change handler
    const serviceSelect = document.getElementById('payment-service-type');
    const amountInput = document.getElementById('payment-amount');
    
    if (serviceSelect && amountInput) {
        serviceSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.selectedOptions[0];
            if (selectedOption && selectedOption.value) {
                // Extract amount from option text (e.g., "Waste Collection - GHS 50.00")
                const text = selectedOption.textContent;
                const amountMatch = text.match(/GHS\s*([\d.]+)/);
                if (amountMatch) {
                    amountInput.value = amountMatch[1];
                    updatePaymentSummary();
                }
            } else {
                amountInput.value = '';
                hidePaymentSummary();
            }
        });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('payment-customer-phone');
    const mobileMoneyInput = document.getElementById('mobile-money-number');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            formatPhoneNumber(phoneInput);
            updatePaymentSummary();
        });
    }
    
    if (mobileMoneyInput) {
        mobileMoneyInput.addEventListener('input', () => {
            formatPhoneNumber(mobileMoneyInput);
            updatePaymentSummary();
        });
    }

    console.log('✅ Payment form initialized with simplified mobile money support');
}

// Setup mobile money provider handlers
function setupMobileMoneyHandlers() {
    const providerOptions = document.querySelectorAll('.provider-option');
    
    providerOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Update all provider options styling
                providerOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Update payment summary
                updatePaymentSummary();
                
                console.log('Selected mobile money provider:', radio.value);
            }
        });
    });
    
    // Set initial selection
    const checkedProvider = document.querySelector('input[name="mobile_provider"]:checked');
    if (checkedProvider) {
        const providerOption = checkedProvider.closest('.provider-option');
        if (providerOption) {
            providerOption.classList.add('selected');
        }
    }
}

// Setup enhanced form interactions
function setupFormInteractions() {
    const serviceSelect = document.getElementById('payment-service-type');
    const amountInput = document.getElementById('payment-amount');
    const customerName = document.getElementById('payment-customer-name');
    const customerEmail = document.getElementById('payment-customer-email');
    const customerPhone = document.getElementById('payment-customer-phone');
    const mobileMoneyNumber = document.getElementById('mobile-money-number');
    
    // Add change listeners for real-time validation and summary updates
    [serviceSelect, amountInput, customerName, customerEmail, customerPhone, mobileMoneyNumber].forEach(input => {
        if (input) {
            input.addEventListener('change', updatePaymentSummary);
            input.addEventListener('input', updatePaymentSummary);
        }
    });
    
    // Provider radio button listeners
    document.querySelectorAll('input[name="mobile_provider"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentSummary);
    });
}

// Update payment summary
// function updatePaymentSummary() {
//     const serviceSelect = document.getElementById('payment-service-type');
//     const amountInput = document.getElementById('payment-amount');
//     const customerPhoneInput = document.getElementById('payment-customer-phone');
//     const mobileMoneyInput = document.getElementById('mobile-money-number');
//     const useDifferentNumber = document.getElementById('use-different-number');
//     const summaryElement = document.getElementById('payment-summary');
    
//     if (!serviceSelect || !amountInput || !summaryElement) return;
    
//     const serviceValue = serviceSelect.value;
//     const amount = parseFloat(amountInput.value) || 0;
//     const customerPhone = customerPhoneInput ? customerPhoneInput.value : '';
    
//     // Determine which mobile number to use
//     let mobileNumber = customerPhone;
//     if (useDifferentNumber && useDifferentNumber.checked && mobileMoneyInput && mobileMoneyInput.value) {
//         mobileNumber = mobileMoneyInput.value;
//     }
    
//     if (serviceValue && amount > 0) {
//         // Get service name
//         const selectedOption = serviceSelect.selectedOptions[0];
//         const serviceName = selectedOption ? selectedOption.textContent.split(' - ')[0] : 'Unknown Service';
        
//         // Get selected provider
//         const selectedProvider = document.querySelector('input[name="mobile_provider"]:checked');
//         const providerName = selectedProvider ? getProviderDisplayName(selectedProvider.value) : 'MTN Mobile Money';
        
//         // Update summary content
//         document.getElementById('summary-service').textContent = serviceName;
//         document.getElementById('summary-amount').textContent = `GHS ${amount.toFixed(2)}`;
//         document.getElementById('summary-provider').textContent = providerName;
//         document.getElementById('summary-mobile-number').textContent = mobileNumber || '-';
//         document.getElementById('summary-total').textContent = `GHS ${amount.toFixed(2)}`;
        
//         // Show summary with animation
//         showWithAnimation(summaryElement);
        
//         console.log('Payment summary updated:', { serviceName, amount, providerName, mobileNumber });
//     } else {
//         hidePaymentSummary();
//     }
// }

// Get provider display name
function getProviderDisplayName(providerCode) {
    const providerNames = {
        'mtn': 'MTN Mobile Money',
        'vodafone': 'Vodafone Cash',
        'airteltigo': 'AirtelTigo Money'
    };
    return providerNames[providerCode] || 'MTN Mobile Money';
}

// Hide payment summary
function hidePaymentSummary() {
    const summaryElement = document.getElementById('payment-summary');
    if (summaryElement) {
        hideWithAnimation(summaryElement);
    }
}

// Show element with animation
function showWithAnimation(element) {
    if (!element) return;
    
    if (element.style.display === 'none' || !element.style.display) {
        element.style.display = 'block';
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }
}

// Hide element with animation
function hideWithAnimation(element) {
    if (!element) return;
    
    element.style.transition = 'all 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 300);
}

// Handle payment form submission
async function handlePaymentSubmission(event) {
    try {
        const formData = new FormData(event.target);
        const useDifferentNumber = document.getElementById('use-different-number');
        
        // Determine mobile money number
        let mobileMoneyNumber = formData.get('customer_phone'); // Default to customer phone
        if (useDifferentNumber && useDifferentNumber.checked && formData.get('mobile_money_number')) {
            mobileMoneyNumber = formData.get('mobile_money_number');
        }
        
        const paymentData = {
            customer_name: formData.get('customer_name'),
            customer_email: formData.get('customer_email'),
            customer_phone: formData.get('customer_phone'),
            customer_address: formData.get('customer_address'),
            service_type: formData.get('service_type'),
            amount: formData.get('amount'),
            payment_method: 'mobile_money',
            mobile_provider: formData.get('mobile_provider'),
            mobile_money_number: mobileMoneyNumber
        };

        // Validate the form
        const validation = validateEnhancedPaymentForm(paymentData);
        if (!validation.isValid) {
            showErrorMessage(validation.message);
            return;
        }

        // Update button state
        const payButton = document.getElementById('pay-button');
        const originalText = payButton.innerHTML;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        payButton.disabled = true;

        console.log('Processing mobile money payment:', paymentData);

        // Process mobile money payment
        await processMobileMoneyPayment(paymentData);

    } catch (error) {
        console.error('Payment submission error:', error);
        showErrorMessage('Payment failed. Please try again.');
        
        // Reset button
        const payButton = document.getElementById('pay-button');
        resetPaymentButton(payButton, 'mobile_money');
    }
}

// Validate enhanced payment form
function validateEnhancedPaymentForm(paymentData) {
    // Check required fields
    const requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'customer_address', 'service_type', 'amount', 'mobile_provider', 'mobile_money_number'];
    
    for (let field of requiredFields) {
        if (!paymentData[field] || paymentData[field].toString().trim() === '') {
            return { isValid: false, message: `Please fill in ${field.replace('_', ' ')}` };
        }
    }
    
    // Validate email
    if (!isValidEmail(paymentData.customer_email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    // Validate phone numbers
    if (!isValidGhanaPhone(paymentData.customer_phone)) {
        return { isValid: false, message: 'Please enter a valid Ghana phone number' };
    }
    
    if (!isValidGhanaPhone(paymentData.mobile_money_number)) {
        return { isValid: false, message: 'Please enter a valid mobile money number' };
    }
    
    // Validate amount
    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
        return { isValid: false, message: 'Please enter a valid amount' };
    }
    
    return { isValid: true };
}

// Validate Ghana phone numbers
function isValidGhanaPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return /^(233|0)?[245][0-9]{8}$/.test(cleanPhone);
}

// Process mobile money payment
async function processMobileMoneyPayment(paymentData) {
    try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            throw new Error('Authentication required');
        }

        const response = await fetch('/api/payment/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Payment initialization failed');
        }

        console.log('Payment initialized:', result);

        if (result.data && result.data.authorization_url) {
            // Open Paystack popup for mobile money
            const handler = PaystackPop.setup({
                key: result.public_key,
                email: paymentData.customer_email,
                amount: paymentData.amount * 100, // Convert to pesewas
                ref: result.data.reference,
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Mobile Money Provider",
                            variable_name: "mobile_provider",
                            value: paymentData.mobile_provider
                        },
                        {
                            display_name: "Mobile Money Number",
                            variable_name: "mobile_money_number", 
                            value: paymentData.mobile_money_number
                        }
                    ]
                },
                channels: ['mobile_money'],
                onSuccess: function(transaction) {
                    handlePaymentSuccess({ ...paymentData, reference: transaction.reference });
                },
                onCancel: function() {
                    handlePaymentClose();
                }
            });
            
            handler.openIframe();
        } else {
            throw new Error('Invalid payment response');
        }

    } catch (error) {
        console.error('Mobile money payment error:', error);
        throw error;
    }
}

// Reset payment button
function resetPaymentButton(button, paymentMethod) {
    if (!button) return;
    
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-mobile-alt"></i> Pay with Mobile Money';
}

// Handle payment success
function handlePaymentSuccess(paymentData) {
    console.log('Payment successful:', paymentData);
    
    showSuccessMessage(`Payment successful! Your ${paymentData.service_type.replace('_', ' ')} service has been booked.`);
    
    // Reset form
    document.getElementById('payment-form').reset();
    hidePaymentSummary();
    
    // Reset button
    const payButton = document.getElementById('pay-button');
    resetPaymentButton(payButton, 'mobile_money');
    
    // Update payment status in dashboard
    updatePaymentStatus();
}

// Handle payment close
function handlePaymentClose() {
    console.log('Payment cancelled by user');
    const payButton = document.getElementById('pay-button');
    resetPaymentButton(payButton, 'mobile_money');
}

// Load payment services from backend
async function loadPaymentServices() {
    try {
        if (!window.paymentService) return;
        
        const services = await window.paymentService.getServices();
        const serviceSelect = document.getElementById('payment-service-type');
        
        if (serviceSelect && services) {
            // Clear existing options except the first one
            serviceSelect.innerHTML = '<option value="">Select a service</option>';
            
            // Add services from backend
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.service_code;
                option.textContent = `${service.service_name} - GHS ${service.base_price.toFixed(2)}`;
                option.dataset.price = service.base_price;
                serviceSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading payment services:', error);
    }
}

// Get service pricing data
function getServicePricing(serviceCode) {
    const serviceSelect = document.getElementById('payment-service-type');
    if (!serviceSelect) return null;
    
    const option = serviceSelect.querySelector(`option[value="${serviceCode}"]`);
    if (option && option.dataset.price) {
        return {
            price: parseFloat(option.dataset.price),
            name: option.textContent
        };
    }
    
    return null;
}



// Update payment status on dashboard
async function updatePaymentStatus() {
//     try {
//         if (!window.paymentService) return;
        
//         const payments = await window.paymentService.getPaymentHistory();
//         const paymentCard = document.querySelector('.grid-card.pay');
        
//         if (paymentCard && payments && payments.length > 0) {
//             // Get the most recent successful payment
//             const successfulPayments = payments.filter(p => p.status === 'success');
            
//             if (successfulPayments.length > 0) {
//                 const latestPayment = successfulPayments[0];
//                 const formattedAmount = window.paymentService.formatAmount(latestPayment.amount);
//                 const formattedDate = window.paymentService.formatDate(latestPayment.created_at);
                
//                 paymentCard.innerHTML = `
//                     <p class="grid-text-top"><i class="fa-solid fa-credit-card"></i>Last Payment</p>
//                     <div class="inner-box">
//                         <p class="sm-text">${formattedAmount}</p>
//                         <p class="sm-sm-text">${formattedDate}</p>
//                     </div>
//                 `;
                
//                 // Change color to success
//                 paymentCard.style.backgroundColor = '#4CAF50';
//                 paymentCard.style.color = 'white';
//             }
//         }
//     } catch (error) {
//         console.error('Error updating payment status:', error);
//     }
// }

// ============= END PAYMENT SYSTEM =============

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


document.getElementById('confirm-pay-btn').addEventListener('click', async () => {
  document.getElementById('confirmation-modal').style.display = 'none';

  console.log("Confirmed data:", paymentData);  // Check here

  try {
    const docRef = await addDoc(collection(db, "payment"), {
      ...paymentData,
      timestamp: serverTimestamp()
    });
    console.log("✅ Firestore write OK! Doc ID:", docRef.id);

    startPaystackPayment({
      fullName: paymentData.fullName,
      email: paymentData.email,
      phone: paymentData.phone,
      amount: paymentData.amount
    });
  } catch (error) {
    console.error("❌ Firestore error:", error);
    alert("Error saving payment to database. Check console.");
  }
});

}

// function for users feedback
function openFeedBack(){
    const userFeedback = document.getElementById("users-feedback");
    userFeedback.style.display = "block";
}

// closeUsersFeedback
document.getElementById("closeUsersFeedback").addEventListener('click',()=>{
 const userFeedback = document.getElementById("users-feedback");
    userFeedback.style.display = "none";
})

// openNotification function
function openNotification(){
    const showNotification = document.getElementById("notifications-popup");

}

document.getElementById("toggleNotification").addEventListener('click', ()=>{
    const showNotification = document.getElementById("notifications-popup");
    showNotification.classList.toggle("showNotify-popup");
})

// openPaymentHistory function
function openPaymentHistory(){
    const paymentHistory = document.getElementById("payment-history-container");
    paymentHistory.style.display = "flex";
}

// closePaymentHistory function
function closePaymentHistory(){
      const paymentHistory = document.getElementById("payment-history-container");
    paymentHistory.style.display = "none";
}

// openRequestHistory function
 function openRequestHistory(){
       const requestHistory = document.getElementById("request-history-container");
    requestHistory.style.display = "flex";
 }

 // closeRequestHistory function
function closeRequestHistory(){
        const requestHistory = document.getElementById("request-history-container");
    requestHistory.style.display = "none";
}

// openReportHistory function
 function openReportHistory(){
       const reportHistory = document.getElementById("report-history-container");
    reportHistory.style.display = "flex";
 }

 // closeRequestHistory function
function closeReportHistory(){
        const reportHistory = document.getElementById("report-history-container");
    reportHistory.style.display = "none";
}
