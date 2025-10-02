// Nervous thoughts array - can be modified by user
let nervousThoughts = [
    "What if I'm not good enough?",
    "Did I lock the car?",
    "Idk if I'm prepared for sectionals",
    "What if I completely blank on my exam next week",
    "Could I have done better?",
    "waiting for a text from my boss...",
    "Did I lock up the house?",
    "What if I have no friends",
    "What if I'm not prepared enough?",
    "What if the kids at work don't like me",
    "Did I remember everything?",
    "What if I don't make it there on time?",
    "I should have been more careful",
    "Did I make the right choice?",
    "What if I'm not smart enough?",
    "I'm probably overthinking this",
    "Am I being too sensitive?",
    "Did I miss something important?",
    "What if I'm not ready for this?",
    "Sometime I feel like I'm incompetent",
    "I should have asked for help",
    "We're doing full runthrough today what if I don't know my parts",
    "What if I'm not cut out for this?",
    "Did I turn that in?",
    "I'm probably just being paranoid",
    "What if I'm not as good as I think I am?",
    "I'm not even playing today why am I nervous",
    "Concert is coming up I should probably practice tonight"
];

// User's custom worries
let customWorries = [];

// Popup titles
const popupTitles = [
    "System Alert",
    "Warning",
    "Error",
    "Notification",
    "Reminder",
    "Attention",
    "Alert",
    "Notice",
    "Message",
    "Update"
];

let popupCounter = 0;
let popupInterval;
let isRunning = false;

// Initialize the desktop
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Add click handlers to desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            // Remove selection from other icons
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            // Add selection to clicked icon
            this.classList.add('selected');
        });
    });
    
    // Start the popup system
    startPopupSystem();
});

// Update clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('clock').textContent = timeString;
}

// Start the popup system
function startPopupSystem() {
    if (isRunning) return;
    isRunning = true;
    
    // Create first popup immediately
    setTimeout(() => {
        createPopup();
    }, 2000);
    
    // Set up interval for random popups
    popupInterval = setInterval(() => {
        if (Math.random() < 0.7) { // 70% chance of popup
            createPopup();
        }
    }, getRandomInterval());
}

// Stop the popup system
function stopPopupSystem() {
    isRunning = false;
    if (popupInterval) {
        clearInterval(popupInterval);
    }
}

// Get random interval between 5-10 seconds
function getRandomInterval() {
    return Math.random() * 5000 + 5000; // 5-10 seconds
}

// Create a popup
function createPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.id = `popup-${popupCounter++}`;
    
    // Random position on screen
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 200) + 30; // Below menu bar
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    // Random title and message
    const title = popupTitles[Math.floor(Math.random() * popupTitles.length)];
    const allWorries = [...nervousThoughts, ...customWorries];
    const message = allWorries[Math.floor(Math.random() * allWorries.length)];
    
    popup.innerHTML = `
        <div class="popup-header">
            <span>${title}</span>
            <button class="popup-close" onclick="closePopup('${popup.id}')">×</button>
        </div>
        <div class="popup-content">
            ${message}
        </div>
        <div class="popup-buttons">
            <button class="popup-button" onclick="closePopup('${popup.id}')">OK</button>
            <button class="popup-button" onclick="closePopup('${popup.id}')">Cancel</button>
        </div>
    `;
    
    // Add shake animation randomly
    if (Math.random() < 0.3) {
        popup.classList.add('shake');
    }
    
    document.getElementById('popup-container').appendChild(popup);
    
    // Add dragging functionality to worry popups too
    setTimeout(() => {
        makePopupDraggable(popup);
    }, 10);
    
    // Auto-close after 8-15 seconds if not manually closed
    setTimeout(() => {
        if (document.getElementById(popup.id)) {
            closePopup(popup.id);
        }
    }, Math.random() * 7000 + 8000);
    
    // Schedule next popup
    if (isRunning) {
        setTimeout(() => {
            if (Math.random() < 0.6) {
                createPopup();
            }
        }, getRandomInterval());
    }
}

// Close popup
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.animation = 'popupAppear 0.3s ease-out reverse';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }
}

// Desktop icon interactions
document.getElementById('trash-icon').addEventListener('dblclick', function() {
    openTrashApp();
});

document.getElementById('worry-icon').addEventListener('dblclick', function() {
    openMindPalace();
});

document.getElementById('thoughts-icon').addEventListener('dblclick', function() {
    openThoughtJournal();
});

// Settings menu in menu bar
document.getElementById('settings-menu').addEventListener('click', function() {
    openSettings();
});

