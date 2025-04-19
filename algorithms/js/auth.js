// Authentication related JavaScript for AlgoVerse

document.addEventListener('DOMContentLoaded', function() {
    // Form validation for signup
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                event.preventDefault();
                alert('Passwords do not match!');
            }
            
            if (password.length < 6) {
                event.preventDefault();
                alert('Password must be at least 6 characters long!');
            }
        });
    }
    
    // Add input validation styles
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = 'var(--error-color)';
            } else {
                this.style.borderColor = 'var(--success-color)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
        });
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email === '') {
                this.style.borderColor = 'var(--error-color)';
            } else if (!emailRegex.test(email)) {
                this.style.borderColor = 'var(--error-color)';
                alert('Please enter a valid email address!');
            } else {
                this.style.borderColor = 'var(--success-color)';
            }
        });
    }
});