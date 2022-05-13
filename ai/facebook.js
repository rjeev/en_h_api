
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/social/facebook/headline', async (req, res, next) => {

	try {
			let { headline, description, audience, tone, n } = req.body
		
			// append the word hello before the start of the prompt text
			let prompt = `Create a short, engaging facebook ad headline based on metadata provided:\n###\n` +

			`TITLE: ClickUp CRM\n` + 
			`${description ? `DESCRIPTION: ClickUp is the #1 free CRM tool that streamlines Emails, Lead tracking, Customer onboarding, The entire sales pipeline, And much more, all in one place. Perfect for if you're trying to improve your existing business workflows.\n` : ``}` + 
			`${audience ? `AUDIENCE: Businesses\n` : ``}` + 
			`${tone ? `TONE: Useful\n` : ``}` + 
			`HEADLINE: The All-in-One CRM Platform\n` + 
			`###\n` +

			`TITLE: YouTube Filming Course\n` + 
			`${description ? `DESCRIPTION: From scripting to shooting to editing, I’ll teach you to make YouTube videos people want to watch in my new Skillshare class.\n` : ``}` + 
			`${audience ? `AUDIENCE: Influencer\n` : ``}` + 
			`${tone ? `TONE: Special\n` : ``}` + 
			`HEADLINE: Secrets & Skills to YouTube Success\n` + 
			`###\n` 

			
			let inputRaw = `TITLE: ${headline}\n` + 
			`${description ? `DESCRIPTION: ${description}\n` : ``}` + 
			`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
			`${tone ? `TONE: ${tone}\n` : ``}` + 
			`HEADLINE:`
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

			

			let outputs = gptResponse.data.choices.map(choice => choice.text.trim())

			// Remove duplicates
			outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)

			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.outputs = outputs

			next()

		} catch(err){
			console.log(err)
		}
	
  })

app.post('/social/facebook/description', async (req, res, next) => {

try {
		let { headline, description, audience, tone, n } = req.body
	
		// append the word hello before the start of the prompt text
		let prompt = `Create a long, engaging facebook ad description based on metadata provided:\n###\n` +

		`TITLE: ClickUp CRM\n` + 
		`${description ? `DETAILS: The All-in-One CRM Platform\n` : ``}` + 
		`${audience ? `AUDIENCE: Businesses\n` : ``}` + 
		`${tone ? `TONE: Useful\n` : ``}` + 
		`DESCRIPTION: ClickUp is the #1 free CRM tool that streamlines Emails, Lead tracking, Customer onboarding, The entire sales pipeline, And much more, all in one place. Perfect for if you're trying to improve your existing business workflows.\n` + 
		`###\n` +

		`TITLE: My YouTube Filming Course\n` + 
		`${description ? `DETAILS: Secrets & Skills to YouTube Success\n` : ``}` + 
		`${audience ? `AUDIENCE: Influencer\n` : ``}` + 
		`${tone ? `TONE: Special\n` : ``}` + 
		`DESCRIPTION: From scripting to shooting to editing, I’ll teach you to make YouTube videos people want to watch in my new class.\n` + 
		`###\n` 

		
		let inputRaw = `TITLE: ${headline}\n` + 
		`${description ? `DETAILS: ${description}\n` : ``}` + 
		`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
		`${tone ? `TONE: ${tone}\n` : ``}` + 
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
			// bestOf: 1,
			user: req.user._id,
			n,
			stream: false,
			stop: ["###", "<|endoftext|>", "VIDEO", "TITLE" ],
		});

		

		let outputs = gptResponse.data.choices.map(choice => choice.text.trim())

		// Remove duplicates
		outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.outputs = outputs

		next()

	} catch(err){
		console.log(err)
	}

})

app.post('/social/facebook/keywords', async (req, res, next) => {

	try {
			let { headline, description, audience, } = req.body
		
			// append the word hello before the start of the prompt text
			let prompt = `Generate dozens of keywords for a Facebook Ad Campaign based on metadata provided:\n###\n` +

			`AD: The All-in-One CRM Platform\n` + 
			`${description ? `DESCRIPTION: ClickUp is the #1 free CRM tool that streamlines Emails, Lead tracking, Customer onboarding, The entire sales pipeline, And much more, all in one place. Perfect for if you're trying to improve your existing business workflows.\n` : ``}` + 
			`${audience ? `AUDIENCE: Businesses\n` : ``}` + 
			`KEYWORDS: CRM, Sales, Marketing, Lead Tracking, Email Tracking, Customer Onboarding, Best CRM Software, Customer Relationship, CRM for Business, Best Free CRM, CRM Program, Customer Management, Customer Relationship Management, Contact Management Software, Sales Management, Lead Management, Client Management Software, Top CRM, Business Application System, What Are The Best CRM Programs, Direct Marketing, Customer Care, Sales Outsourcing, Business Administration, Enterprise CRM, Web CRM\n` +
			`###\n` +
			
			`AD: Van and Automotive Repair Masters\n` + 
			`${description ? `DESCRIPTION: Specialising in automotive repairs and maintenance, both residential and commercial vehicles in Bunbury and the South West.\n` : ``}` + 
			`${audience ? `AUDIENCE: Automotive\n` : ``}` + 
			`KEYWORDS: Van Repairs, Van Service, Automotive Repairs, Best Van Repairs, Commercial Van Service, Commercial Vehicle Repair, Top Automotive Repairs, Mechanic, Mobile Automotive Service, Car Repair Mobile, Mobile Mechanic, Automotive Maintenance, Car Repair,${description ? "Bunbury Mechanic, South West Mechanic, Bunbury Car Service," : ""} Automotive Service, Holden Service, Toyota Service, Mazda Service, Truck Service, Truck Repair, Fleet Service, Fleet Repairs Mitsubishi Service, Diesel Service, Diesel Repair, Mobile Diesel Service\n` +
			`###\n` 


			let inputRaw = `AD: ${headline}\n` + 
			`${description ? `DESCRIPTION: ${description}\n` : ``}` + 
			`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
			`KEYWORDS:`

			prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'danvinci',
				prompt,
				maxTokens: 150,
				temperature: 0.5,
				frequencyPenalty: 0.4,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ["###", "DESCRIPTION", "AD:", "KEYWORDS" ],
			});

			let outputs = []

			if(gptResponse.data.choices[0].text){
				// Split break lines
				outputs = `${gptResponse.data.choices[0].text}`.split(',')

				// remove any additional \n in output array
				outputs = outputs.map(function(item){
					return item.replace(/\n/g, '')
				})

				// remove entries with spaces or empty
				outputs = outputs.filter(function(output) {
					return (!(output === "" || output === " " || output === "\n"))
				})

				// remove numbers and spaces
				for (let i = 0; i < outputs.length; i++) {
					outputs[i] = outputs[i].replace(/^\s+|\s+$/g, '')
				}
				// remove duplicates
				outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)
			}

			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.outputs = outputs

			next()

		} catch(err){
			console.log(err)
		}
	
  })

module.exports = app