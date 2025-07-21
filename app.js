document.addEventListener('DOMContentLoaded', function() {
    // --- Supabase Client Initialization (Corrected) ---
    const SUPABASE_URL = 'https://vbxojcdlctuakzxwbjsr.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieG9qY2RsY3R1YWt6eHdianNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzE3OTcsImV4cCI6MjA2ODU0Nzc5N30.2ahS1261ZAAlOoqtB94Zjm1HzCBTbPw4_5DdmXXvjD0';
    // The variable is now named 'supabaseClient' to avoid conflict
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    /* --- Real-Time Crypto Price Logic --- */
    const cryptoData = [
        { name: 'Bitcoin', symbol: 'BTC', price: 117470.02, change: 0.01, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg' },
        { name: 'Ethereum', symbol: 'ETH', price: 2940.13, change: 1.64, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' },
        { name: 'BNB', symbol: 'BNB', price: 686.03, change: 1.27, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Binance-coin-bnb-logo.svg' },
        { name: 'Solana', symbol: 'SOL', price: 160.18, change: 2.10, logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png' },
        { name: 'XRP', symbol: 'XRP', price: 2.72, change: -1.70, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Xrp-icon-freotated.svg' },
        { name: 'Dogecoin', symbol: 'DOGE', price: 0.1969, change: 5.78, logo: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Dogecoin_Logo.png' }
    ];

    function displayCryptoPrices() {
        const cryptoGrid = document.querySelector('.crypto-grid');
        if (!cryptoGrid) return;
        cryptoGrid.innerHTML = '';

        cryptoData.forEach(crypto => {
            const changeClass = crypto.change > 0 ? 'positive' : crypto.change < 0 ? 'negative' : 'neutral';
            const sign = crypto.change > 0 ? '+' : '';

            const card = `
                <div class="crypto-card">
                    <div class="crypto-title">
                        <img src="${crypto.logo}" alt="${crypto.name} logo" class="crypto-logo">
                        <span class="crypto-name">${crypto.name} (${crypto.symbol})</span>
                    </div>
                    <div class="crypto-price">$${crypto.price.toLocaleString()}</div>
                    <div class="crypto-change ${changeClass}">
                        ${sign}${crypto.change.toFixed(2)}%
                    </div>
                </div>
            `;
            cryptoGrid.innerHTML += card;
        });
    }
    
    displayCryptoPrices();
    
    /* --- Modal & Multi-Step Form Logic --- */
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const headerSignupBtn = document.getElementById('header-signup-btn');
    const mainSignupBtn = document.getElementById('main-signup-btn');
    const signupCloseBtn = document.getElementById('signup-close-btn');
    const jumpStartLink = document.getElementById('jump-start-link');
    const headerLoginBtn = document.getElementById('header-login-btn');
    const loginCloseBtn = document.getElementById('login-close-btn');
    const loginSuccessPrompt = document.getElementById('login-success-prompt');

    const openSignupModal = () => {
        resetSignupForm();
        signupModal.style.display = 'flex';
    };
    const closeSignupModal = () => { signupModal.style.display = 'none'; };

    const openLoginModal = (showSuccess = false) => {
        if (showSuccess) {
            loginSuccessPrompt.style.display = 'block';
            setTimeout(() => {
                loginSuccessPrompt.style.display = 'none';
            }, 5000);
        } else {
            loginSuccessPrompt.style.display = 'none';
        }
        loginModal.style.display = 'flex';
    };
    
    const closeLoginModal = () => { loginModal.style.display = 'none'; };

    headerSignupBtn.addEventListener('click', openSignupModal);
    mainSignupBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openSignupModal();
    });
    jumpStartLink.addEventListener('click', (event) => {
        event.preventDefault();
        const cryptoSection = document.getElementById('crypto-prices');
        cryptoSection.scrollIntoView({ behavior: 'smooth' });
    });
    signupCloseBtn.addEventListener('click', closeSignupModal);
    headerLoginBtn.addEventListener('click', () => openLoginModal(false));
    loginCloseBtn.addEventListener('click', closeLoginModal);
    
    window.addEventListener('click', (event) => {
        if (event.target == signupModal) closeSignupModal();
        if (event.target == loginModal) closeLoginModal();
    });

    // --- Multi-Step Sign-up Form Logic ---
    let currentStep = 1;
    const totalSteps = 3;
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const createAccountBtn = document.getElementById('create-account-btn');
    const steps = document.querySelectorAll('.signup-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    function updateFormStep() {
        steps.forEach(step => {
            step.classList.remove('active-step');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active-step');
            }
        });
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
        createAccountBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    }

    function validateStep() {
        const activeStep = document.querySelector(`.signup-step[data-step="${currentStep}"]`);
        const inputs = activeStep.querySelectorAll('input[required]');
        for (let input of inputs) {
            if (!input.value.trim()) {
                alert(`Please fill out the ${input.previousElementSibling.innerText} field.`);
                input.focus();
                return false;
            }
        }
        return true;
    }

    function resetSignupForm() {
        document.getElementById('signup-form').reset();
        currentStep = 1;
        updateFormStep();
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep()) {
            currentStep++;
            updateFormStep();
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateFormStep();
    });
    
    updateFormStep();

    // --- Sign-up Form Submission with Supabase & EmailJS ---
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!validateStep()) return;

        const email = document.getElementById('modal-email').value;
        const password = document.getElementById('modal-password').value;
        const fullname = document.getElementById('modal-fullname').value;
        const username = document.getElementById('modal-username').value;
        const phone = document.getElementById('modal-phone').value;

        createAccountBtn.disabled = true;
        createAccountBtn.innerText = 'Creating...';

        // Corrected to use 'supabaseClient'
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { 
                    full_name: fullname,
                    username: username 
                }
            }
        });

        if (error) {
            alert('Sign-up Error: ' + error.message);
            createAccountBtn.disabled = false;
            createAccountBtn.innerText = 'Create Account';
        } else {
            const serviceID = 'service_d02xkpc';
            const adminTemplateID = 'template_jkwaalf';
            const publicKey = 'hwaHP8OPK0SyrpWlH';
            
            const emailParams = {
                fullname: fullname,
                email: email,
                phone: phone,
                username: username
            };

            emailjs.send(serviceID, adminTemplateID, emailParams, publicKey)
                .then(() => {
                    console.log('Admin notification sent successfully via EmailJS.');
                }).catch(err => {
                    console.error("EmailJS Error:", err);
                }).finally(() => {
                    createAccountBtn.disabled = false;
                    createAccountBtn.innerText = 'Create Account';
                    closeSignupModal();
                    openLoginModal(true);
                });
        }
    });
    
    // --- Login Form Handling with Supabase ---
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginButton = loginForm.querySelector('button[type="submit"]');

        loginButton.disabled = true;
        loginButton.innerText = 'Logging in...';

        // Corrected to use 'supabaseClient'
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        loginButton.disabled = false;
        loginButton.innerText = 'Log in';

        if (error) {
            alert('Login Failed: ' + error.message);
        } else {
            window.location.href = 'dashboard.html';
        }
    });
});