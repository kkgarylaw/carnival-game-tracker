document.addEventListener('DOMContentLoaded', function() {
    // Initialize booth tracking
    if (!localStorage.getItem('completedBooths')) {
        localStorage.setItem('completedBooths', JSON.stringify([]));
    }
    
    updateBoothDisplay();
    
    // Set up QR scanner
    const scanButton = document.getElementById('scan-button');
    let html5QrCode;
    
    scanButton.addEventListener('click', function() {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                scanButton.textContent = 'Start Scanner';
            }).catch(err => console.error(err));
            return;
        }
        
        html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            onScanSuccess, 
            onScanFailure
        );
        
        scanButton.textContent = 'Stop Scanner';
    });
    
    function onScanSuccess(decodedText, decodedResult) {
        // Process the QR code
        processBoothCode(decodedText);
        
        // Stop scanning after successful scan
        html5QrCode.stop().then(() => {
            scanButton.textContent = 'Start Scanner';
        }).catch(err => console.error(err));
    }
    
    function onScanFailure(error) {
        // Handle scan failure silently
        console.warn(`QR scan error: ${error}`);
    }
    
    function processBoothCode(code) {
        // Expected format: "booth-1" through "booth-6"
        if (code.startsWith('booth-')) {
            const boothNumber = code.split('-')[1];
            if (boothNumber >= 1 && boothNumber <= 6) {
                markBoothAsCompleted(boothNumber);
                alert(`Booth ${boothNumber} completed!`);
            } else {
                alert('Invalid booth code!');
            }
        } else {
            alert('Invalid QR code format!');
        }
    }
    
    function markBoothAsCompleted(boothNumber) {
        const completedBooths = JSON.parse(localStorage.getItem('completedBooths'));
        
        // Check if booth is already completed
        if (!completedBooths.includes(boothNumber)) {
            completedBooths.push(boothNumber);
            localStorage.setItem('completedBooths', JSON.stringify(completedBooths));
            updateBoothDisplay();
            
            // Check if all booths are completed
            if (completedBooths.length === 6) {
                showCompletionScreen();
            }
        }
    }
    
    function updateBoothDisplay() {
        const completedBooths = JSON.parse(localStorage.getItem('completedBooths'));
        
        // Reset all booths
        document.querySelectorAll('.booth').forEach(booth => {
            booth.classList.remove('completed');
        });
        
        // Mark completed booths
        completedBooths.forEach(boothNumber => {
            const boothElement = document.getElementById(`booth-${boothNumber}`);
            if (boothElement) {
                boothElement.classList.add('completed');
            }
        });
    }
    
    function showCompletionScreen() {
        document.getElementById('completion-container').style.display = 'block';
        document.getElementById('scanner-container').style.display = 'none';
        
        // Create confetti effect
        createConfetti();
    }
    
    function createConfetti() {
        const confettiCount = 150;
        const container = document.querySelector('.container');
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 5 + 's';
            confetti.style.backgroundColor = getRandomColor();
            container.appendChild(confetti);
        }
    }
    
    function getRandomColor() {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', 
                        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Add reset button for testing
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Progress (For Testing)';
    resetButton.style.marginTop = '30px';
    resetButton.style.padding = '10px';
    resetButton.style.backgroundColor = '#f44336';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';
    
    resetButton.addEventListener('click', function() {
        localStorage.setItem('completedBooths', JSON.stringify([]));
        updateBoothDisplay();
        document.getElementById('completion-container').style.display = 'none';
        document.getElementById('scanner-container').style.display = 'block';
        document.querySelectorAll('.confetti').forEach(c => c.remove());
    });
    
    document.querySelector('.container').appendChild(resetButton);
});
