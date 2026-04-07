import "./styles.css";
import "impress.js/js/impress.js";
import deckMarkdown from "../slides/deck.md?raw";
import { parseSlides } from "./parser.js";
import { renderSlide } from "./render.js";

const slides = parseSlides(deckMarkdown);
const impressRoot = document.querySelector("#impress");

impressRoot.innerHTML = slides.map(renderSlide).join("");

const api = window.impress();
api.init();

document.getElementById("nav-home").addEventListener("click", () => {
  api.goto(slides[0].id);
});

document.getElementById("nav-prev").addEventListener("click", () => {
  api.prev();
});

document.getElementById("nav-next").addEventListener("click", () => {
  api.next();
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-goto]");

  if (!target) {
    return;
  }

  event.preventDefault();
  api.goto(target.dataset.goto);
});