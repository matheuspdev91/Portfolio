const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const toggle = document.querySelector("[data-menu-toggle]");

function syncHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setMenuState(isOpen) {
  if (!menu || !toggle || !header) return;

  menu.classList.toggle("is-open", isOpen);
  header.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("is-menu-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("is-open"));
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setMenuState(false);
    }
  });
}

const heroVideo = document.querySelector(".hero__video");


if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.playsInline = true;

  const playHero = () => {
    heroVideo.play()
      .then(() => {
        console.log("Hero iniciado");
      })
      .catch((error) => {
        console.error("Hero não iniciou:", error);
      });
  };

  if (heroVideo.readyState >= 2) {
    playHero();
  } else {
    heroVideo.addEventListener("loadeddata", playHero, { once: true });
  }
}

/* =========================================================
   MODALS (CASES)
   ========================================================= */

function setupModal(modalId, openAttr, closeAttr) {
  const modal = document.getElementById(modalId);
  const openBtns = document.querySelectorAll(`[${openAttr}]`);
  const closeBtns = document.querySelectorAll(`[${closeAttr}]`);

  if (!modal) return;

  const openModal = () => {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden"; // prevent background scroll
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  openBtns.forEach(btn => btn.addEventListener("click", openModal));
  closeBtns.forEach(btn => btn.addEventListener("click", closeModal));

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

setupModal("fitflix-modal", "data-fitflix-open", "data-fitflix-close");
setupModal("nutrix-modal", "data-nutrix-open", "data-nutrix-close");
setupModal("foundation-modal", "data-foundation-open", "data-foundation-close");
setupModal("foundation-design-modal", "data-foundation-design-open", "data-foundation-design-close");