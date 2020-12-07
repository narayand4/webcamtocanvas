const express = require('express')
const next = require('next')
const cors = require('cors')
const rp = require('request-promise')
const WebSocket = require('ws')

const port = process.env.PORT || 3000
const WS_PORT = process.env.WS_PORT || 3001;

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));
let connectedClients = [];
wsServer.on('connection', (ws, req) => {
    connectedClients.push(ws);
    ws.on('message', data => {
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(data);
            } else {
                connectedClients.splice(i, 1);
            }
        });
    });
});

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

    ; (async () => {
        await app.prepare()
        const server = express()
        server.use(cors())

        server.get('*', (req, res) => handle(req, res))

        await server.listen(port)
        console.log(`> Ready on custom server.js http://localhost:${port}`) // eslint-disable-line no-console
    })()