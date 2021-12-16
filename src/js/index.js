import "swiper/swiper-bundle.min.css";
import "normalize.css/normalize.css";

import "../scss/index.scss";

import { initSwiper } from "./initSwiper";
import { applyModals } from "./modals";
import { applyExpand } from "./expand";

initSwiper();
applyModals();
applyExpand();
