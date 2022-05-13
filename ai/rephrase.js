
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/content/rephrase', async (req, res, next) => {
	try {
		let { content, tone } = req.body

		let prompt = `The following tool rephrases a sentence with the resulting paraphrase adopting the new tone:\n###\n` +

		`Sentence: It's not like the guy, I just don't think it's the right time. Give him a couple of years of experience and then get back to me about promoting him.\n` + 
		`${tone ? `Tone: skeptical\n` : ``}` + 
		`Paraphrase: Is someone like that really worth taking a chance on? It seems like we don't need to promote him now, and I'd be included to see if he even improves his skills over the next few years.\n` + 
		`###\n` +

		// // Example 5
		`Sentence: Chocolate is important to me, and I eat it almost every day after work.\n` + 
		`${tone ? `Tone: joyful\n` : ``}` + 
		`Paraphrase: Yes! My heart is leaping with joy when I see chocolate! Thing makes me happier than having some after a long day of work!\n` + 
		`###\n` +

		// Example 4
		`Sentence: I have received the invitation to the party. I know that thursday will be the date I arrive at the lake restaurant for it.\n` + 
		`${tone ? `Tone: appreciative\n` : ``}` + 
		`Paraphrase: Thanks for inviting me! I'm looking forward to Thursday and think the lake restaurant is a great place to have it.\n` + 
		`###\n` +

		`Sentence: This super-hydrating face cream combats dry skin by continuously drawing in moisture from the air throughout the day. Even in extreme weather conditions, you’ll swap dry flakes and rough patches for smooth, soft, and comfortable skin.\n` + 
		`${tone ? `Tone: dramatic\n` : ``}` + 
		`Paraphrase: Dry skin no more! This revolutionary new cream has been designed to combat dry skin by drawing in moisture from the air all day long. In any weather, you won’t have to worry about dry flakes or rough patches.\n` + 
		`###\n`

		let inputRaw = `Sentence: ${content}\n` + 
		`${tone ? `Tone: ${tone}\n` : ``}` + 
		`Paraphrase:`

		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 100,
			temperature: 0.55,
			frequencyPenalty: 0.5,
			presencePenalty: 0.5,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ["###", "<|endoftext|>","Sentence:", "Tone:" ],
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