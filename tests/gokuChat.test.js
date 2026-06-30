import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import handler from "../api/gokuChat.js";

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("Pruebas en Serverless Function (gokuChat)", () => {
  let req, res;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, GEMINI_API_KEY: "mock-key-123" };

    req = {
      method: "POST",
      body: { message: "Hola", history: [] }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("Debe retornar 405 si el método no es POST", async () => {
    req.method = "GET";
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  test("Debe retornar 400 si no se provee un mensaje", async () => {
    req.body.message = "";
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Debe retornar 200 y responder con la estructura de Gemini", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "¡Hola! Soy Goku." }] } }]
      })
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ reply: "¡Hola! Soy Goku." });
  });
});