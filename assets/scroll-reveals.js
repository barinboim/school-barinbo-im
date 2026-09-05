(function () {
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;

  var running = new Set();
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches) return;
        var animation = entry.target.animate(
          [
            { opacity: 0, translate: '0 18px' },
            { opacity: 1, translate: '0 0' },
          ],
          { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );
        running.add(animation);
        animation.onfinish = function () {
          running.delete(animation);
        };
        animation.oncancel = function () {
          running.delete(animation);
        };
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
  );

  document.querySelectorAll('[data-reveal]').forEach(function (element) {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      observer.observe(element);
    }
  });

  function stop() {
    if (!preference.matches) return;
    observer.disconnect();
    running.forEach(function (animation) {
      animation.cancel();
    });
    running.clear();
  }
  preference.addEventListener('change', stop);
})();
