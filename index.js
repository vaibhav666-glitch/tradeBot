import express from 'express';
import http from 'http';
import cors from 'cors'
import axios from 'axios'

const app=express();
const server=http.createServer(app);

app.listen(3200,()=>{
    console.log('server is running on port 3200')
})