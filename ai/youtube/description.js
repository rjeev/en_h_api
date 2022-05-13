
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/social/youtube/description', async (req, res, next) => {

	try {
			let { title, topic, outline, audience } = req.body

			// append the word hello before the start of the prompt text
			let prompt = `Write an engaging, eye-catching description for a YouTube video based on video details:\n###\n` +

				`PREMISE: Python Tutorial for Beginners\n` + 
				`${audience ? `AUDIENCE: programmers\n` : ``}` + 
				`${topic ? `TOPIC: python coding\n` : ``}` + 
				`${outline ? `OUTLINE: Learn Python in 5 Hours\n` : ``}` + 
				`DESCRIPTION: In this complete Python course you will learn everything you need to get started with Python. By the end of this course, you will have a good understanding of the concepts and hands-on experience with several demo projects you can follow along. Python is the most popular programming language out there and it is used for so many different industries, like: Web Development, Data Science, Machine Learning and DevOps Automation. So learning Python is definitely a good idea!\n` + 
				`###\n` +

				`PREMISE: The Figma 2021 Crash Course\n` + 
				`${audience ? `AUDIENCE: graphics design\n` : ``}` + 
				`${topic ? `TOPIC: figma\n` : ``}` + 
				`${outline ? `OUTLINE: Want to learn UI/UX\n` : ``}` + 
				`DESCRIPTION: Today, we're going to step into the world of UI/UX design and cover Figma here in 2021. Figma is a UI/UX design and prototyping tool. In this crash course, I'm going to show you how to use Figma to design a website with multiple pages, interactions and animations. \n` + 
				`###\n` +

				`PREMISE: Introduction to Figma\n` + 
				`${audience ? `AUDIENCE: ui designers\n` : ``}` + 
				`${topic ? `TOPIC: ui design\n` : ``}` + 
				`${outline ? `OUTLINE: 2021 Beginners Tutorial to figma\n` : ``}` + 
				`DESCRIPTION: If you enjoy this video, you will also love my Figma Tutorial. Figma has quickly risen to the top as one of the most beloved design tools for UI, UX and Web designers. If you're just starting out with Figma or you're thinking about making the switch. This quick tutorial will be perfect for you.\n` + 
				`###\n`

				let inputRaw = `PREMISE: ${title}\n` + 
				`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
				`${topic ? `TOPIC: ${topic}\n` : ``}` + 
				`${outline ? `OUTLINE: ${outline}\n` : ``}` + 
				`DESCRIPTION:`

				prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'danvinci',
				prompt,
				maxTokens: 150,
				temperature: 0.5,
				topP: 1,
				frequencyPenalty: 0.2,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ["###", "<|endoftext|>", "PREMISE", "DESCRIPTION" ],
			});

			let output = `${gptResponse.data.choices[0].text}`

			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.output = output

			next();

		} catch(err){
			console.log(err)
		}
	
  })

module.exports = app