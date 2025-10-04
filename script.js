// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const votingModal = document.getElementById('votingModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const successModal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Authentication Elements
    const aadhaarForm = document.getElementById('aadhaarForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const requestOTPBtn = document.getElementById('requestOTP');
    const useBiometricBtn = document.getElementById('useBiometric');
    const otpVerification = document.getElementById('otpVerification');
    const biometricVerification = document.getElementById('biometricVerification');
    const verifyOTPBtn = document.getElementById('verifyOTP');
    const otpInputs = document.querySelectorAll('.otp-input');
    const countdown = document.getElementById('countdown');
    
    // Voting Elements
    const voteBtns = document.querySelectorAll('.vote-btn');
    const confirmVoteBtn = document.getElementById('confirmVote');
    const cancelVoteBtn = document.getElementById('cancelVote');
    const finishVotingBtn = document.getElementById('finishVoting');
    const confirmParty = document.getElementById('confirmParty');
    const confirmCandidate = document.getElementById('confirmCandidate');
    const confirmSymbol = document.getElementById('confirmSymbol');
    const transactionId = document.getElementById('transactionId');
    const timestamp = document.getElementById('timestamp');
    
    // Voter Info (would normally be fetched from server after authentication)
    const voterInfo = {
        name: "Ravi Kumar Singh",
        voterId: "XYZ1234567",
        constituency: "North Delhi",
        hasVoted: false
    };
    
    // Candidate Data (would normally be fetched from server)
    const candidates = [
        { id: 1, name: "Amit Sharma", party: "Party A", symbol: "/api/placeholder/60/60" },
        { id: 2, name: "Priya Patel", party: "Party B", symbol: "/api/placeholder/60/60" },
        { id: 3, name: "Rahul Gupta", party: "Party C", symbol: "/api/placeholder/60/60" },
        { id: 4, name: "Sarita Singh", party: "Party D", symbol: "/api/placeholder/60/60" },
        { id: "nota", name: "None of the Above", party: "NOTA", symbol: null }
    ];
    
    // Current selected candidate
    let selectedCandidate = null;
    
    // ===== Event Listeners =====
    
    // Open Login Modal
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
    
    // Close Modal
    closeBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Close any modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target == loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Handle Aadhaar Form Submission
    aadhaarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const aadhaarNumber = document.getElementById('aadhaarNumber').value;
        
        // Validate Aadhaar number (simple validation, would be more complex in production)
        if (aadhaarNumber.length === 12 && /^\d+$/.test(aadhaarNumber)) {
            step1.classList.remove('active');
            step2.classList.add('active');
        } else {
            alert('Please enter a valid 12-digit Aadhaar number');
        }
    });
    
    // Handle OTP Request
    requestOTPBtn.addEventListener('click', () => {
        step2.classList.remove('active');
        step3.classList.add('active');
        otpVerification.style.display = 'block';
        biometricVerification.style.display = 'none';
        
        // Start OTP countdown
        let seconds = 60;
        countdown.textContent = seconds;
        
        const interval = setInterval(() => {
            seconds--;
            countdown.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(interval);
                document.getElementById('otpTimer').textContent = 'Resend OTP';
            }
        }, 1000);
        
        // Focus first OTP input
        otpInputs[0].focus();
    });
    
    // Handle Biometric Option
    useBiometricBtn.addEventListener('click', () => {
        step2.classList.remove('active');
        step3.classList.add('active');
        otpVerification.style.display = 'none';
        biometricVerification.style.display = 'block';
        
        // Simulate biometric verification after 3 seconds
        setTimeout(() => {
            document.getElementById('scanStatus').textContent = 'Verification Successful!';
            document.getElementById('scanStatus').style.color = 'var(--success-color)';
            
            // Proceed to voting screen after 1 more second
            setTimeout(() => {
                loginModal.style.display = 'none';
                loadVotingScreen();
            }, 1000);
        }, 3000);
    });
    
    // OTP Input Handling - Auto-focus to next input
    otpInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            // If a number is entered, move to the next input
            if (e.key >= 0 && e.key <= 9) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
            // If backspace is pressed, move to the previous input
            else if (e.key === 'Backspace') {
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });
    
    // Verify OTP Button
    verifyOTPBtn.addEventListener('click', () => {
        let otp = '';
        let isValid = true;
        
        // Collect OTP digits and validate
        otpInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
            }
            otp += input.value;
        });
        
        if (isValid) {
            // For demo purposes, any 6-digit OTP is valid
            if (otp.length === 6) {
                loginModal.style.display = 'none';
                loadVotingScreen();
            } else {
                alert('Please enter a valid OTP');
            }
        } else {
            alert('Please enter all OTP digits');
        }
    });
    
    // Load the voting screen with voter info
    function loadVotingScreen() {
        // Set voter information
        document.getElementById('voterName').textContent = voterInfo.name;
        document.getElementById('voterId').textContent = voterInfo.voterId;
        document.getElementById('constituency').textContent = voterInfo.constituency;
        
        // Check if voter has already voted
        if (voterInfo.hasVoted) {
            alert('You have already cast your vote in this election.');
            return;
        }
        
        // Display voting modal
        votingModal.style.display = 'flex';
    }
    
    // Handle voting button clicks
    voteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const candidateId = btn.getAttribute('data-candidate');
            selectedCandidate = candidates.find(c => c.id.toString() === candidateId);
            
            // Show confirmation modal
            votingModal.style.display = 'none';
            confirmationModal.style.display = 'flex';
            
            // Set confirmation details
            confirmParty.textContent = selectedCandidate.party;
            confirmCandidate.textContent = selectedCandidate.name;
            
            // Set symbol for normal parties, or show NOTA icon
            if (selectedCandidate.id === 'nota') {
                confirmSymbol.style.display = 'none';
                document.querySelector('.party-symbol-large').innerHTML = '<i class="fas fa-ban" style="font-size: 3rem; color: var(--danger-color);"></i>';
            } else {
                confirmSymbol.style.display = 'block';
                confirmSymbol.src = selectedCandidate.symbol;
                document.querySelector('.party-symbol-large').innerHTML = '';
                document.querySelector('.party-symbol-large').appendChild(confirmSymbol);
            }
        });
    });
    
    // Cancel vote and return to voting screen
    cancelVoteBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        votingModal.style.display = 'flex';
    });
    
    // Confirm vote
    confirmVoteBtn.addEventListener('click', () => {
        // Generate random transaction ID for demo purposes
        const randomHex = () => {
            return [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        };
        
        // Format current date and time
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
        };
        const formattedTime = now.toLocaleDateString('en-IN', options) + ' IST';
        
        // Set transaction details
        transactionId.textContent = '0x' + randomHex();
        timestamp.textContent = formattedTime;
        
        // Show success modal
        confirmationModal.style.display = 'none';
        successModal.style.display = 'flex';
        
        // Mark voter as having voted
        voterInfo.hasVoted = true;
    });
    
    // Finish voting process
    finishVotingBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
        // Redirect to homepage or thank you page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // ===== Helper Functions =====
    
    // For demonstration purposes - add some animations to features
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Simple animation on scroll
    window.addEventListener('scroll', () => {
        featureCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initialize some styles
    featureCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});