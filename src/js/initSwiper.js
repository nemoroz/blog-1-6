import Swiper from "swiper/swiper-bundle.min.js";
import { isMobileDevice, mediaPoints } from "./mediaConstants";

export function initSwiper() {
  const wrapperClass = "swiper-wrapper";
  const wrappers = Array.from(document.getElementsByClassName(wrapperClass));

  function watch() {
    if (
      window.outerWidth >= mediaPoints.table &&
      wrappers.every((el) => el.classList.contains(wrapperClass))
    ) {
      wrappers.forEach((el) => el.classList.remove(wrapperClass));
    } else if (
      window.outerWidth < mediaPoints.table &&
      !wrappers.every((el) => el.classList.contains(wrapperClass))
    ) {
      wrappers.forEach((el) => el.classList.add(wrapperClass));
    }
  }

  window.addEventListener("load", watch);
  window.addEventListener("resize", watch);

  let swiper;

  if (isMobileDevice) {
    swiper = new Swiper(".swiper-container", {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      slidesPerView: "auto",
      spaceBetween: 16,

      watchOverflow: true,

      breakpoints: {
        [mediaPoints.table]: {
          touchRatio: 0,
        },
      },
    });
  }

  return { swiper, watch };
}