// Trash App - Shows "deleted" worries that keep coming back
function openTrashApp() {
    const trashThoughts = [
        "Deleted worry: 'What if I'm not good enough?'",
        "Deleted worry: 'Everyone is judging me'",
        "Deleted worry: 'I should have done better'",
        "Deleted worry: 'What if I'm annoying everyone?'",
        "Deleted worry: 'Did I sumbit that properly?'"
    ];
    
    const popup = createCustomPopup(
        "Trash - Deleted Worries",
        `Empty Trash?\n\n${trashThoughts.join('\n\n')}\n\nThese worries will be permanently deleted... or will they?`,
        ["Empty Trash", "Cancel"],
        true
    );
    
    // Add special behavior - worries come back after "deleting"
    setTimeout(() => {
        if (Math.random() < 0.8) {
            createPopup(); // Worries always come back
        }
    }, 3000);
}

// Worry Tracker App - Shows worry statistics and patterns
function openWorryTracker() {
    const worryStats = {
        total: Math.floor(Math.random() * 50) + 20,
        today: Math.floor(Math.random() * 15) + 5,
        thisWeek: Math.floor(Math.random() * 100) + 30,
        categories: {
            "Work": Math.floor(Math.random() * 20) + 5,
            "Relationships": Math.floor(Math.random() * 15) + 3,
            "Health": Math.floor(Math.random() * 10) + 2,
            "Future": Math.floor(Math.random() * 25) + 8
        }
    };
    
    const message = `Worry Tracker Statistics\n\n` +
        `Total Worries: ${worryStats.total}\n` +
        `Today: ${worryStats.today}\n` +
        `This Week: ${worryStats.thisWeek}\n\n` +
        `Top Categories:\n` +
        `• Work: ${worryStats.categories.Work}\n` +
        `• Future: ${worryStats.categories.Future}\n` +
        `• Relationships: ${worryStats.categories.Relationships}\n` +
        `• Health: ${worryStats.categories.Health}\n\n` +
        `Status: Worrying at ${Math.floor(Math.random() * 40) + 60}% capacity`;
    
    createCustomPopup("Worry Tracker v1.0", message, ["Export Data", "Clear All", "Close"], true);
}

// Mind Palace App - Opens the worry jar page
function openMindPalace() {

    window.location.href = 'mind_palace.html';
}

// Thought Journal App - Interactive worry logging (kept for reference)
function openThoughtJournal() {
    const journalEntries = [
        "3:47 PM - What if I'm not prepared for tomorrow's meeting?",
        "2:23 PM - Did I remember to call mom back?",
        "11:42 AM - Did my interview go well?",
        "10:30 AM - I should have been more careful with that email",
        "9:15 AM - What if I'm not cut out for this job?",
        "8:45 AM - Did I lock the car? I think I did...",
        "8:00 AM - Did I close the yard gate?"
    ];
    
    const message = `Thought Journal - Today's Entries\n\n` +
        journalEntries.slice(0, Math.floor(Math.random() * 5) + 3).join('\n\n') +
        `\n\nTotal entries today: ${Math.floor(Math.random() * 20) + 8}\n` +
        `Average worry level: ${Math.floor(Math.random() * 3) + 7}/10`;
    
    createCustomPopup("Thought Journal", message, ["New Entry", "Export", "Close"], true);
}


// Create custom popup with specific content and buttons
function createCustomPopup(title, message, buttons, isAppPopup = false) {
    const popup = document.createElement('div');
    popup.className = isAppPopup ? 'popup app-popup' : 'popup';
    popup.id = `popup-${popupCounter++}`;
    
    // Position: center for app popups, random for others
    if (!isAppPopup) {
        const x = Math.random() * (window.innerWidth - 350);
        const y = Math.random() * (window.innerHeight - 300) + 30;
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
    } else {
        // For app popups, set initial position to center
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
    }
    
    // Create button HTML
    const buttonHTML = buttons.map(btn => 
        `<button class="popup-button" onclick="handleCustomButton('${popup.id}', '${btn}')">${btn}</button>`
    ).join('');
    
    popup.innerHTML = `
        <div class="popup-header">
            <span>${title}</span>
            <button class="popup-close" onclick="closePopup('${popup.id}')">×</button>
        </div>
        <div class="popup-content">
            <pre style="white-space: pre-wrap; font-family: 'Chicago', 'Monaco', 'Courier New', monospace; font-size: 11px;">${message}</pre>
        </div>
        <div class="popup-buttons">
            ${buttonHTML}
        </div>
    `;
    
    document.getElementById('popup-container').appendChild(popup);
    
    // Add dragging functionality after a small delay to ensure positioning is complete
    setTimeout(() => {
        makePopupDraggable(popup);
    }, 10);
    
    // Auto-close after 15 seconds
    setTimeout(() => {
        if (document.getElementById(popup.id)) {
            closePopup(popup.id);
        }
    }, 15000);
    
    return popup;
}

