
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/content/shorten', async (req, res, next) => {
	try {
		let { content } = req.body
	
		let prompt = `Reduce long text down to a one-sentence summary:\n###\n` +
		`TEXT: Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined.\nONE-SENTENCE SUMMARY: Jupiter, largest planet in the Solar System is the fifth from the Sun.\n###\n` +
		`TEXT: Estimates of the extent of the seismic risk to the nation are based on three primary factors—the nation’s inventory of structures (buildings, highways, pipelines, etc.), the potential damage extrapolated from performance in past damaging earthquakes, and the seismic hazard as determined from the geologic record and from instrument recordings of earthquakes that have occurred over the past century. This risk is growing steadily because buildings and infrastructure systems nationwide are being constructed without an adequate understanding of the seismic hazards that are present.\nONE-SENTENCE SUMMARY: Seismic risk estimates are based on national's structures such as buildings, highways, pipelines, and potential risk based on past damage over a century.\n###\n`
		


		let inputRaw = `TEXT: ${content}\nONE-SENTENCE SUMMARY:`

		prompt += inputRaw
	
		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 100,
			temperature: 0.2,
			frequencyPenalty: 0,
			presencePenalty: 0,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ["###", "<|endoftext|>","ONE-SENTENCE SUMMARY","TEXT", ],
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