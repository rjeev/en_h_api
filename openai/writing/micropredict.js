
const express = require('express');
const openai = require('../../middlewares/openai');


let app = express.Router()

// Personal Tools
app.post('/writing/micropredict', async (req, res, next) => {
	try {

		// Pay extra 1 credit as large prompt
		let { content, title, audience, desc, keywords, lookBack } = req.body

		// console.log({
		// 	content
		// })
		
		if (content.length > (lookBack || 600)) {
			content = content.substring(content.length - (lookBack || 600))
		}
	
		while (content.endsWith('\n\n\n')) {
			content = content.substring(0, content.length - 1)
		}

	
		if (content.charAt(content.length - 1) === '\n') {
			content = content.substring(0, content.length - 1)
		}
		// if content has white space at the end, remove it
		let endingSpace = false
		if (content.charAt(content.length - 1) === ' ') {
			content = content.substring(0, content.length - 1)
			endingSpace = true
		}
		// content = content.trim()

		// let prompt = `Predict the next few words based on the text provided so far.\n"""\n` +
		// `${content}`

		let prompt = 
			`Text prediction tool that can suggest the next few words based on context\n"""\n` +
		 `${content}`
		 
		// console.log({content})

		// const gptResponse = await openai.answers({
		// 	search_model: "ada",
		// 	documents: [],
		// 	model: 'davinci',
		// 	maxTokens: 10,
		// 	user: req.user._id,
		// 	temperature: 0.5,
		// 	question: content,
		// 	examples_context: "Predict the next few words to provided a suggested autocomplete to the text",
		// 	examples: [["I think", " therefore I am."], ["React is", " a JavaScript library for building user interfaces."], ["Learning a new language pushes your brain ", " to get familiar with new grammar and vocabulary rules."]],
		// 	stop: ["\n"],
		// });
	
		// let output = `${gptResponse.data.answers[0]}`
	
		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 10,
			temperature: 0.55,
			frequencyPenalty: 0,
			presencePenalty: 0,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ['"""', "Predict the next few words", "\n", "that can suggest" ],
		});
	
		// const gptResponse = await openai.complete({
		// 	engine: 'babbage',
		// 	prompt,
		// 	maxTokens: 10,
		// 	temperature: 0.3,
		// 	frequencyPenalty: 0,
		// 	presencePenalty: 0,
		// 	topP: 1,
		// 	n: 1,
		// 	user: req.user._id,
		// 	stream: false,
		// 	stop: ['"""', "Predict the next few words", "\n", "that can suggest" ],
		// });

		let output = `${gptResponse.data.choices[0].text}`
		// console.log({
		// 	output
		// })
		if(endingSpace){
			// check if content starts with a space, and remove it
			if (output.charAt(0) === ' ') {
				output = output.substring(1)
			}
		}
		output = output.trimEnd()
		// if the output is a full stop, remove it
		// req.locals.skipFilter = true
		if (output.charAt(output.length - 1) === '.') {
			req.locals.skipFilter = true
		}
		req.locals.input = prompt
		req.locals.output = output

		next()

		} catch (err) {
			console.log(err)
		}
  })

  module.exports = app