// Handle custom button clicks
function handleCustomButton(popupId, buttonText) {
    closePopup(popupId);
    
    // Add specific behaviors for different buttons
    if (buttonText.includes("Empty Trash")) {
        // Show confirmation that worries are "deleted" but will come back
        setTimeout(() => {
            createCustomPopup("System Message", "Trash emptied successfully.\n\n(Note: Worries may reappear due to system limitations)", ["OK"]);
        }, 500);
    } else if (buttonText.includes("Export Data")) {
        // Show fake export dialog
        setTimeout(() => {
            createCustomPopup("Export Worries", "Exporting worry data...\n\nFile: worries_export.txt\nSize: 2.3 MB\n\nThis may take a while...", ["Cancel"]);
        }, 500);
    } else if (buttonText.includes("Clear All")) {
        // Show warning about clearing data
        setTimeout(() => {
            createCustomPopup("Warning", "Are you sure you want to clear all worry data?\n\nThis action cannot be undone.\n\n(Note: Worries will regenerate automatically)", ["Yes, Clear All", "Cancel"]);
        }, 500);
    } else if (buttonText.includes("New Entry")) {
        // Create a new worry entry
        setTimeout(() => {
            const newWorry = nervousThoughts[Math.floor(Math.random() * nervousThoughts.length)];
            createCustomPopup("New Entry Added", `Added to journal:\n\n"${newWorry}"\n\nTime: ${new Date().toLocaleTimeString()}\n\nEntry saved successfully.`, ["OK"]);
        }, 500);
    } else if (buttonText.includes("Add Worries")) {
        // Open worry input dialog
        setTimeout(() => {
            openWorryInputDialog();
        }, 500);
        // Reset everything
        setTimeout(() => {
            createCustomPopup("Reset Confirmation", "Are you sure you want to reset everything?\n\nThis will:\n• Clear all custom worries\n• Reset background to default\n• Restart popup system\n\nThis action cannot be undone.", ["Yes, Reset", "Cancel"]);
        }, 500);
    } else if (buttonText.includes("Yes, Reset")) {
        // Actually reset everything
        customWorries = [];
        document.getElementById('desktop-bg').style.background = '#c0c0c0';
        document.getElementById('desktop-bg').style.backgroundImage = 'none';
        stopPopupSystem();
        setTimeout(() => {
            startPopupSystem();
            createCustomPopup("Reset Complete", "Everything has been reset to defaults.\n\nCustom worries cleared.\nBackground restored.\nPopup system restarted.", ["OK"]);
        }, 500);
    }
}

// Open dialog for adding custom worries
function openWorryInputDialog() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.id = `popup-${popupCounter++}`;
    
    const x = Math.random() * (window.innerWidth - 400);
    const y = Math.random() * (window.innerHeight - 400) + 30;
    
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    popup.innerHTML = `
        <div class="popup-header">
            <span>Add Custom Worries</span>
            <button class="popup-close" onclick="closePopup('${popup.id}')">×</button>
        </div>
        <div class="popup-content">
            <p>Enter your worries (one per line):</p>
            <textarea id="worry-input" style="width: 100%; height: 150px; margin: 8px 0; font-family: 'Chicago', 'Monaco', 'Courier New', monospace; font-size: 11px; resize: none;" placeholder="What if I'm not good enough?&#10;Did I forget something important?&#10;Everyone probably thinks I'm weird..."></textarea>
            <p style="font-size: 10px; color: #666;">These will be added to the random popup rotation.</p>
        </div>
        <div class="popup-buttons">
            <button class="popup-button" onclick="addCustomWorries('${popup.id}')">Add Worries</button>
            <button class="popup-button" onclick="closePopup('${popup.id}')">Cancel</button>
        </div>
    `;
    
    document.getElementById('popup-container').appendChild(popup);
    
    // Focus the textarea
    setTimeout(() => {
        document.getElementById('worry-input').focus();
    }, 100);
}

