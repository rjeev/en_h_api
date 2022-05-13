
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

app.post('/business/todo', async (req, res, next) => {
	let { content } = req.body
  
	let prompt = ""
	// append the word hello before the start of the prompt text
	prompt = `Extract the main action points from the text:\n###\n` +
	`TEXT: Hey hope you are well, can you update the website, change the features page to services and add example descriptions to each feature\nACTIONS:\n1. Make changes to the website\n2. Rename the Features page to Services\n3. On new services page, add descriptions to each example\n###\n` +
	`TEXT: One of the clients, Joe is unhappy because we didn't do their taxes and payroll, can you please do that now.\nACTIONS:\n1. Do the taxes for Joe\n2. Perform the payroll for as well\n###\n` +
	`TEXT: I'm happy you liked the new Samsung Television? Please send us an invoice for $10 and start making a script you can send us. Also can post on twitter and instagram about our collaboration.\nACTIONS:\n1. The key actions are:\n1. Create and send invoice for $10\n2. Create a script\n3. Email script for review\n4. Post on social media about the Samsung Television\n###\n` +
	`TEXT: Hope everything is getting sorted for you, just a quick note on our website that a customer just tried to order 2 x 10m3 but she had to do 2 separate orders, is there any way to change the quantity of bins?\nACTIONS:\n1. Find a way to change quantity of bins\n2. Allow customers to make multiple orders\n###\n`

	let inputRaw = `TEXT: ${content}\nACTIONS:\n1.`
	prompt += inputRaw
  
	const gptResponse = await openai.complete({
		engine: 'davinci',
		prompt,
		maxTokens: 150,
		temperature: 0.2,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 0,
		bestOf: 1,
		user: req.user._id,
		n: 1,
		stream: false,
		stop: ["###", "<|endoftext|>", ],
	});

	let outputs = []

	if(gptResponse.data.choices[0].text){
		// Split break lines
		outputs = `1.${gptResponse.data.choices[0].text}`.split('\n')

		// remove entries with spaces or empty
		outputs = outputs.filter(function(output) {
			return (!(output === "" || output === " " || output === "\n"))
		})

		// remove numbers and spaces
		for (let i = 0; i < outputs.length; i++) {
			outputs[i] = outputs[i].substring(3)
			outputs[i] = outputs[i].replace(/^\s+|\s+$/g, '')
		}
		// remove duplicates
		outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)
	}
  
	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.outputs = outputs

	next()

})

module.exports = app