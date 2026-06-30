import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock sincronizado con los textos e IDs reales de tu aplicación
vi.mock("../src/chatStates.js", () => ({
  renderLoadingState: () => `
    <section class="about">
      <h1 class="about__title">Conectando...</h1>
    </section>
  `,
  renderEmptyState: () => `
    <section class="about">
      <button class="hero__btn" id="btn-start-chat">Hablar con Goku</button>
    </section>
  `,
  renderErrorState: () => '<button id="btn-retry">Reintentar</button>',
  renderChatInterface: () => `
    <div class="chatMessages"></div>
    <form class="chatComposer">
      <input class="chatInput" />
    </form>
  `,
}));

// Declaración del mock global para fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

import { renderChat } from "../src/views/chat.js";

describe("Pruebas en Vista de Chat", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  test("Debe renderizar estado inicial loading y pasar a empty tras el timeout", () => {
    window.setChatStatus("loading");
    
    const app = document.getElementById("app");
    expect(app.innerHTML).toContain("Conectando...");

    vi.advanceTimersByTime(1500); 
    
    expect(app.innerHTML).toContain("Hablar con Goku");
  });

  test("Debe enviar el mensaje e invocar a la Serverless Function", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "¡Hola, soy Goku!" }),
    });

    window.setChatStatus("success");
    
    const form = document.querySelector(".chatComposer");
    const input = form.querySelector(".chatInput");
    input.value = "Hola Goku"; 

    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledWith("/api/gokuChat", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: "Hola Goku", 
        history: [
          { role: "model", parts: [{ text: "¡Hola! Soy Goku. ¡Se ve que quieres volverte más fuerte!" }] },
          { role: "user", parts: [{ text: "Quiero practicar responsive con CSS puro." }] }
        ] 
      })
    }));
  });
});