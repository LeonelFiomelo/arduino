const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const { parse } = require('path')

// SERVER

const app = express()

const server = http.createServer(app)

const ioServer = new Server(server)

const PORT = process.env.PORT || 8000

let arduinoData

app.get('/data', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader("Content-Type", "application/json");
    res.send(arduinoData);
});

ioServer.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(PORT, () => {
    console.log('listening on *:8000');
});

// ARDUINO

const serialport = new SerialPort({
    path: 'COM4',
    baudRate: 9600,
})

const parser = new ReadlineParser()

serialport.pipe(parser)

serialport.on('error', err => console.log(err))

parser.on('open', () => console.log('Connection is opened'))

parser.on('data', data => {
    const newData = {
        volts: parseFloat(data)
    }
    console.log(newData)
    arduinoData = newData
})