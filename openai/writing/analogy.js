
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/content/analogy', async (req, res, next) => {
	try {
		let { content, second, n } = req.body

		let prompt = `A tool that creates an analogy from the text provided:\n###\n` +

		// Example 3
		`Text: What people are like good and bad\n` + 
		`${second ? `Topic: Physical things like a building\n` : ``}` + 
		`Analogy: People are like stained glass windows. They sparkle and shine when the sun is out, but when the darkness sets in, their true beauty is revealed only if there is a light from within.\n` + 
		`###\n` +

		// Example 4
		`Text: A meeting or presentation in front of people\n` + 
		`${second ? `Topic: Clothing\n` : ``}` + 
		`Analogy: A good speech should be like a woman's skirt; long enough to cover the subject and short enough to create interest\n` + 
		`###\n` +

		// Example 5
		`Text: Computer science is not about computers\n` + 
		`${second ? `Topic: Space\n` : ``}` + 
		`Analogy: Computer Science is no more about computers than astronomy is about telescopes\n` + 
		`###\n`
		

		let inputRaw = `Text: ${content}\n` + 
		`${second ? `Topic: ${second}\n` : ``}` + 
		`Analogy:`

		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 50,
			temperature: 0.5,
			frequencyPenalty: 0,
			presencePenalty: 0,
			// bestOf: 1,
			topP: 1,
			n,
			user: req.user._id,
			stream: false,
			stop: ["\n\n", "Text:","Analogy:", "###" ],
		});

		let outputs = gptResponse.data.choices.map(choice => choice.text.trim())

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.outputs = outputs

		next()

	} catch (err) {
		console.log(err)
	}
  })

  module.exports = app