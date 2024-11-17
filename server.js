const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast function to send data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a message to the client when they connect
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

  // Listen for incoming messages from Django server (e.g., latitude and longitude)
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message); // Parse the incoming message (expected to be JSON)
      
      // Check if the data contains latitude and longitude
      if (data.latitude && data.longitude) {
        console.log(`Received GPS data: Latitude = ${data.latitude}, Longitude = ${data.longitude}`);
        
        // Broadcast received data to all connected clients
        broadcast({
          latitude: data.latitude,
          longitude: data.longitude
        });
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
