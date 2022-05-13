
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// Personal Tools
app.post('/content/grammar', async (req, res, next) => {
	try {
		
		let { content } = req.body

		let prompt = `Correct the following text to become Standard American English:\n###\n` +
		`TEXT: Alex having a bit sneezing and runny nose today. I keep him here home just to safe. I send him to school when hes completely better.\nSTANDARD AMERICAN ENGLISH: Alex was sneezing and running a bit of a fever today. I kept him home just to be safe. I'll send him back to school when he's completely recovered.\n###\n` +
		// `TEST: Solar power the conversion of energy from sunlight into elecricity, either directly use photovoltaics (PV), indirectly or use concentrated solar power, or a combation. Concentrat solar power system use lense or mirrors and and solar tracking systems to focus a large area of sunlight into a small beam. And Photovoltaic cells convert light in to a electric current use the photovoltaic effect.\n` +
		// `STANDARD AMERICAN ENGLISH: Solar power is the conversion of energy from sunlight into electricity, either directly using photovoltaics (PV), indirectly using concentrated solar power, or a combination. Concentrated solar power systems use lenses or mirrors and solar tracking systems to focus a large area of sunlight into a small beam. Photovoltaic cells convert light into an electric current using the photovoltaic effect.\n###\n` +
		`TEXT: She no went to the market.\nSTANDARD AMERICAN ENGLISH: She didn't go to the market.\n###\n` +
		`TEXT: I apply for job have good skill and want to hard work.\nSTANDARD AMERICAN ENGLISH: I am applying for this job and have good skills and hard work.\n###\n`

		let inputRaw = `TEXT: ${content}\nSTANDARD AMERICAN ENGLISH:`
		prompt += inputRaw

		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 150,
			temperature: 0,
			frequencyPenalty: 0,
			presencePenalty: 0,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ["###", "<|endoftext|>","TEXT","STANDARD AMERICAN ENGLISH", ],
		});

		let output = `${gptResponse.data.choices[0].text}`

		// remove the first character from output
		output = output.substring(1, output.length)

		// remove a single new line at the end of output if there is one
		if (output.endsWith('\n')) {
			output = output.substring(0, output.length - 1)
		}

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.output = output
		
		next()

	} catch (err) {
		console.log(err)
	}
})

  module.exports = app