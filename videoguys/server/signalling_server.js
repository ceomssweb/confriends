const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8081}, () => {
  console.log("Signalling server is now lisiting on port 8081");
});

wss.broadcast = function broadcast(ws, data) {
 // console.log(ws.clients);
  ws.clients.forEach((client) => {
     if (client.readyState === WebSocket.OPEN) {
       client.send(data);
     }
   });
};

wss.on('connection', ws => {
  console.log('Client connected, Total connected clients:' + wss.clients.size);

  ws.on('message', data => {
    const message = data.toString();
    wss.broadcast(wss, message);
  })

  ws.on('close', wss => {
      console.log('Client disconnected.');
  })

  ws.on('error', wss => {
    console.log('Client error. Total connected clients:' + wss.clients.size);

  })
});
