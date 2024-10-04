import express from 'express';
import http from 'http';
import cors from 'cors'
import axios from 'axios'
import { Server } from 'socket.io';

const app=express();
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
    }
})



//connecting server and client  for real time communication using socket.io which uses websocket protocol
io.on('connection',(socket)=>{
    console.log('a user connected');

    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    })
})

app.listen(3200,()=>{
    console.log('server is running on port 3200')
})