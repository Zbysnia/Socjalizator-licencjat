const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//const logger = require('morgan');

const app = express();

app.use(cors());

const dbConfig = require('./config/secret');
//socket
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
//Routes
const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const followers = require('./routes/followersRoutes');
const photos = require('./routes/photosRoutes');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true,limit: '50mb'}));
app.use(cookieParser());
//app.use(logger('dev'));
//mongo polaczenie
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url,
{ 
    useNewUrlParser: true ,
    useUnifiedTopology: true 
});

require('./socket/streams')(io);

app.use('/api/socjalizator',auth);
app.use('/api/socjalizator',posts);
app.use('/api/socjalizator',users);
app.use('/api/socjalizator',followers);
app.use('/api/socjalizator', photos);

//server zamiast app przez socekt.io
server.listen(3000, ()=>{
    console.log('Running on port 3000');
});