const page = document.body.dataset.page;
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const yearNode = document.getElementById("year");
let audioContext;
let uiSoundEnabled = true;

function updateHeaderState() {
  document.body.classList.toggle("is-scrolled", window.scrollY > 18);
}

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

function ensureAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return null;
  }

  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({
  frequency = 440,
  type = "sine",
  duration = 0.12,
  volume = 0.03,
  endFrequency = frequency
} = {}) {
  if (!uiSoundEnabled) {
    return;
  }

  const context = ensureAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 1), now + duration);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function setupUISounds() {
  document.querySelectorAll(".btn, .switch-pill, .project-link, .nav-links a, .menu-links a, .logo").forEach((node) => {
    node.addEventListener("click", () => {
      playTone({
        frequency: page === "game" ? 480 : 360,
        endFrequency: page === "game" ? 620 : 420,
        type: page === "game" ? "triangle" : "sine",
        duration: 0.08,
        volume: 0.015
      });
    });
  });
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

function renderImages(content) {
  document.querySelectorAll("[data-image-field]").forEach((node) => {
    const field = node.dataset.imageField;
    const altField = node.dataset.altField;

    if (content[field]) {
      node.setAttribute("src", content[field]);
    }

    if (altField && content[altField]) {
      node.setAttribute("alt", content[altField]);
    }
  });
}

function renderLinks(content) {
  document.querySelectorAll("[data-link-field]").forEach((node) => {
    const field = node.dataset.linkField;
    const labelField = node.dataset.linkLabelField;

    if (content[field]) {
      node.setAttribute("href", content[field]);
    }

    if (labelField && content[labelField]) {
      node.textContent = content[labelField];
    }
  });
}

function renderMeta(content) {
  if (content.page_title) {
    document.title = content.page_title;
  }

  const description = document.querySelector('meta[name="description"]');
  if (description && content.page_description) {
    description.setAttribute("content", content.page_description);
  }
}

function initMiniGame() {
  const canvas = document.getElementById("play-canvas");
  const startButton = document.getElementById("play-start");
  const soundButton = document.getElementById("play-sound");
  const leftButton = document.getElementById("play-left");
  const rightButton = document.getElementById("play-right");
  const overlay = document.getElementById("play-overlay");
  const scoreNode = document.getElementById("play-score");
  const bestNode = document.getElementById("play-best");
  const livesNode = document.getElementById("play-lives");

  if (!canvas || !startButton || !soundButton || !leftButton || !rightButton || !overlay || !scoreNode || !bestNode || !livesNode) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const storageKey = "hk-spark-rush-best";
  const state = {
    running: false,
    score: 0,
    lives: 3,
    best: 0,
    lastTime: 0,
    spawnTimer: 0,
    speed: 220,
    pointerX: 0.5,
    moveLeft: false,
    moveRight: false,
    dragging: false,
    sparks: [],
    particles: [],
    catcher: {
      x: 0,
      y: 0,
      width: 120,
      height: 18
    }
  };

  try {
    state.best = Number(window.localStorage.getItem(storageKey) || 0);
  } catch {
    state.best = 0;
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, Math.round(rect.width * ratio));
    canvas.height = Math.round((canvas.width / 19) * 10.5);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(ratio, ratio);
    state.catcher.width = Math.max(88, rect.width * 0.18);
    state.catcher.height = Math.max(16, rect.width * 0.025);
    state.catcher.y = canvas.height / ratio - 44;
    state.catcher.x = rect.width * 0.5 - state.catcher.width * 0.5;
  }

  function setOverlay(title, message) {
    overlay.innerHTML = `
      <p class="play-overlay-title">${title}</p>
      <p class="play-overlay-text">${message}</p>
    `;
  }

  function syncStats() {
    scoreNode.textContent = String(state.score);
    bestNode.textContent = String(state.best);
    livesNode.textContent = String(state.lives);
  }

  function resetRun() {
    state.running = true;
    state.score = 0;
    state.lives = 3;
    state.spawnTimer = 0;
    state.speed = 220;
    state.sparks = [];
    state.particles = [];
    state.lastTime = 0;
    startButton.textContent = "Restart Game";
    overlay.classList.add("is-hidden");
    syncStats();
  }

  function endRun() {
    state.running = false;
    if (state.score > state.best) {
      state.best = state.score;
      try {
        window.localStorage.setItem(storageKey, String(state.best));
      } catch {
        // Ignore storage failures.
      }
    }
    syncStats();
    setOverlay("Run Over", `You caught ${state.score} spark${state.score === 1 ? "" : "s"}. Hit restart and go again.`);
    overlay.classList.remove("is-hidden");
    playTone({
      frequency: 260,
      endFrequency: 90,
      type: "sawtooth",
      duration: 0.24,
      volume: 0.045
    });
  }

  function spawnSpark() {
    const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const size = 12 + Math.random() * 12;
    state.sparks.push({
      x: 18 + Math.random() * Math.max(width - 36, 10),
      y: -size,
      radius: size,
      speed: state.speed * (0.8 + Math.random() * 0.45),
      drift: (Math.random() - 0.5) * 42,
      hue: 32 + Math.random() * 42
    });
  }

  function addBurst(x, y, hue) {
    for (let i = 0; i < 10; i += 1) {
      state.particles.push({
        x,
        y,
        life: 0.55 + Math.random() * 0.25,
        age: 0,
        vx: (Math.random() - 0.5) * 160,
        vy: -20 - Math.random() * 140,
        size: 3 + Math.random() * 4,
        hue
      });
    }
  }

  function updateCatcher(delta, width) {
    const targetX = state.pointerX * width - state.catcher.width * 0.5;
    const keyboardSpeed = 460 * delta;
    let nextX = state.catcher.x;

    if (state.moveLeft) {
      nextX -= keyboardSpeed;
    }
    if (state.moveRight) {
      nextX += keyboardSpeed;
    }

    if (!state.moveLeft && !state.moveRight) {
      nextX = state.catcher.x + (targetX - state.catcher.x) * Math.min(delta * 10, 1);
    }

    state.catcher.x = Math.max(0, Math.min(width - state.catcher.width, nextX));
  }

  function updateGame(delta) {
    const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
    updateCatcher(delta, width);

    if (!state.running) {
      return;
    }

    state.spawnTimer -= delta;
    if (state.spawnTimer <= 0) {
      spawnSpark();
      state.spawnTimer = Math.max(0.22, 0.9 - state.score * 0.018);
    }

    state.speed = Math.min(520, 220 + state.score * 9);

    state.sparks = state.sparks.filter((spark) => {
      spark.y += spark.speed * delta;
      spark.x += spark.drift * delta;

      const caught =
        spark.y + spark.radius >= state.catcher.y &&
        spark.y - spark.radius <= state.catcher.y + state.catcher.height &&
        spark.x >= state.catcher.x &&
        spark.x <= state.catcher.x + state.catcher.width;

      if (caught) {
        state.score += 1;
        if (state.score > state.best) {
          state.best = state.score;
        }
        syncStats();
        addBurst(spark.x, spark.y, spark.hue);
        playTone({
          frequency: 420 + state.score * 8,
          endFrequency: 720 + state.score * 10,
          type: "triangle",
          duration: 0.11,
          volume: 0.03
        });
        return false;
      }

      if (spark.y - spark.radius > height) {
        state.lives -= 1;
        syncStats();
        playTone({
          frequency: 240,
          endFrequency: 120,
          type: "square",
          duration: 0.14,
          volume: 0.032
        });
        if (state.lives <= 0) {
          endRun();
        }
        return false;
      }

      return true;
    });

    state.particles = state.particles.filter((particle) => {
      particle.age += delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 260 * delta;
      return particle.age < particle.life;
    });
  }

  function drawBackground(width, height) {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#2f143f");
    gradient.addColorStop(0.55, "#20102f");
    gradient.addColorStop(1, "#120a1c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    for (let index = 0; index < 12; index += 1) {
      const x = (width / 11) * index + ((index % 2) * width) / 22;
      const y = 28 + ((index * 29) % 120);
      context.fillStyle = "rgba(255, 237, 191, 0.08)";
      context.beginPath();
      context.arc(x, y, 2 + (index % 3), 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawGame() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;

    drawBackground(width, height);

    context.fillStyle = "rgba(255, 186, 112, 0.12)";
    context.fillRect(0, height - 78, width, 78);

    state.particles.forEach((particle) => {
      const alpha = 1 - particle.age / particle.life;
      context.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${alpha})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      context.fill();
    });

    state.sparks.forEach((spark) => {
      const glow = context.createRadialGradient(spark.x, spark.y, 2, spark.x, spark.y, spark.radius * 2.6);
      glow.addColorStop(0, `hsla(${spark.hue}, 100%, 72%, 0.95)`);
      glow.addColorStop(0.35, `hsla(${spark.hue}, 100%, 64%, 0.7)`);
      glow.addColorStop(1, `hsla(${spark.hue}, 100%, 58%, 0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(spark.x, spark.y, spark.radius * 2.6, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#fff3cb";
      context.beginPath();
      context.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
      context.fill();
    });

    const paddleGradient = context.createLinearGradient(
      state.catcher.x,
      state.catcher.y,
      state.catcher.x + state.catcher.width,
      state.catcher.y + state.catcher.height
    );
    paddleGradient.addColorStop(0, "#ffbf71");
    paddleGradient.addColorStop(1, "#7fd3cc");
    context.fillStyle = paddleGradient;
    context.beginPath();
    context.roundRect(state.catcher.x, state.catcher.y, state.catcher.width, state.catcher.height, 16);
    context.fill();

    context.fillStyle = "rgba(255, 255, 255, 0.24)";
    context.beginPath();
    context.roundRect(state.catcher.x + 10, state.catcher.y + 4, state.catcher.width - 20, 5, 16);
    context.fill();
  }

  function loop(timestamp) {
    const delta = Math.min((timestamp - state.lastTime) / 1000 || 0, 0.032);
    state.lastTime = timestamp;
    updateGame(delta);
    drawGame();
    window.requestAnimationFrame(loop);
  }

  function updatePointer(clientX) {
    const rect = canvas.getBoundingClientRect();
    state.pointerX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function setMoveDirection(direction, isActive) {
    if (direction === "left") {
      state.moveLeft = isActive;
    }
    if (direction === "right") {
      state.moveRight = isActive;
    }
  }

  startButton.addEventListener("click", () => {
    ensureAudioContext();
    resetRun();
    playTone({
      frequency: 340,
      endFrequency: 520,
      type: "triangle",
      duration: 0.12,
      volume: 0.03
    });
  });

  soundButton.addEventListener("click", () => {
    uiSoundEnabled = !uiSoundEnabled;
    soundButton.textContent = uiSoundEnabled ? "Sound On" : "Sound Off";
    soundButton.setAttribute("aria-pressed", String(uiSoundEnabled));

    if (uiSoundEnabled) {
      playTone({
        frequency: 380,
        endFrequency: 580,
        type: "sine",
        duration: 0.08,
        volume: 0.02
      });
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && !state.dragging) {
      return;
    }

    updatePointer(event.clientX);
  });

  canvas.addEventListener("pointerdown", (event) => {
    ensureAudioContext();
    state.dragging = true;
    updatePointer(event.clientX);
    if (!state.running) {
      resetRun();
    }
  });

  canvas.addEventListener("pointerup", () => {
    state.dragging = false;
  });

  canvas.addEventListener("pointerleave", () => {
    state.dragging = false;
  });

  canvas.addEventListener("pointercancel", () => {
    state.dragging = false;
  });

  [
    { node: leftButton, direction: "left" },
    { node: rightButton, direction: "right" }
  ].forEach(({ node, direction }) => {
    node.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      ensureAudioContext();
      setMoveDirection(direction, true);
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
      node.addEventListener(eventName, () => {
        setMoveDirection(direction, false);
      });
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      setMoveDirection("left", true);
    }
    if (event.key === "ArrowRight") {
      setMoveDirection("right", true);
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      setMoveDirection("left", false);
    }
    if (event.key === "ArrowRight") {
      setMoveDirection("right", false);
    }
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  syncStats();
  setOverlay("Catch The Sparks", "Use your mouse, finger, or arrow keys to keep the sparks alive.");
  window.requestAnimationFrame(loop);
}

async function loadContent() {
  const response = await fetch("content/site-content.json");
  const siteContent = await response.json();
  const content = siteContent[page];

  if (!content) {
    return;
  }

  renderMeta(content);
  renderFields(content);
  renderImages(content);
  renderLinks(content);

  if (page === "home") {
    return;
  }

  renderProjects(content.projects);
  renderSkills(content.skills);
  renderContact(siteContent.shared);

  if (page === "game") {
    initMiniGame();
  }
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

window.addEventListener("scroll", updateHeaderState, { passive: true });

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

updateHeaderState();
setupUISounds();

loadContent().catch(() => {
  console.error("Content could not be loaded. Serve the site through a local server or GitHub Pages.");
});
