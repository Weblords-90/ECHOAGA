
let activeGenre = "All";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  filterBooks();
  setupScrollAnimations();

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAuth();
      closeMenu();
    }
  });
});

function closeMenu() {
  const nav = document.getElementById("nav");
  if (nav) nav.style.display = "none";
}

function toggleMenu() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  nav.style.display =
    nav.style.display === "flex" ? "none" : "flex";
}

function setFilter(genre, button) {
  activeGenre = genre;

  document.querySelectorAll(".filter").forEach(item => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });

  if (button) {
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
  }

  filterBooks();
}

function filterBooks() {
  const search = document.getElementById("search");
  const books = document.querySelectorAll(".book");
  const empty = document.getElementById("empty");
  const query = search ? search.value.toLowerCase().trim() : "";

  let visibleCount = 0;

  books.forEach(book => {
    const genre = (book.dataset.genre || "").toLowerCase();
    const name = (
      (book.dataset.name || "") + " " + book.textContent
    ).toLowerCase();

    const genreMatch =
      activeGenre === "All" ||
      genre === activeGenre.toLowerCase();

    const searchMatch = name.includes(query);
    const visible = genreMatch && searchMatch;

    book.style.display = visible ? "" : "none";

    if (visible) visibleCount++;
  });

  if (empty) {
    empty.style.display = visibleCount === 0 ? "block" : "none";
  }
}

function selectBook(title, genre) {
  const player = document.getElementById("player");
  const playerTitle = document.getElementById("playerTitle");
  const playerGenre = document.getElementById("playerGenre");

  if (playerTitle) playerTitle.textContent = title;
  if (playerGenre) playerGenre.textContent = genre;
  if (player) player.style.display = "flex";
}

function closePlayer() {
  const player = document.getElementById("player");
  if (player) player.style.display = "none";
}

function openAuth() {
  const overlay = document.getElementById("authOverlay");
  if (!overlay) return;

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  clearAuthMessage();
}

function closeAuth() {
  const overlay = document.getElementById("authOverlay");
  if (!overlay) return;

  overlay.style.display = "none";
  document.body.style.overflow = "";
  clearAuthMessage();
}

function overlayClose(event) {
  if (event.target && event.target.id === "authOverlay") {
    closeAuth();
  }
}

function switchAuth(mode) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const heading = document.getElementById("authHeading");

  const isLogin = mode === "login";

  if (loginForm) loginForm.style.display = isLogin ? "block" : "none";
  if (signupForm) signupForm.style.display = isLogin ? "none" : "block";

  if (loginTab) {
    loginTab.classList.toggle("active", isLogin);
    loginTab.setAttribute("aria-selected", String(isLogin));
  }

  if (signupTab) {
    signupTab.classList.toggle("active", !isLogin);
    signupTab.setAttribute("aria-selected", String(!isLogin));
  }

  if (heading) {
    heading.textContent = isLogin ? "Welcome Back" : "Create Your Account";
  }

  clearAuthMessage();
}

function togglePassword(id) {
  const field = document.getElementById(id);
  if (!field) return;

  field.type = field.type === "password" ? "text" : "password";
}

function showAuthMessage(message, type = "error") {
  const element = document.getElementById("authMessage");
  if (!element) return;

  element.textContent = message;
  element.style.display = "block";
  element.style.color =
    type === "success" ? "#1ed760" : "#ff8585";
}

function clearAuthMessage() {
  const element = document.getElementById("authMessage");
  if (!element) return;

  element.textContent = "";
  element.style.display = "none";
}

function friendlyError(error) {
  const code = error?.code || "";

  const messages = {
    "auth/email-already-in-use": "This email already has an account. Please sign in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Your password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-login-credentials": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/popup-closed-by-user": "The sign-in window was closed.",
    "auth/unauthorized-domain": "This website domain is not authorized in Firebase.",
    "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase.",
    "auth/account-exists-with-different-credential": "An account already exists with another sign-in method."
  };

  return messages[code] || error?.message || "Something went wrong. Please try again.";
}

function setBusy(button, busy, text) {
  if (typeof button === "string") {
    button = document.getElementById(button);
  }

  if (!button) return;

  if (busy) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    if (text) button.textContent = text;
  } else {
    button.disabled = false;
    button.textContent =
      button.dataset.originalText || button.textContent;
    delete button.dataset.originalText;
  }
}

function setupScrollAnimations() {
  const style = document.createElement("style");

  style.textContent = `
    .scroll-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .7s ease, transform .7s ease;
    }
    .scroll-reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .scroll-reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);

  const elements = document.querySelectorAll(
    ".section-head, .section-heading, .featured, .benefit, .experience-card"
  );

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach(element => {
    element.classList.add("scroll-reveal");
    observer.observe(element);
  });
}

window.setFilter = setFilter;
window.filterBooks = filterBooks;
window.selectBook = selectBook;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.overlayClose = overlayClose;
window.switchAuth = switchAuth;
window.togglePassword = togglePassword;
window.showAuthMessage = showAuthMessage;
window.clearAuthMessage = clearAuthMessage;
window.friendlyError = friendlyError;
window.setBusy = setBusy;
window.closeMenu = closeMenu;
window.toggleMenu = toggleMenu;
window.closePlayer = closePlayer;
