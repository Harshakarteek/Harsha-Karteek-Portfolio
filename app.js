const page = document.body.dataset.page;
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const yearNode = document.getElementById("year");

function toggleMenu(forceOpen) {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  const nextState =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !mobileMenu.classList.contains("is-open");

  mobileMenu.classList.toggle("is-open", nextState);
  menuToggle.classList.toggle("is-open", nextState);
  menuToggle.setAttribute("aria-expanded", String(nextState));
}

function renderContact(shared) {
  const card = document.getElementById("contact-card");

  if (!card) {
    return;
  }

  card.innerHTML = `
    <h3>Direct links</h3>
    <ul class="contact-list">
      <li>
        <img src="Assets/email.png" alt="" class="contact-icon" />
        <a href="mailto:${shared.contact.email}">${shared.contact.email}</a>
      </li>
      <li>
        <img src="Assets/github.png" alt="" class="contact-icon" />
        <a href="${shared.contact.github}" target="_blank" rel="noreferrer">GitHub</a>
      </li>
      <li>
        <img src="Assets/linkedin.png" alt="" class="contact-icon" />
        <span>${shared.contact.linkedinLabel}</span>
      </li>
      <li>
        <img src="Assets/experience.png" alt="" class="contact-icon" />
        <a href="${shared.contact.resume}" target="_blank" rel="noreferrer">Resume PDF</a>
      </li>
      <li>
        <img src="Assets/checkmark.png" alt="" class="contact-icon" />
        <a href="${shared.contact.itch}" target="_blank" rel="noreferrer">itch.io profile</a>
      </li>
    </ul>
  `;
}

function renderProjects(projects) {
  const grid = document.getElementById("project-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card reveal is-visible">
          <div class="project-cover">
            <img src="${project.image}" alt="${project.title} artwork" />
          </div>
          <div class="project-body">
            <span class="project-badge">${page}</span>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <p><strong>Role:</strong> ${project.role}</p>
            <div class="project-stack">
              ${project.stack.map((item) => `<span>${item}</span>`).join("")}
            </div>
            <div class="project-links">
              ${
                project.githubUrl
                  ? `<a class="project-link" href="${project.githubUrl}" target="_blank" rel="noreferrer">GitHub</a>`
                  : ""
              }
              ${
                project.liveUrl
                  ? `<a class="project-link secondary" href="${project.liveUrl}" target="_blank" rel="noreferrer">${
                      page === "game" ? "Play / Download" : "Open"
                    }</a>`
                  : '<span class="project-link secondary">More updates coming</span>'
              }
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSkills(skills) {
  const grid = document.getElementById("skills-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = skills
    .map(
      (skill) => `
        <article class="skill-column reveal is-visible">
          <h3>${skill.title}</h3>
          <ul>
            ${skill.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderFields(content) {
  document.querySelectorAll("[data-field]").forEach((node) => {
    const field = node.dataset.field;
    if (content[field]) {
      node.textContent = content[field];
    }
  });
}

async function loadContent() {
  if (page === "home") {
    return;
  }

  const response = await fetch("content/site-content.json");
  const siteContent = await response.json();
  const content = siteContent[page];

  renderFields(content);
  renderProjects(content.projects);
  renderSkills(content.skills);
  renderContact(siteContent.shared);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => toggleMenu());
}

document.querySelectorAll(".menu-links a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

document.addEventListener("click", (event) => {
  if (!mobileMenu || !mobileMenu.classList.contains("is-open")) {
    return;
  }

  const clickedInsideMenu = mobileMenu.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    toggleMenu(false);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

loadContent().catch(() => {
  console.error("Content could not be loaded. Serve the site through a local server or GitHub Pages.");
});
