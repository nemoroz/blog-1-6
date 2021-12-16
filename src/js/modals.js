

import { mediaPoints } from "./mediaConstants";

// класс создающий перекрывающий слой
class Overlay {
  constructor() {
    this.elementClass = "page__overlay";
    this.domElement = document.querySelector(`.${this.elementClass}`);

    const setMod = (modName) => `${this.elementClass}--${modName}`;

    this.mods = {
      leave: setMod("leave"),
      near: setMod("near"),
    };
  }

  show() {
    if (this.domElement.classList.contains(this.mods.leave)) {
      this.domElement.classList.remove(this.mods.leave);
    }
  }

  hide() {
    if (!this.domElement.classList.contains(this.mods.leave)) {
      this.domElement.classList.add(this.mods.leave);
    }
  }

  get isNear() {
    return this.domElement.classList.contains(this.mods.near);
  }

  makeNear() {
    if (!this.isNear) {
      this.domElement.classList.add(this.mods.near);
    }
  }

  makeFar() {
    if (this.isNear) {
      this.domElement.classList.remove(this.mods.near);
    }
  }
}

const overlay = new Overlay();
// класс создающий модальное окно
class Modal {
  static openModals = [];
  static hideAll() {
    // мобильный ли размер
    const mobileWidth = window.outerWidth < mediaPoints.desktop;

    for (let modal of this.openModals) {
      const currentIsSidebar = modal.alias === "sidebar";

      if (!mobileWidth && currentIsSidebar) continue;
      else {
        // не используем this.hide() потому что он скроет перекрытие
        modal.addClass(modal.leaveClass);
        modal.needShow = false;
      }

      this.openModals = [];
    }

    // задаём сайдбару начальный z-index
    overlay.makeFar();

    // скрываем сайдбар
    overlay.hide();
  }

  constructor(
    modalName, // data-modal='${modalName}'
    oneOf = true // является ли окно приоритетным
  ) {
    this.oneOf = oneOf;

    // псевдоним модального окна (для удобства)
    this.alias = modalName;

    // нужно ли показать модалку
    this.needShow = false;

    // элемент модального окна
    this.domElement = document.querySelector(`[data-modal='${modalName}']`);

    // класс css который нужно добавить, чтобы убрать модалку
    this.leaveClass = oneOf ? "modal--leave" : "sidebar--leave";

    // элементы переключающие модальное окно
    this.switchElements = document.querySelectorAll(
      `[data-toggle='${modalName}']`
    );

    // вешаем click на переключающие элементы
    this.switchElements.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.needShow = !this.needShow;

        if (this.needShow) {
          this.show();
        }
        //
        else {
          this.hide();
        }
      });
    });

    // следим за размером вьюпорта
    const watch = (e) => {
      // является ли вьюпорт мобильным устройством
      const isMobileWidth = window.outerWidth < mediaPoints.desktop;
      const hasOpenModals = Modal.openModals.length > 0;
      const openOnlySidebar =
        Modal.openModals.length === 1 &&
        Modal.openModals.find((el) => el.alias === "sidebar");

      if (this.alias === "sidebar" && !hasOpenModals) {
        isMobileWidth
          ? this.addClass(this.leaveClass)
          : this.removeClass(this.leaveClass);
      }

      if (openOnlySidebar && !isMobileWidth) {
        overlay.hide();
      } else if (hasOpenModals && isMobileWidth) {
        overlay.show();
      }
    };

    window.addEventListener("load", watch);
    window.addEventListener("resize", watch);
  }

  // Сокращения для манипуляции с classList элемента

  // Убрать класс
  removeClass(className) {
    this.domElement.classList.remove(className);
  }

  // Добавить класс
  addClass(className) {
    this.domElement.classList.add(className);
  }

  // Переключить класс
  toggleClass(className) {
    this.domElement.classList.toggle(className);
  }

  // Имеется ли класс
  hasClass(className) {
    return this.domElement.classList.contains(className);
  }

  // Показать
  show(showOverlay = true) {
    this.needShow = true;
    this.removeClass(this.leaveClass);

    Modal.openModals.push(this);

    if (this.alias !== "sidebar")
      this.domElement.querySelector(".modal__input").focus();

    if (showOverlay) overlay.show();
    if (this.oneOf) overlay.makeNear();
  }

  // Скрыть
  hide() {
    this.needShow = false;
    this.addClass(this.leaveClass);

    const currentModalIndex = Modal.openModals.indexOf(this);
    Modal.openModals.splice(currentModalIndex, 1);

    if (this.oneOf) overlay.makeFar();
    if (Modal.openModals.length === 0) overlay.hide();
  }
}

overlay.domElement.addEventListener("click", () => {
  Modal.hideAll();
});

export const applyModals = () => {
  const sidebar = new Modal("sidebar", false);
  const modalCall = new Modal("call");
  const modalFeedback = new Modal("feedback");
};
