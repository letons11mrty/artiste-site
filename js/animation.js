document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a');
  const body = document.body;

  links.forEach(link => {
      link.addEventListener('click', function(event) {
          if (link.href && link.href.startsWith(window.location.origin)) {
              event.preventDefault();
              body.classList.add('fade-out-active');
              setTimeout(() => {
                  window.location.href = link.href;
              }, 500); // アニメーションの時間に合わせる
          }
      });
  });

  window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
          body.classList.remove('fade-out-active');
          body.classList.add('fade-in-active');
      }
  });

  body.classList.add('fade-in-active');
});