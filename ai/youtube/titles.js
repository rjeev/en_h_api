
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/social/youtube/titles', async (req, res, next) => {

	try {
			let { title, topic, description, audience, n } = req.body
		
			// append the word hello before the start of the prompt text
			let prompt = `Write a short, engaging, eye-catching title for a YouTube video based on video details:\n###\n` +

				`PREMISE: python course\n` + 
				`${audience ? `AUDIENCE: programmers\n` : ``}` + 
				`${topic ? `TOPIC: learning\n` : ``}` + 
				`${description ? `DESCRIPTION: 2 hour video on learning python\n` : ``}` + 
				`TITLE: Learn Python - Full Course for Beginners [Tutorial]\n` + 
				`###\n` +

				`PREMISE: python course\n` + 
				`${audience ? `AUDIENCE: programmers\n` : ``}` + 
				`${topic ? `TOPIC: learning\n` : ``}` + 
				`${description ? `DESCRIPTION: 2 hour video on learning python\n` : ``}` + 
				`TITLE: Python Tutorial for Beginners (Full Course)\n` + 
				`###\n` +

				`PREMISE: python course\n` + 
				`${audience ? `AUDIENCE: programmers\n` : ``}` + 
				`${topic ? `TOPIC: learning\n` : ``}` + 
				`${description ? `DESCRIPTION: 2 hour video on learning python\n` : ``}` + 
				`TITLE: The Most Advance Python Course for Professionals 2021\n` + 
				`###\n` +

				`PREMISE: minecraft survival\n` + 
				`${audience ? `AUDIENCE: gamers\n` : ``}` + 
				`${topic ? `TOPIC: fun survival video\n` : ``}` + 
				`${description ? `DESCRIPTION: staying alive in minecraft\n` : ``}` + 
				`TITLE: I Played Minecraft for 100 Days... (1.16 Survival)\n` + 
				`###\n` +

				`PREMISE: minecraft survival\n` + 
				`${audience ? `AUDIENCE: gamers\n` : ``}` + 
				`${topic ? `TOPIC: fun survival video\n` : ``}` + 
				`${description ? `DESCRIPTION: staying alive in minecraft\n` : ``}` + 
				`TITLE: The Fun Begins! | Let’s Play Minecraft Survival\n` + 
				`###\n` +

				`PREMISE: minecraft survival\n` + 
				`${audience ? `AUDIENCE: gamers\n` : ``}` + 
				`${topic ? `TOPIC: fun survival video\n` : ``}` + 
				`${description ? `DESCRIPTION: staying alive in minecraft\n` : ``}` + 
				`TITLE: The Minecraft Survival Guide ▫ Surviving Your First Night!\n` + 
				`###\n` +

				`PREMISE: cryptocurrencies investing\n` + 
				`${audience ? `AUDIENCE: investors\n` : ``}` + 
				`${topic ? `TOPIC: crypto market investments\n` : ``}` + 
				`${description ? `DESCRIPTION: Things to know about in crypto\n` : ``}` + 
				`TITLE: How To Invest In Crypto Full Beginners Guide in 2021!\n` + 
				`###\n` +

				`PREMISE: cryptocurrencies investing\n` + 
				`${audience ? `AUDIENCE: investors\n` : ``}` + 
				`${topic ? `TOPIC: crypto market investments\n` : ``}` + 
				`${description ? `DESCRIPTION: Things to know about in crypto\n` : ``}` + 
				`TITLE: The 6 WORST Cryptocurrency Investing Mistakes to Avoid\n` + 
				`###\n` +

				`PREMISE: cryptocurrencies investing\n` + 
				`${audience ? `AUDIENCE: investors\n` : ``}` + 
				`${topic ? `TOPIC: crypto market investments\n` : ``}` + 
				`${description ? `DESCRIPTION: Things to know about in crypto\n` : ``}` + 
				`TITLE: TOP 5 Cryptocurrency To Invest & HOLD in 2021 (HUGE POTENTIAL!!!)\n` + 
				`###\n`

				let inputRaw = `PREMISE: ${title}\n` + 
				`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
				`${topic ? `TOPIC: ${topic}\n` : ``}` + 
				`${description ? `DESCRIPTION: ${description}\n` : ``}` + 
				`TITLE:`

				prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'danvinci',
				prompt,
				maxTokens: 25,
				temperature: 0.5,
				topP: 1,
				frequencyPenalty: 0.2,
				presencePenalty: 0,
				// bestOf: 1,
				user: req.user._id,
				n,
				stream: false,
				stop: ["###", "<|endoftext|>", "VIDEO", "TITLE" ],
			});

			let outputs = gptResponse.data.choices.map(choice => choice.text)

			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.outputs = outputs

			next()

		} catch(err){
			console.log(err)
		}
	
  })

module.exports = app