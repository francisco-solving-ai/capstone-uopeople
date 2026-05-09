const WebSocket = require("ws");

const PORT = Number(process.env.WS_PORT || 8080);

/**
 * Creates and starts a basic WebSocket server.
 *
 * @param {number} [port=PORT] - Port to listen on.
 * @returns {WebSocket.Server} Running WebSocket server instance.
 */
function createWebSocketServer(port = PORT) {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (socket, request) => {
    const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    socket.send(
      JSON.stringify({
        type: "connection",
        clientId,
        message: "Connected to WebSocket server."
      })
    );

    socket.on("message", (rawMessage) => {
      const text = rawMessage.toString();
      let payload;

      try {
        payload = JSON.parse(text);
      } catch (error) {
        payload = { type: "text", message: text };
      }

      const outbound = JSON.stringify({
        type: "message",
        clientId,
        data: payload,
        timestamp: new Date().toISOString()
      });

      // Basic broadcast to all connected clients.
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(outbound);
        }
      });
    });

    socket.on("close", () => {
      console.log(`Client disconnected: ${clientId}`);
    });

    socket.on("error", (error) => {
      console.error(`Socket error (${clientId}):`, error.message);
    });

    const ip = request.socket.remoteAddress || "unknown";
    console.log(`Client connected: ${clientId} from ${ip}`);
  });

  wss.on("listening", () => {
    console.log(`WebSocket server running on ws://localhost:${port}`);
  });

  wss.on("error", (error) => {
    console.error("WebSocket server error:", error.message);
  });

  return wss;
}

if (require.main === module) {
  createWebSocketServer();
}

module.exports = { createWebSocketServer };
