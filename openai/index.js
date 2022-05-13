
const express = require('express');
const openai = require('../middlewares/openai');
const { 
	initMiddleware,
	creditCheck,
	contentFilterCheck,
	sendResponse,
	creditPayment,
	saveToHistory,
}  = require('./middleware');

let app = express.Router()

app.use('/', initMiddleware, creditCheck); 

app.use('/', require('./shorten'));
app.use('/', require('./grammar'));
app.use('/', require('./lengthen'));
app.use('/', require('./explain'));
app.use('/', require('./rephrase'));
app.use('/', require('./summarize'));
app.use('/', require('./questions'));

app.use('/', require('./youtube/titles'));
app.use('/', require('./youtube/tags'));
app.use('/', require('./youtube/script'));
app.use('/', require('./youtube/description'));
app.use('/', require('./youtube/comment'));

app.use('/', require('./facebook'));
app.use('/', require('./google'));
app.use('/', require('./linkedin'));

app.use('/', require('./code/interpret'));
app.use('/', require('./code/fix'));
app.use('/', require('./code/convert'));
app.use('/', require('./code/improve'));
app.use('/', require('./code/write'));
app.use('/', require('./code/commands'));
app.use('/', require('./code/regex'));
app.use('/', require('./code/jstots'));
app.use('/', require('./code/wordpress'));
app.use('/', require('./code/change'));

app.use('/', require('./writing/write'));
app.use('/', require('./writing/intro'));
app.use('/', require('./writing/outline'));
app.use('/', require('./writing/conclusion'));
app.use('/', require('./writing/analogy'));
app.use('/', require('./writing/micropredict'));


app.use('/', require('./jobad'));
app.use('/', require('./todo'));
app.use('/', require('./medical'));


app.use('/', contentFilterCheck); 
app.use('/', creditPayment); 
app.use('/', saveToHistory); 

app.use('/', sendResponse); 

module.exports = app