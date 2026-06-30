import {
  renderLoadingState,
  renderEmptyState,
  renderErrorState,
  renderChatInterface
} from "./chatStates.js";

let chatState = {
  status: "loading",
  messages: [], // Almacena el historial completo para la interfaz de usuario
  isTyping: false
};

export function renderChat() {
  const app = document.querySelector("#app");

  switch (chatState.status) {
    case "loading":
      app.innerHTML = renderLoadingState();
      simulateDataFetching();
      break;
    case "empty":
      app.innerHTML = renderEmptyState();
      bindEmptyEvents();
      break;
    case "error":
      app.innerHTML = renderErrorState();
      bindErrorEvents();
      break;
    case "success":
      app.innerHTML = renderChatInterface(chatState.messages, chatState.isTyping);
      bindChatEvents(); 
      scrollToBottom();
      break;
  }
}

function simulateDataFetching() {
  setTimeout(() => {
    if (chatState.messages.length === 0) {
      chatState.status = "empty";
    } else {
      chatState.status = "success";
    }
    renderChat();
  }, 1500);
}

function bindChatEvents() {
  const form = document.querySelector(".chatComposer");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const input = form.querySelector(".chatInput");
    const text = input.value.trim();
    if (!text || chatState.isTyping) return;

    // 1. Insertar mensaje del usuario en la UI
    chatState.messages.push({ sender: "user", text });
    input.value = "";
    
    // 2. Activar estado de pensamiento y re-renderizar
    chatState.isTyping = true;
    renderChat(); 

    try {
      // 3. Obtener las últimas 6 preguntas con sus respuestas (máximo 12 mensajes previos)
      // Gemini espera el formato: { role: "user" | "model", parts: [{ text: "..." }] }
      const formattedHistory = chatState.messages
        .slice(0, -1) // Excluir el último mensaje recién agregado
        .slice(-12)   // Limitar a los últimos 12 mensajes (6 pares)
        .map(msg => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        }));

      // 4. Llamada asíncrona enviando mensaje actual e historial
      const response = await fetch("/api/gokuChat", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          history: formattedHistory
        })
      });
      
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const data = await response.json();

      // 5. Insertar respuesta de la IA
      chatState.messages.push({ 
        sender: "character", 
        text: data.reply 
      });
      
    } catch (error) {
      console.error(error);
      chatState.messages.push({ 
        sender: "character", 
        text: "¡Ups! Mi Ki se desestabilizó por un momento. ¿Podrías repetir eso?" 
      });
    } finally {
      // 6. Desactivar indicador de pensamiento y actualizar pantalla final
      chatState.isTyping = false;
      renderChat();

      const newInput = document.querySelector(".chatInput");
      if (newInput) {
        newInput.focus();
      }
    }
  });
}

function bindEmptyEvents() {
  const startBtn = document.getElementById("btn-start-chat");
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    chatState.status = "success";
    chatState.messages = [{ sender: "character", text: "¡Hola! Soy Goku. ¡Se ve que quieres volverte muy fuerte!" }];
    renderChat();
  });
}

function bindErrorEvents() {
  const retryBtn = document.getElementById("btn-retry");
  if (!retryBtn) return;

  retryBtn.addEventListener("click", () => {
    chatState.status = "loading";
    renderChat();
  });
}

function scrollToBottom() {
  const container = document.querySelector(".chatMessages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

window.setChatStatus = function (newStatus) {
  chatState.status = newStatus;
  if (newStatus === 'success' && chatState.messages.length === 0) {
    chatState.messages = [
      { sender: "character", text: "¡Hola! Soy Goku. ¡Se ve que quieres volverte más fuerte!" },
      { sender: "user", text: "Quiero practicar responsive con CSS puro." }
    ];
  }
  renderChat();
};