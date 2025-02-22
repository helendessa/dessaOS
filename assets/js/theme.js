document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    const themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.src = '/assets/images/light-theme-icon.svg'; // on dark theme
    } else {
        themeIcon.src = '/assets/images/dark-theme-icon.svg'; // on ligth theme
    }
});