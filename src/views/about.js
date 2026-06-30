export function renderAbout() {
  const app = document.querySelector("#app");
  
  app.innerHTML = `
    <section class="about">
      <div class="about__header">
        <span class="about__badge">El Proyecto</span>
        <h1 class="about__title">Sobre Dragon Ball AI</h1>
        <p class="about__description">
          Esta aplicación es una SPA (Single Page Application) desarrollada con JavaScript vanilla, diseñada para explorar las capacidades de la inteligencia artificial en entornos interactivos.
        </p>
      </div>
      
      <div class="about__grid">
        <div class="about__card">
          <div class="about__card-icon">⚡</div>
          <h3 class="about__card-title">Interconexión Z</h3>
          <p class="about__card-text">Conectada con la API de Gemini para simular la personalidad del guerrero más fuerte del universo.</p>
        </div>
        
        <div class="about__card">
          <div class="about__card-icon">🛡️</div>
          <h3 class="about__card-title">Entrenamiento Puro</h3>
          <p class="about__card-text">Diseñada para poner a prueba tu espíritu de pelea, recibir consejos de entrenamiento y superar tus límites.</p>
        </div>
      </div>
    </section>
  `;
}