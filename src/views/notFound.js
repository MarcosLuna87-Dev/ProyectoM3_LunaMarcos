import { navigateTo } from "../router.js";

export function renderNotFound() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <section class="error-page">
      <div class="error-page__content">
        <h1 class="error-page__code">404</h1>
        <h2 class="error-page__title">¡Página perdida en el espacio!</h2>
        <p class="error-page__description">
          La ruta "${window.location.pathname}" no existe en este planeta. Tal vez fue destruida por un ataque de Freezer.
        </p>
        <button id="btn-404-home" class="error-page__btn">Volver al Inicio</button>
      </div>
    </section>
  `;

  const homeBtn = document.getElementById("btn-404-home");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      navigateTo("/");
    });
  }
}