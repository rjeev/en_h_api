
const express = require('express');
const openai = require('../middlewares/openai');


let app = express.Router()

// Personal Tools
app.post('/content/lengthen', async (req, res, next) => {
	try {

		// Pay extra 1 credit as large prompt
		let { content } = req.body

		let prompt = `The following are examples of how a sentence can be expanded with more detail, which is essentially lengthening it:\n###\n` +

		`SENTENCE: Estimates of the extent of the seismic risk to the nation are based on three primary factors—the nation’s inventory of structures (buildings, highways, pipelines, etc), the potential damage extrapolated from performance in past damaging\nLENGTHEN: earthquakes, and the seismic hazard as determined from the geologic record and from instrument recordings of earthquakes that have occurred over the past century.\n###\n` +

		`SENTENCE: Blogging is a great way to educate others, reinforce learning and show your expertise to a potential employer. It can also be a great way to make money,\nLENGTHEN: either as a side hustle or a full-time career. You can make money by writing paid articles on a company's blog or your own blog.\n###\n` +

		`SENTENCE: Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half.\nLENGTHEN: times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky.\n###\n` +

		`SENTENCE: Black holes are the most extreme objects in space. They have an immense gravitational field, so once an object enters their sphere of influence, that object is trapped and cannot escape. The radius of this sphere is called\nLENGTHEN: the "event horizon." This event horizon is the boundary defining the region of space around a black hole from which nothing (not even light) can escape.\n###\n`

		let inputRaw = `SENTENCE: ${content}\nLENGTHEN:`
		prompt += inputRaw
	
		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 40,
			temperature: 0.8,
			frequencyPenalty: 0.2,
			presencePenalty: 0,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ["###", "<|endoftext|>","LENGTHEN","SENTENCE", ],
		});
	
		let output = `${content}${gptResponse.data.choices[0].text}`

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.output = output

		next()

		} catch (err) {
			console.log(err)
		}
  })

  module.exports = app