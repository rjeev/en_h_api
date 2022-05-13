
const express = require('express');
const openai = require('../../middlewares/openai');


let app = express.Router()

// Personal Tools
app.post('/writing/write', async (req, res, next) => {
	try {

		// Pay extra 1 credit as large prompt
		let { content, title, audience, desc, keywords } = req.body

		if (content.length >  2000) {
			content = content.substring(content.length -  2000)
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

		let prompt = `Writing a blog based on the title, audience, description and keywords. Do not repeat content, write unique, engaging and relevant content based off the context written so far.\n"""\n` +
		`${title ? `Title: ${title}\n` : ``}` +
		`${audience ? `Audience: ${audience}\n` : ``}` +
		`${desc ? `Description: ${desc}\n` : ``}` +
		`${keywords ? `Keywords: ${keywords}\n` : ``}` +
		`"""\n` +
		`Using the above details, the following blog was written:\n` +
		`"""\n` +
		`${content}`

	
		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 100,
			temperature: 0.8,
			frequencyPenalty: 0,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: ['"""', "Keywords:","Title:","Writing a document", ],
		});
	
		
		let output = `${gptResponse.data.choices[0].text}`
		
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

		// convert all single \n into double \n\n
		// output = output.replace(/\n/g, "\n\n")

		// only trim the end of the output string for white space or break lines
		output = output.trimEnd()

		console.log({
			output
		})

		req.locals.input = prompt
		req.locals.output = output

		next()

		} catch (err) {
			console.log(err)
		}
  })

  module.exports = app