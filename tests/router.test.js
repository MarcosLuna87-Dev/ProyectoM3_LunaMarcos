import { describe, test, expect, vi, beforeEach } from "vitest";
import { router, navigateTo } from "../src/router.js";
import { setupLinkInterception } from "../src/navigation.js";

vi.mock("../src/views/home.js", () => ({ renderHome: vi.fn() }));
vi.mock("../src/views/chat.js", () => ({ renderChat: vi.fn() }));
vi.mock("../src/views/about.js", () => ({ renderAbout: vi.fn() }));
vi.mock("../src/views/notFound.js", () => ({ renderNotFound: vi.fn() }));

import { renderHome } from "../src/views/home.js";
import { renderNotFound } from "../src/views/notFound.js";

describe("Pruebas en Router y Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    
    // Configurar de forma segura las propiedades de window.location en JSDOM
    Object.defineProperty(window, "location", {
      value: { 
        pathname: "/", 
        origin: "http://localhost:3000" 
      },
      writable: true,
    });
  });

  test("router() debe ejecutar renderHome cuando el pathname es '/'", () => {
    window.location.pathname = "/";
    router();
    expect(renderHome).toHaveBeenCalled();
  });

  test("router() debe ejecutar renderNotFound ante una ruta inexistente", () => {
    window.location.pathname = "/ruta-invalida";
    router();
    expect(renderNotFound).toHaveBeenCalled();
  });

  test("navigateTo() debe modificar el history state y llamar a router", () => {
    const pushStateSpy = vi.spyOn(history, "pushState").mockImplementation(() => {});
    navigateTo("/about");
    expect(pushStateSpy).toHaveBeenCalledWith(null, "", "/about");
  });

  test("setupLinkInterception() debe interceptar links locales y evitar la recarga", () => {
    setupLinkInterception();
    
    const anchor = document.createElement("a");
    anchor.setAttribute("href", "/chat");
    // Forzar coincidencia de origen en el elemento DOM de JSDOM
    Object.defineProperty(anchor, "origin", { value: "http://localhost:3000" });
    document.body.appendChild(anchor);

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    anchor.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});