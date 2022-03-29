/**
 * This is script for index page
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

(function ($) {
  $(document).ready(function () {
    // Function to add and remove the page transition screen
    const loader = document.querySelector(".loader");
    // Horizontal Page Transition
    function loaderIn() {
      // GSAP tween to stretch the loading screen across the whole screen
      return gsap.fromTo(
        loader,
        {
          rotation: 10,
          scaleX: 0,
          scaleY: 1,
          xPercent: -5,
        },
        {
          duration: 0.8,
          xPercent: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          ease: "Power4.inOut",
          transformOrigin: "left center",
        }
      );
    }
    function loaderAway(container) {
      // GSAP tween to hide the loading screen
      return gsap
        .timeline({ delay: 1 })
        .add("load")
        .to(loader, {
          duration: 0.8,
          scaleX: 0,
          scaleY: 1,
          xPercent: 5,
          rotation: -10,
          transformOrigin: "right center",
          ease: "Power4.inOut",
        })
        .call(contentAnimation, [container], "load");
    }
    // Vertical Page Transition
    function loaderDown() {
      // GSAP tween to stretch the loading screen across the whole screen
      return gsap.fromTo(
        loader,
        {
          xPercent: 0,
          skewY: 0,
          scaleY: 0,
          scaleX: 1,
          rotation: 0,
          transformOrigin: "left bottom",
        },
        {
          duration: 0.8,
          xPercent: 0,
          skewY: "10deg",
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          ease: "Power4.inOut",
          transformOrigin: "left bottom",
        }
      );
    }
    function loaderUp(container) {
      // GSAP tween to hide the loading screen
      return gsap
        .timeline({ delay: 1 })
        .add("load")
        .to(loader, {
          duration: 0.8,
          xPercent: 0,
          skewY: 0,
          scaleX: 1,
          scaleY: 0,
          rotation: 0,
          transformOrigin: "left top",
          ease: "Power4.inOut",
        })
        .call(contentAnimation, [container], "load");
    }
    // Function to animate the content of each page
    function contentAnimation() {
      // Reload scripts
      initCursor();
      initScroll();
      initSlider();
      initAnimations();
      initPopup();
      if ($(".page-map").length > 0) {
        initMap();
      }
    }
    //
    function initLoader() {
      gsap.set(loader, {
        scaleX: 0,
        rotation: 10,
        xPercent: -5,
        yPercent: -50,
        transformOrigin: "left center",
        autoAlpha: 1,
        backgroundColor: "#00b176",
      });
    }

    // Init Barba

    if ($(".barba-wrapper").length > 0) {
      initLoader();

      barba.hooks.before(() => {
        document.querySelector("html").classList.add("is-transitioning");
      });
      barba.hooks.after(() => {
        document.querySelector("html").classList.remove("is-transitioning");
        initLoader();
      });

      barba.init({
        transitions: [
          {
            async leave(data) {
              await loaderIn();
              data.current.container.remove();
            },
            async enter(data) {
              await loaderAway(data.next.container);
            },
          },
          {
            name: "story-story",
            from: {
              namespace: "story",
            },
            to: {
              namespace: "story",
            },
            async leave(data) {
              await loaderDown();
              data.current.container.remove();
            },
            async enter(data) {
              await loaderUp(data.next.container);
            },
          },
        ],
      });
    }

    // CURSOR

    // Init scroller
    initScroll();
    function initScroll() {
      var CurrentScroll = 0;
      const scroller = document.querySelector("scroll");
      if (scroller) {
        const bodyScrollBar = Scrollbar.init(scroller, {
          damping: 0.1,
        });
        ScrollTrigger.scrollerProxy("scroll", {
          scrollTop(value) {
            if (arguments.length) {
              bodyScrollBar.scrollTop = value;
            }
            return bodyScrollBar.scrollTop;
          },
        });
        bodyScrollBar.track.xAxis.element.remove();
        bodyScrollBar.addListener(ScrollTrigger.update);
        ScrollTrigger.defaults({ scroller: scroller });
        bodyScrollBar.addListener((status) => {
          $(window).trigger("scroll");
          if (150 < status.offset.y) {
            $(".header").addClass("scrolled");
            var NextScroll = status.offset.y;

            if (NextScroll > CurrentScroll) {
              $(".header").addClass("hide");
            } else {
              $(".header").removeClass("hide");
            }
            CurrentScroll = NextScroll;
          } else {
            $(".header").removeClass("scrolled").removeClass("hide");
          }
        });
        // Scroll To links
        $(document).on(
          "click touchend",
          ".sidebar a, .btn-scroll-link",
          function (e) {
            let target = $(this).attr("href");
            const targetEl = document.querySelector(target);
            const targetRect = targetEl.getBoundingClientRect();
            e.preventDefault();
            var topY =
              $(target).offset().top - $(".scroll-content").offset().top - 100;
            gsap.to(bodyScrollBar, {
              duration: 1,
              scrollTo: {
                y: topY,
                autoKill: true,
              },
              offsetY: 80,
              ease: "power4",
            });
          }
        );
      }
    }
    initSlider();
    // Init Slider
    function initSlider() {
      $(".instagram-slider").slick({
        arrows: false,
        dots: false,
        slidesToShow: 3,
        centerMode: true,
        variableWidth: true,
      });
      $(".big-slider .slider-items").slick({
        arrows: true,
        dots: false,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: "60px",
        autoplay: true,
        autoplaySpeed: 3000,
      });
    }
    // Animations
    initAnimations();
    function initAnimations() {}

    // Init Popup
    initPopup();
    function initPopup() {
      // Show splash screen only once
    }

    // Init Components
    initComponents();
    function initComponents() {
      // Init MMenu
      $(".hamburger").on("click", function () {
        $(this).toggleClass("is-active");
        $("#mobile-nav").toggleClass("is-active");
      });
      $("#mobile-nav .menu-item.dropdown").on("click", function () {
        $(this).find(".dropdown-menu").slideToggle();
      });
      // Init hamburger
      $(".hamburger-btn").on("click", function () {
        $(".nav-menu").css("left", 0);
      });
      // Init hamburger close
      $(".hamburger-close-btn").on("click", function () {
        $(".nav-menu").css("left", "-100vw");
      });
      // Init Accordion
      $(".accordion-item__header").on("click", function () {
        let $accordion = $(this).closest(".accordion-item");
        $accordion.toggleClass("accordion-item--opened");
        $accordion.find(".accordion-item__body").slideToggle();
      });
      $(".tab-link").on("click", function () {
        if (!$(this).hasClass("active")) {
          let $content = $($(this).attr("data-target"));
          let $old = $(".tab-content.active");
          $(".tab-link.active").removeClass("active");
          $(".tab-content.active").removeClass("active");
          $old.fadeOut(500);
          $.when($content.fadeIn(500)).then(() => {
            $(this).addClass("active");
            $content.addClass("active");
          });
        }
      });
    }
  });
})(jQuery);
