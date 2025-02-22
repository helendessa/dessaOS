// show or hide the menu when the button is clicked
function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
    } else {
        menu.classList.add('show');
    }
}

// display the window, update its title,
// and create an icon in the toolbar
function openWindow(title, iconPath = 'icon.png') {
    // get the window element and show it
    const windowElement = document.getElementById('window');
    windowElement.style.display = 'block';
    // update the title
    windowElement.querySelector('.window-header h1').innerText = title;

    // creates an icon in the toolbar
    const openPrograms = document.getElementById('open-programs');
    const programIcon = document.createElement('img');
    programIcon.src = iconPath;
    programIcon.alt = title;

    // toggle on click
    // if visible, hide it and vice versa
    programIcon.onclick = () => {
        if (windowElement.style.display === 'block') {
            windowElement.style.display = 'none'; // minimize
        } else {
            windowElement.style.display = 'block'; // maximize
        }
    };

    // add the icon to the toolbar
    openPrograms.appendChild(programIcon);
}

// hides the window and removes the icon from the toolbar
function closeWindow() {
    const windowElement = document.getElementById('window');
    windowElement.style.display = 'none'; // hide window

    // remove the icon from the toolbar
    const openPrograms = document.getElementById('open-programs');
    const programIcons = openPrograms.getElementsByTagName('img');
    for (let i = 0; i < programIcons.length; i++) {
        // find the icon with the same title
        if (programIcons[i].alt === windowElement.querySelector('.window-header h1').innerText) {
            openPrograms.removeChild(programIcons[i]);
            break;
        }
    }
}

// hide window w/o removing icon
function minimizeWindow() {
    const windowElement = document.getElementById('window');
    windowElement.style.display = 'none';
}

// if maximized, restore to normal size
// if normal size, maximize to full screen
function maximizeWindow() {
    const windowElement = document.getElementById('window');
    const taskbarHeight = document.querySelector('.taskbar').offsetHeight;

    if (windowElement.classList.contains('maximized')) {
        // restore the window to its previous size and position.
        windowElement.classList.remove('maximized');
        windowElement.style.width = '90%';
        windowElement.style.height = 'auto';
        windowElement.style.transform = '';
    } else {
        // maximize the window to occupy full width and height minus the taskbar height
        windowElement.classList.add('maximized');
        windowElement.style.width = '100vw';
        windowElement.style.height = `calc(100vh - ${taskbarHeight}px)`;
        windowElement.style.top = '0';
        windowElement.style.left = '0';
        windowElement.style.transform = 'none';
    }
}

// track if the window is being dragged
let isDragging = false;
let offsetX, offsetY;

// add mouse event listeners for dragging the window header
document.querySelector('.window-header').addEventListener('mousedown', (e) => {
    isDragging = true;
    // calculate the offset relative to the window element
    offsetX = e.clientX - e.target.parentElement.offsetLeft;
    offsetY = e.clientY - e.target.parentElement.offsetTop;
    // listen for mouse move and mouse up events
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// update window position while dragging
function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const windowElement = document.getElementById('window');
    const taskbarHeight = document.querySelector('.taskbar').offsetHeight;

    // calculate new position based on mouse movement
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // prevent exceeding left edge
    if (newLeft < 0) {
        newLeft = 0;
    }
    // prevent exceeding right edge
    if (newLeft + windowElement.offsetWidth > window.innerWidth) {
        newLeft = window.innerWidth - windowElement.offsetWidth;
    }
    // prevent moving above the top
    if (newTop < 0) {
        newTop = 0;
    }
    // prevent moving below the taskbar
    if (newTop + windowElement.offsetHeight > window.innerHeight - taskbarHeight) {
        newTop = window.innerHeight - taskbarHeight - windowElement.offsetHeight;
    }

    windowElement.style.left = `${newLeft}px`;
    windowElement.style.top = `${newTop}px`;
}

// stop dragging when mouse is released
function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

// adjust window size when resizing so that it does not exceed the taskbar margin
function onResize() {
    const windowElement = document.getElementById('window');
    const taskbarHeight = document.querySelector('.taskbar').offsetHeight;

    // if bottom of window is below available space, adjust height
    if (windowElement.offsetTop + windowElement.offsetHeight > window.innerHeight - taskbarHeight) {
        windowElement.style.height = `${window.innerHeight - taskbarHeight - windowElement.offsetTop}px`;
    }
    // if right of window exceeds viewport, adjust width
    if (windowElement.offsetLeft + windowElement.offsetWidth > window.innerWidth) {
        windowElement.style.width = `${window.innerWidth - windowElement.offsetLeft}px`;
    }
}

// Use ResizeObserver to monitor changes in the window element’s size
const resizeObserver = new ResizeObserver(() => {
    onResize();
});
resizeObserver.observe(document.getElementById('window'));

// update clock with current time
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// close menu if clicked outside of it or the menu button
document.addEventListener('click', (event) => {
    const menu = document.getElementById('menu');
    if (menu.classList.contains('show')) {
        const clickInside = event.target.closest('#menu') || event.target.closest('.menu-button');
        if (!clickInside) {
            menu.classList.remove('show');
        }
    }
});