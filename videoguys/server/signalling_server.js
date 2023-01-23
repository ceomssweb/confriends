const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8081}, () => {
  console.log("Signalling server is now lisiting on port 8081");
});

wss.broadcast = (wss, data) => {
  wss.client.forEach((client) => {
    if(client !== wss && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  })
}

wss.on('connection', ws => {
  console.log('Client connected, Total connected clients: $(wss.clients.size)');

  ws.on('message', message => {
    console.log(message + "\n\n");
    wss.broadcast(ws, message);
  })
  ws.on('close', wss => {
    console.log('Client disconnected. Total connected clients: $(wss.clients.size)');

  })
  ws.on('error', wss => {
    console.log('Client error. Total connected clients: $(wss.clients.size)');

  })
})
