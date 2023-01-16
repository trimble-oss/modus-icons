let target = document.querySelector('footer');

let scrollToTopBtn = document.querySelector('.btn-to-top');
let rootElement = document.documentElement;

function callback(entries, observer) {
  entries.forEach((entry) => {
    window.onscroll = function (e) {
      if (entry.isIntersecting) {
        scrollToTopBtn.classList.add('show-btn');
      } else {
        scrollToTopBtn.classList.remove('show-btn');
      }
    };
  });
}

function scrollToTop() {
  rootElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
scrollToTopBtn.addEventListener('click', scrollToTop);

let observer = new IntersectionObserver(callback);
observer.observe(target);
