
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/social/youtube/comment', async (req, res, next) => {

	try {
			let { title, comment, audience, n } = req.body

			console.log({ title, comment, audience, n })

			// append the word hello before the start of the prompt text
			let prompt = `Generate a reply to comment on a YouTube video, the reply helpful, creative, clever, and very friendly.\n###\n` +

			`VIDEO: UX/UI Design Tutorial in Figma\n` + 
			`${audience ? `AUDIENCE: graphics designer\n` : ``}` + 
			`${comment ? `COMMENT: Thanks for this tutorial, please give us more and more tutorial so that we can practice become experts\n` : ``}` + 
			`REPLY: Happy to hear that! There is lot's to learn about Figma so you can expect I'll definitely be making more to help you all improve your design skills\n` + 
			`###\n` +

			`VIDEO: The iPad Is the PERFECT tool for students\n` + 
			`${audience ? `AUDIENCE: tech enthusiasts\n` : ``}` + 
			`${comment ? `COMMENT: It makes sense as a student on a budget to get the most affordable cheap iPad\n` : ``}` + 
			`REPLY: Yeah that's 100% correct. You don't always need an iPad Pro for school.\n` + 
			`###\n` +
			
			`VIDEO: 3 months with the Blackmagic Pocket Cinema Camera 6K Pro Review\n` + 
			`${audience ? `AUDIENCE: filmmakers\n` : ``}` + 
			`${comment ? `COMMENT: We've been using the regular 4K camera and 6k camera for quite some time and we absolutely love it. The image quality is beautiful\n` : ``}` + 
			`REPLY: They are both amazing cameras! Like you, I'm always impressed with the video quality too\n` + 
			`###\n` +

			`VIDEO: 7 Reasons You're An Inexperienced Programmer\n` + 
			`${audience ? `AUDIENCE: developers\n` : ``}` + 
			`${comment ? `COMMENT: One mistake that I noticed was inexperienced programmers tend to get the issue resolved and get the task done rather than actually understanding how the issue was resolved and how it can be prevented in the future.\n` : ``}` + 
			`REPLY: You gave a really good example, it's one thing to fix the issue it's an entirely different thing to understand how the issue happened and take measures to prevent it from happening again.\n` + 
			`###\n`

			let inputRaw = `VIDEO: ${title}\n` + 
			`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
			`${comment ? `COMMENT: ${comment}\n` : ``}` + 
			`REPLY:`

			prompt += inputRaw

		const gptResponse = await openai.complete({
			engine: 'danvinci',
			prompt,
			maxTokens: 100,
			temperature: 0.8,
			frequencyPenalty: 0.2,
			presencePenalty: 0,
			n,
			user: req.user._id,
			stream: false,
			stop: ["###", "<|endoftext|>", "PREMISE", "DESCRIPTION" ],
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

	} catch(err){
		console.log(err)
	}
	
  })

module.exports = app