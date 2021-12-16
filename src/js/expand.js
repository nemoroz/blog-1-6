const createLazyText = () => {
  // main-about__text-block
  const parent = document.querySelector(".main-about");
  const textElement = parent.querySelector(".main-about__text-block span");
  const toggleElement = parent.querySelector(".main-about__text-block button");

  const startContent = textElement.textContent;
  const extraContent = "bla ".repeat(50);

  let expand = false;
  const buttonTextElement = toggleElement.querySelector("span");
  const startText = buttonTextElement.textContent;
  toggleElement.addEventListener("click", () => {
    expand = !expand;
    buttonTextElement.textContent = expand ? "скрыть" : startText;

    if (expand) {
      textElement.textContent = startContent + extraContent;
      toggleElement.classList.add("button-toggle--expand");
    } else {
      textElement.textContent = startContent;
      toggleElement.classList.remove("button-toggle--expand");
    }
  });
};

const createLazyCards = (listName) => {
  // brands, techtypes
  const list = document.querySelector(`[data-expand-list='${listName}']`);
  const toggleElement = document.querySelector(
    `[data-expand-toggle='${listName}']`
  );

  const perRow = getComputedStyle(list).gridTemplateColumns.split(" ").length;

  const firstCard = list.querySelector(".card");
  const fakeCards = [];

  for (let i = 0; i < perRow; i++) {
    const fakeCard = firstCard.cloneNode(true);
    fakeCards.push(fakeCard);
    fakeCard.style.display = "none";
    list.appendChild(fakeCard);
  }

  let expand = false;
  const buttonTextElement = toggleElement.querySelector("span");
  const startText = buttonTextElement.textContent;

  toggleElement.addEventListener("click", () => {
    expand = !expand;

    buttonTextElement.textContent = expand ? "скрыть" : startText;
    toggleElement.classList.toggle("button-toggle--expand");

    fakeCards.forEach((card) => {
      card.style.display = expand ? "flex" : "none";
    });
  });
};

export const applyExpand = () => {
  createLazyText();
  createLazyCards("brands");
  createLazyCards("techtypes");
};
