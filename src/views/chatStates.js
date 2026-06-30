export function renderLoadingState() {
  return `
    <section class="about">
      <div class="about__header">
        <span class="about__badge">Elevando Ki</span>
        <h1 class="about__title">Conectando...</h1>
        <p class="about__description">Cargando la cámara de gravedad para iniciar el chat con Goku.</p>
      </div>
      <div class="hero__visual">
        <div class="hero__avatar-placeholder">悟</div>
      </div>
    </section>
  `;
}

export function renderEmptyState() {
  return `
    <section class="about">
      <div class="about__header">
        <span class="about__badge">Historial Vacío</span>
        <h1 class="about__title">¡Sin rivales a la vista!</h1>
        <p class="about__description">No hay mensajes previos en el radar del dragón. ¡Inicia tu entrenamiento ahora!</p>
        <button class="hero__btn" id="btn-start-chat">Hablar con Goku</button>
      </div>
    </section>
  `;
}

export function renderErrorState() {
  return `
    <section class="error-page">
      <div class="error-page__content">
        <h1 class="error-page__code">¡UPS!</h1>
        <h2 class="error-page__title">Se cortó la señal</h2>
        <p class="error-page__description">Hubo un problema de conexión con el servidor en el planeta de Kaiosama.</p>
        <button class="error-page__btn" id="btn-retry">Reintentar Conexión</button>
      </div>
    </section>
  `;
}

export function renderTypingIndicator() {
  return `
    <div class="message message--character message--typing">
      <span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span> Goku está concentrando su Ki (pensando)
    </div>
  `;
}

export function renderChatInterface(messages, isTyping = false) {
  const messagesHTML = messages.map(msg => `
    <div class="message message--${msg.sender}">
      ${msg.text}
    </div>
  `).join('');

  // Si está pensando, sumamos el indicador visual al final del contenedor de mensajes
  const typingHTML = isTyping ? renderTypingIndicator() : '';

  return `
    <div class="chatApp">
      <header class="chatHeader">
        <h1 class="chatTitle">Goku Chat</h1>
        <p class="chatSubtitle">Entrenando con el guerrero más fuerte del universo</p>
      </header>
      <main class="chatMessages" aria-label="Mensajes del chat">
        ${messagesHTML}
        ${typingHTML}
      </main>
      <form class="chatComposer">
        <input 
          class="chatInput" 
          type="text" 
          placeholder="Escribe un mensaje a Goku..."
          aria-label="Escribe tu mensaje"
          required
          ${isTyping ? 'disabled' : ''}  /* Deshabilitar input mientras piensa */
        />
        <button class="chatSend" type="submit" ${isTyping ? 'disabled' : ''}>Enviar</button>
      </form>
    </div>
  `;
}