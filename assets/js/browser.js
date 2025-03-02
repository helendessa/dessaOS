document.addEventListener('DOMContentLoaded', function() {
    const addressInput = document.querySelector('.address-input');
    const goButton = document.querySelector('.go-button');
    const browserContent = document.getElementById('browser-content');
    const statusBar = document.querySelector('.status-bar');
    
    document.querySelector('.browser-window').style.backgroundColor = '#1a1a1a';
    document.querySelector('.browser-toolbar').style.background = 'linear-gradient(to bottom, #333333, #222222)';
    document.querySelector('.favorites-bar').style.backgroundColor = '#2a2a2a';
    document.querySelector('.browser-content').style.backgroundColor = '#1a1a1a';
    document.querySelector('.status-bar').style.backgroundColor = '#2a2a2a';
    document.querySelector('.status-bar').style.color = '#aaaaaa';
    
    if (addressInput) {
        addressInput.style.backgroundColor = '#333333';
        addressInput.style.color = '#e0e0e0';
    }
    
    document.querySelectorAll('.nav-button').forEach(button => {
        button.style.backgroundColor = '#333333';
        button.style.border = '1px solid #555555';
    });
    
    const goOutsideMessages = [
        "Error: The world is a dark place. Maybe some sunlight will help.",
        "Website blocked by Emo Firewall™. Try again after listening to some Fresno.",
        "Loading failed: Your soul needs more eyeliner and less screen time.",
        "Connection interrupted: Your black nail polish is chipping. Time for a touch-up.",
        "404: Happiness Not Found. Have you tried listening to 'Mayday Parade'?",
        "Access denied: The real world has better angst than this website.",
        "Page cannot be displayed: Why not listen to some 'Bring Me The Horizon' instead?",
        "Server error: 'Gray Matter' is calling you to reflect. Go outside and scream.",
        "Unable to connect: Your heart is heavy with sorrow. Take a walk and reflect.",
        "Content blocked: The internet will still be here after you listen to 'Simple Plan'.",
        "Error: 'Never Shout Never' wants you to take a break and enjoy the outdoors."
    ];
    
    function showGoOutsideMessage() {
        const randomMessage = goOutsideMessages[Math.floor(Math.random() * goOutsideMessages.length)];
        
        const errorHTML = `
            <div class="error-container" style="background-color: #222222; color: #e0e0e0; border: 1px solid #444444;">
                <div class="error-header">
                    <img src="../assets/images/warning-icon.ico" class="error-icon" alt="Warning">
                    <h1 style="color: #9cdcfe;">Internet Explorer cannot display the webpage</h1>
                </div>
                
                <div class="error-message" style="background-color: #2a2a2a; border: 1px solid #444444;">
                    <strong style="color: #9cdcfe;">${randomMessage}</strong>
                    <p>The internet has decided you've been online long enough today.</p>
                </div>
                
                <div class="error-details" style="color: #cccccc;">
                    <p>Try:</p>
                    <ul>
                        <li>Going outside and feeling the sun on your face</li>
                        <li>Having an actual conversation with another human being</li>
                        <li>Remembering what grass feels like under your feet</li>
                        <li>Drinking water (you're probably dehydrated)</li>
                        <li>Looking at birds without Googling what species they are</li>
                    </ul>
                </div>
                
                <button class="error-button" onclick="handleRefresh()" style="
                    background: linear-gradient(to bottom, #444444, #333333);
                    border: 1px solid #555555;
                    color: #e0e0e0;
                ">
                    Try Again (But Really, Go Outside)
                </button>
            </div>
        `;
        
        browserContent.innerHTML = errorHTML;
    }
    
    function showGoogleHomePage() {
        const googleHomeHTML = `
            <div class="search-container" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-family: Arial, sans-serif;
                background-color: #1a1a1a;
                color: #e0e0e0;
            ">
                <img src="../assets/images/google-logo.png" alt="Google" class="google-logo" style="
                    width: 230px;
                    height: auto;
                    margin-bottom: 15px;
                    display: block;
                    filter: brightness(0.9) contrast(1.2);
                ">
                <div style="margin-bottom: 15px;">
                    <div style="
                        background-color: #2a2a2a; 
                        border: 1px solid #555555;
                        padding: 3px;
                        width: 350px;
                        display: flex;
                    ">
                        <input type="text" id="searchInput" style="
                            width: 100%;
                            height: 22px;
                            padding: 1px 5px;
                            border: none;
                            outline: none;
                            font-size: 13px;
                            background-color: #2a2a2a;
                            color: #e0e0e0;
                        ">
                    </div>
                </div>
                <div class="search-buttons" style="
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                ">
                    <button class="search-button" onclick="navigate()" style="
                        background: #333333;
                        background: linear-gradient(to bottom, #444444, #333333);
                        border: 1px solid #555555;
                        border-radius: 2px;
                        color: #e0e0e0;
                        font-size: 12px;
                        font-family: Arial, sans-serif;
                        font-weight: normal;
                        padding: 3px 6px;
                        height: 24px;
                        cursor: pointer;
                    ">Google Search</button>
                    <button class="search-button" onclick="navigate()" style="
                        background: #333333;
                        background: linear-gradient(to bottom, #444444, #333333);
                        border: 1px solid #555555;
                        border-radius: 2px;
                        color: #e0e0e0;
                        font-size: 12px;
                        font-family: Arial, sans-serif;
                        font-weight: normal;
                        padding: 3px 6px;
                        height: 24px;
                        cursor: pointer;
                    ">I'm Feeling Lucky</button>
                </div>
                <div style="
                    margin-top: 30px;
                    font-size: 11px;
                    color: #aaaaaa;
                    text-align: center;
                ">
                    Google searches 3,083,324,652 web pages
                    <div style="margin-top: 15px;">
                        <span style="color: #9cdcfe;">Advertising Programs</span> - 
                        <span style="color: #9cdcfe;">Business Solutions</span> - 
                        <span style="color: #9cdcfe;">About Google</span>
                    </div>
                    <div style="margin-top: 10px;">
                        ©2003 Google - Searching 3,083,324,652 web pages
                    </div>
                </div>
            </div>
        `;
        
        browserContent.innerHTML = googleHomeHTML;
        statusBar.textContent = "Done";
    }
    
    function navigate() {
        addressInput.value = addressInput.value.trim();
        showGoOutsideMessage();
        statusBar.textContent = "Done (Seriously, go outside)";
    }
    
    function handleRefresh() {
        showGoOutsideMessage();
        statusBar.textContent = "Refreshing your perspective on life...";
    }
    
    window.navigate = navigate;
    window.handleRefresh = handleRefresh;
    
    goButton.addEventListener('click', navigate);
    
    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            navigate();
        }
    });
    
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            showGoOutsideMessage();
            if (this.title === "Refresh") {
                statusBar.textContent = "Refreshing your perspective on life...";
            } else {
                statusBar.textContent = "Done (The outside world is waiting for you)";
            }
        });
    });
    
    showGoogleHomePage();
});