// Add custom worries from input
function addCustomWorries(popupId) {
    const input = document.getElementById('worry-input');
    const newWorries = input.value.split('\n')
        .map(w => w.trim())
        .filter(w => w.length > 0);
    
    if (newWorries.length > 0) {
        customWorries.push(...newWorries);
        closePopup(popupId);
        
        setTimeout(() => {
            createCustomPopup("Worries Added", `Successfully added ${newWorries.length} custom worries!\n\nTotal worries now: ${nervousThoughts.length + customWorries.length}\n\nThese will appear in random popups.`, ["OK"]);
        }, 500);
    } else {
        createCustomPopup("Error", "Please enter at least one worry.", ["OK"]);
    }
}

// Open background selection dialog
function openBackgroundDialog() {
    const message = `Change Desktop Background\n\n` +
        `Current: Default gray gradient\n\n` +
        `Options:\n` +
        `• Upload custom image\n` +
        `• Use solid color\n` +
        `• Restore default\n\n` +
        `Note: Menu bar will remain at the top.`;
    
    createCustomPopup("Background Settings", message, ["Upload Image", "Solid Color", "Restore Default", "Close"]);
}

// Handle background changes
function handleBackgroundChange(type) {
    if (type === 'upload') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const desktopBg = document.getElementById('desktop-bg');
                    if (desktopBg) {
                        desktopBg.style.background = `url('${e.target.result}') center/cover no-repeat, #c0c0c0`;
                        createCustomPopup("Background Updated", "Custom background image applied!\n\nMenu bar remains visible at the top.", ["OK"]);
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    } else if (type === 'color') {
        const color = prompt("Enter a color (e.g., #ff6b6b, blue, rgb(255,107,107)):");
        if (color) {
            const desktopBg = document.getElementById('desktop-bg');
            if (desktopBg) {
                desktopBg.style.background = color;
                desktopBg.style.backgroundImage = 'none';
                createCustomPopup("Background Updated", `Background changed to: ${color}\n\nMenu bar remains visible at the top.`, ["OK"]);
            }
        }
    } else if (type === 'default') {
        const desktopBg = document.getElementById('desktop-bg');
        if (desktopBg) {
            desktopBg.style.background = '#c0c0c0';
            desktopBg.style.backgroundImage = 'none';
            createCustomPopup("Background Restored", "Background restored to default gray gradient.\n\nMenu bar remains visible at the top.", ["OK"]);
        }
    }
}

// Make popup draggable
function makePopupDraggable(popup) {
    let isDragging = false;
    let startX;
    let startY;
    let initialX;
    let initialY;

    const header = popup.querySelector('.popup-header');
    
    // Prevent dragging on close button
    const closeButton = popup.querySelector('.popup-close');
    
    header.addEventListener('mousedown', dragStart, true);
    document.addEventListener('mousemove', drag, true);
    document.addEventListener('mouseup', dragEnd, true);

    function dragStart(e) {
        // Don't start drag if clicking close button
        if (closeButton && closeButton.contains(e.target)) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        isDragging = true;
        popup.classList.add('dragging');
        
        // Get current position
        const rect = popup.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        startX = e.clientX;
        startY = e.clientY;
    }

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        popup.style.left = (initialX + deltaX) + 'px';
        popup.style.top = (initialY + deltaY) + 'px';
    }

    function dragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        popup.classList.remove('dragging');
    }
}

// Prevent context menu on desktop
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Add some desktop interaction
document.addEventListener('click', function(e) {
    // Deselect icons when clicking on desktop
    if (e.target.classList.contains('desktop') || e.target.classList.contains('desktop-background')) {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to create popup
    if (e.code === 'Space') {
        e.preventDefault();
        createPopup();
    }
    
    // Escape to close all popups
    if (e.code === 'Escape') {
        document.querySelectorAll('.popup').forEach(popup => {
            closePopup(popup.id);
        });
    }
    
    // P to pause/resume popups
    if (e.code === 'KeyP') {
        if (isRunning) {
            stopPopupSystem();
        } else {
            startPopupSystem();
        }
    }
});

// Add some system-like behavior
window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your worries might follow you...';
});

// Add some clunky system sounds (visual feedback)
function playClickSound() {
    // Visual feedback instead of sound
    document.body.style.filter = 'brightness(1.1)';
    setTimeout(() => {
        document.body.style.filter = 'brightness(1)';
    }, 100);
}

// Add click sound to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup-button') || 
        e.target.classList.contains('popup-close') ||
        e.target.classList.contains('desktop-icon')) {
        playClickSound();
    }
});
