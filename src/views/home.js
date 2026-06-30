import { navigateTo } from "../router.js";

export function renderHome() {
  const app = document.querySelector("#app");
  
  app.innerHTML = `
    <section class="hero">
      <div class="hero__content">
        <span class="hero__badge">Dragon Ball AI</span>
        <h1 class="hero__title">Entrena con el Saiyajin más fuerte</h1>
        <p class="hero__description">
          Conversa en tiempo real con Goku, recibe consejos de entrenamiento y pon a prueba tu espítiru de pelea a través de inteligencia artificial.
        </p>
        <button id="btn-hero-start" class="hero__btn">Iniciar Chat</button>
      </div>
      <div class="hero__visual">
        <div class="hero__avatar-placeholder">悟空</div>
      </div>
    </section>
  `;

  // Vinculación del botón para mantener la navegación SPA
  const startBtn = document.getElementById("btn-hero-start");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      navigateTo("/chat");
    });
  }
}