
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/fix', async (req, res, next) => {

	try {
			let { content, language } = req.body

			let prompt = `##### The following tool fixes bugs in code\n\n` +

			// Eg1
			`#### Buggy JavaScript\n` + 
			`functin HelloWorld(text){ech text || "Hello World';}\n` + 
			`#### Fixed JavaScript\n` + 
			`function HelloWorld(text){\n    let text || "Hello World";\n    console.log(text);\n}\n\n` + 

			// Eg2
			`#### Buggy Python\n` + 
			`def HelloWorld(text):\n` + 
			`\tif text:\n` + 
			`\t\tpriant(text)\n` + 
			`\tprint("Hello World)\n` + 
			`#### Fixed Python\n` + 
			`def HelloWorld(text):\n` + 
			`\tif text:\n` + 
			`\t\tprint(text)\n` + 
			`\tprint("Hello World")\n\n` 

			let inputRaw = `#### Buggy ${language}\n` + 
			`${content}\n` +
			`#### Fixed ${language}`

			prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'davinci-codex',
				prompt,
				maxTokens: 250,
				temperature: 0,
				topP: 1,
				frequencyPenalty: 0,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ['####','#####', "<|endoftext|>" ],
			});

			let output = `${gptResponse.data.choices[0].text}`
			// using regex, remove all extra spaces and newlines and \n at the beginning and end of the output
			output = output.trim()
			
			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.output = output
			req.locals.code = output

			next();

		} catch(err){
			console.log(err)
		}
	
  })

module.exports = app