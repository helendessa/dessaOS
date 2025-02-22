// apply the theme based on local storage
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        document.getElementById('theme-icon').src = '/assets/images/light-theme-icon.svg';
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        document.getElementById('theme-icon').src = '/assets/images/dark-theme-icon.svg';
    }
}

// check local storage for theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});

// toggle theme and save preference to local storage
document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});