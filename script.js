document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = () => {
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        applyTheme(); // Ensure consistency if called from multiple places
    });

    // Load saved theme preference on initial load
    applyTheme();

    // Store user email globally for Paystack (simple approach for demo)
    // In a real app, this would be managed more securely, e.g., via server-side sessions
    // or a more robust client-side auth state management.
    // For now, we can retrieve from localStorage if set during wallet funding or login/register simulation.
    window.getUserEmailForPayment = function() {
        let email = localStorage.getItem('userEmail');
        if (!email) {
            email = prompt("Please enter your email for payment:", "user@example.com");
            if (email) localStorage.setItem('userEmail', email); // Save if provided
        }
        return email;
    };

    // Function to handle logout (can be called from multiple pages)
    window.logout = function() {
        // In a real application, you would clear session/token
        localStorage.removeItem('userEmail'); // Clear demo email on logout
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }

    // Attach logout to any logout links if present
    // This listener might be duplicated if script.js is loaded multiple times or if pages also attach it.
    // Ensure it's robust or handled by page-specific scripts if necessary.
    // For simplicity, we'll keep one central logout attachment here.
    const logoutLinks = document.querySelectorAll('#logout-link');
    logoutLinks.forEach(link => {
        // Ensure listener is not attached multiple times if script is re-run or elements are dynamic
        if (!link.hasAttribute('data-logout-listener-attached')) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                window.logout();
            });
            link.setAttribute('data-logout-listener-attached', 'true');
        }
    });

    // Global function to update cart count in navbar, callable from other scripts
    window.updateGlobalCartCount = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElements = document.querySelectorAll('#cart-count'); // All cart count spans
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => {
            if (el) el.textContent = totalItems;
        });
    };
    // Initial call to set cart count on all pages loading script.js
    window.updateGlobalCartCount();

    // Simulate auth state for nav links across all pages
    window.updateNavBasedOnAuthState = function() {
        const userEmail = localStorage.getItem('userEmail');
        const loginNavItems = document.querySelectorAll('.login-nav-item-managed'); // Generic class for login links
        const registerNavItems = document.querySelectorAll('.register-nav-item-managed'); // Generic class for register links
        const logoutNavItems = document.querySelectorAll('.logout-nav-item-managed'); // Generic class for logout links
        const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item-managed'); // Generic class for dashboard links

        if (userEmail) { // User is "logged in"
            loginNavItems.forEach(item => item.style.display = 'none');
            registerNavItems.forEach(item => item.style.display = 'none');
            logoutNavItems.forEach(item => item.style.display = 'list-item'); // Or 'block' or '' depending on element type
            dashboardNavItems.forEach(item => item.style.display = 'list-item');
        } else { // User is "logged out"
            loginNavItems.forEach(item => item.style.display = 'list-item');
            registerNavItems.forEach(item => item.style.display = 'list-item');
            logoutNavItems.forEach(item => item.style.display = 'none');
            dashboardNavItems.forEach(item => item.style.display = 'none');
        }
    };
    // Initial call to set nav state
    window.updateNavBasedOnAuthState();
});
