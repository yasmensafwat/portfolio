const icons = {
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m7-7-7 7-7-7"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21S3 15.5 3 8.9C3 3.8 8.9 2.4 12 7c3.1-4.6 9-3.2 9 1.9C21 15.5 12 21 12 21Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m8 9-4 3 4 3m8-6 4 3-4 3m-3-9-2 12"/></svg>',
  sparkle:
    '<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 6C48 35 35 48 6 50c29 2 42 15 44 44 2-29 15-42 44-44-29-2-42-15-44-44Z"/></svg>',
  flower:
    '<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 36C17-13 3 45 35 50-13 82 45 97 50 65c32 48 47-10 15-15 48-32-10-47-15-14Z"/><circle cx="50" cy="50" r="10" fill="#fff"/></svg>',
};

const doodle = (kind) =>
  kind === "heart"
    ? icons.heart
    : kind === "flower"
      ? icons.flower
      : kind === "sparkle"
        ? icons.sparkle
        : kind === "star"
          ? '<svg viewBox="0 0 100 100" fill="currentColor"><path d="m50 8 12 26 29 5-21 21 4 30-24-14-24 14 4-30L9 39l29-5Z"/></svg>'
          : '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><path d="M48 45C15 2 1 25 13 43c7 10 26 8 35 2m4 0C85 2 99 25 87 43c-7 10-26 8-35 2M46 49C41 65 32 77 19 83m35-34c5 16 14 28 27 34"/><ellipse cx="50" cy="46" rx="7" ry="9" fill="currentColor"/></svg>';

const icon = (name) => icons[name] || icons.code;

const sourceProjects = () => [...document.querySelectorAll(".project-source")];

function renderProjects(category = "") {
  const grid = document.querySelector(".project-grid");

  grid.classList.add("is-changing");

  window.setTimeout(
    () => {
      grid.replaceChildren(
        ...sourceProjects()
          .filter((source) => !category || source.dataset.category === category)
          .map((source) => {
            const card = source.cloneNode(true);
            card.classList.remove("project-source");
            card.classList.add("project-card");
            card.dataset.project = source.dataset.name;
            card
              .querySelectorAll(".doodle-icon")
              .forEach((el) => (el.innerHTML = doodle(el.dataset.kind)));
            card
              .querySelectorAll("[data-icon]")
              .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
            return card;
          }),
      );
      grid.classList.remove("is-changing");
    },
    grid.children.length ? 180 : 0,
  );
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".doodle-icon").forEach((el) => {
    el.innerHTML = doodle(el.dataset.kind || "sparkle");
  });
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
  const toggle = document.querySelector(".mobile-menu-toggle"),
    nav = document.querySelector(".desktop-nav");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("menu-open"));
    toggle.innerHTML = nav.classList.contains("menu-open") ? icon("x") : "☰";
  });
  nav
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("menu-open")),
    );
  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("selected"));
      tab.classList.add("selected");
      renderProjects(tab.dataset.category);
    }),
  );
  renderProjects(document.querySelector(".tab.selected").dataset.category);
  document.querySelector("#copy-email").addEventListener("click", async (e) => {
    const email = document.body.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      e.currentTarget.innerHTML = `${e.currentTarget.dataset.copiedLabel} ${icon("heart")}`;
      setTimeout(
        () =>
          (e.currentTarget.innerHTML = `${e.currentTarget.dataset.defaultLabel} ${icon("code")}`),
        2500,
      );
    } catch {
      location.href = `mailto:${email}`;
    }
  });
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
});
