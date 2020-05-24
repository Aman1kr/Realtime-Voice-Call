const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom} = require('./user.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join',({name,room}, callback) =>{
        const{ error, user} = addUser({id: socket.id, name, room});

        if(error) return callback(error);
        
        socket.emit('message',{user:'admin', text:`${user.name}, welcome to te room ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user:'admin', text: `${user.name}, has joined!`});

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

        callback();
    });

    socket.on('offerOrAnswer', (data) => {
        // console.log("user " +data.playload+" d "+data.socketRN)
        // send to the other peer(s) if any
        //console.log(io.sockets.manager.roomClients[data.socketId])
        socket.broadcast.emit('offerOrAnswer', {sdp: data.payload, user: data.socketRN})

    })

    socket.on('candidate', (data) => {
        // send candidate to the other peer(s) if any
        socket.broadcast.emit('candidate', data.payload)

      })

    socket.on('sendMessage', (message, callback) =>{
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message',{user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})
        
        callback();
    });

    socket.on('imgUpload', (imgResult) =>{
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message',{user: user.name, text: imgResult});

        //console.log(imgResult);
        
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',{ user: 'admin', text: `${user.name} has left.`})
        }
    });
})

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server as Started on port ${PORT}`));