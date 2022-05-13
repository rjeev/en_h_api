
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

app.post('/business/questions', async (req, res, next) => {
	try {
		let { content, n } = req.body

		let prompt = `Ask an important question based on the text:\n###\n` +
		`TEXT: Moshi is looking for a junior programmer 3 years experience who knows front-end, html, apply for the job today\nQUESTION: What is the starting salary?\n###\n` +
		`TEXT: Bam is hiring a graphics designer with 2 years experience to make logos.\nQUESTION: Can I still apply as a graduate with no experience?\n###\n` +
		`TEXT: Listening well is a skill that can be learnt and should be practised often\nQUESTION: What does it mean to be a good listener?\n###\n` +
		`TEXT: I’m coding nested comments today and using an adjacency database\nQUESTION: How do you store comments in a database?\n###\n` +
		`TEXT: Individuals who receive welfare payments such as Youth Allowance and pension payments who have lost more than eight hours a week of work due to the Covid lockdowns, will also be eligible for $200 a week in emergency payments.\nQUESTION: When can residents can get the payment and how much is it?\n###\n` +
		`TEXT: Pandemic lowdown in full effect to help stop the spread of the virus\nQUESTION:Will schools also be effected by the lockdown, and if so, for how long?\n###\n` +
		`TEXT: A black hole can be small, large and supermassive, they are a region of spacetime where gravity is so strong that nothing can escape.\nQUESTION: How do scientists calculate the mass of a supermassive black hole?\n###\n` 

		let inputRaw = `TEXT: ${content}\nQUESTION:`
		prompt += inputRaw
	
		const gptResponse = await openai.complete({
			engine: 'curie',
			prompt,
			maxTokens: 50,
			temperature: 0.5,
			frequencyPenalty: 0.2,
			presencePenalty: 0,
			n,
			user: req.user._id,
			stream: false,
			stop: ["###", "<|endoftext|>","QUESTION","TEXT", ],
		});
	
		let outputs = gptResponse.data.choices.map(choice => choice.text)


		// Remove trailing or leading spaces
		for (let i = 0; i < outputs.length; i++) {
			outputs[i] = outputs[i].replace(/^\s+|\s+$/g, '')
		}
		// // remove spaces
		outputs = outputs.filter(function(output) {
			return (!(output === "" || output === " " || output === "\n"))
		})
		// remove duplicates
		outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)
		
		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.outputs = outputs

		next()
	
	} catch (err) {
			console.log(err.response)
	}
})

module.exports = app

