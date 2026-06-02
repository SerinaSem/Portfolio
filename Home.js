const cursor = document.getElementById("cur");
const cursorRing = document.getElementById("curR");
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  document.querySelectorAll("a, button, input, textarea").forEach((element) => {
    element.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    element.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), index * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function setLang(lang) {
  const isEnglish = lang === "en";
  document.body.classList.toggle("en", isEnglish);
  document.getElementById("btn-fr")?.classList.toggle("active", !isEnglish);
  document.getElementById("btn-en")?.classList.toggle("active", isEnglish);
  document.documentElement.lang = lang;

  const subjectInput = document.getElementById("subj-input");
  if (subjectInput) {
    subjectInput.placeholder = isEnglish ? "Work-study offer" : "Proposition d'alternance";
  }

  localStorage.setItem("lang", lang);
}

if (localStorage.getItem("lang") === "en") {
  setLang("en");
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-center a")];

const highlightCurrentSection = () => {
  const current = sections.reduce((active, section) => {
    return window.scrollY >= section.offsetTop - 140 ? section.id : active;
  }, "hero");

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", highlightCurrentSection, { passive: true });
highlightCurrentSection();

function handleSend(event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector(".send-btn");
  const isEnglish = document.body.classList.contains("en");

  if (!button) return;

  const formData = new FormData(form);
  const firstName = formData.get("firstName")?.trim() || "";
  const lastName = formData.get("lastName")?.trim() || "";
  const email = formData.get("email")?.trim() || "";
  const subject = formData.get("subject")?.trim() || (isEnglish ? "Portfolio contact" : "Contact portfolio");
  const message = formData.get("message")?.trim() || "";

  const body = [
    `Nom: ${firstName} ${lastName}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const mailto = `mailto:semmaniserina@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
