
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/social/youtube/tags', async (req, res, next) => {

	try {
			let { title, description, audience } = req.body

			// append the word hello before the start of the prompt text
			let prompt = `Generate as many YouTube tags, keywords and phrases:\n###\n` +


				`VIDEO: figma crash course\n` + 
				`${description ? `DESCRIPTION: The Figma tutorial will cover all the aspects to get started with Figma with a real-world example website design we will build from scratch using UI and UX.\n` : ``}` + 
				`${audience ? `AUDIENCE: graphics designers\n` : ``}` + 
				`TAGS: figma,ui,ux,graphics design,figma tutorial,figma crash course,figma design,figma tutorial for beginners,intro to figma,figma in 40 minutes,figma 101,crash course figma,tutorial figma,introduction to figma,learn figma,figma learn,figma basics,how to get started with figma,beginners guide to figma basics,figma UI design tutorial,figma course,figma website,figma website design,figma web design,\n` + 
				`###\n` +

				`VIDEO: VS Code Has Dev Tools & Console No Need For Chrome Anymore\n` + 
				`${description ? `DESCRIPTION: How would you like to have your entire web development experience, all of the tools you need, completely inside VS Code? In addition to our code and terminal we now have a browser, browser dev tools, and... wait for it, the console!! You can now solely use VS Code for tweaking CSS values, debugging JavaScript with break points, and viewing the browser CONSOLE!\n` : ``}` + 
				`${audience ? `AUDIENCE: developers\n` : ``}` + 
				`TAGS: vscode,vs code,chrome,html,css,javascript,dev tools,web development,programming,development,dev tools in chrome,javascript debugging,visual studio code,vscode tutorial,chrome devtools,debugging javascript,debugging javascript visual studio code,debugging visual studio code,web development tutorial,chrome debugging,dev tools,vscode extensions,google chrome developer tools,edge developer tools,edge browser,vs code debugging,vs code debugging javascript,vscode debugger,\n` + 
				`###\n`
				

				let inputRaw = `VIDEO: ${title}\n` + 
				`${description ? `DESCRIPTION: ${description}\n` : ``}` + 
				`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
				`TAGS:`

				prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'davinci',
				prompt,
				maxTokens: 150,
				// topP: 0.9,
				temperature: 0.5,
				frequencyPenalty: 0.4,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ["###", "<|endoftext|>", "TITLE", "TAGS" ],
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
					outputs[i] = outputs[i] + ","
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