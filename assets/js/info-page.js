function loadContent(event, url) {
    event.preventDefault();
    fetch(url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const newContent = doc.querySelector('#content').innerHTML;
        document.getElementById('content').innerHTML = newContent;
      })
      .catch(error => console.error('Error loading content:', error));
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (event) => {
        loadContent(event, link.href);
      });
    });
  });