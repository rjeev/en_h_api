
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/social/youtube/script', async (req, res, next) => {

	try {
			let { title, description, audience } = req.body

			// append the word hello before the start of the prompt text
			let prompt = `Script outline that helps you plan out a youtube video's content at a high level.:\n###\n` +


				`VIDEO: Beginners guide to react\n` + 
				`${description ? `DESCRIPTION: This course is for React newbies and anyone looking to build a solid foundation. It’s designed to teach you everything you need to start building web applications in React right away\n` : ``}` + 
				`${audience ? `AUDIENCE: developers\n` : ``}` + 
				`SCRIPT OUTLINE: 1. What is React\n` +
				`2. Introducing JSX\n` + 
				`3. Rendering Elements\n` + 
				`4. Components and Props\n` + 
				`5. State and Lifecycle\n` + 
				`6. Handling Events\n` + 
				`7. Conditional Rendering\n` + 
				`8. Lists and Keys\n` + 
				`9. Forms\n` + 
				`10. Lifting State Up\n` + 
				`###\n` +

				`VIDEO: Learn Adobe XD\n` + 
				`${description ? `DESCRIPTION: Use this guide to help you learn XD's features and help you accelerate prototyping and sharing workflows. Start at the beginning, visit each section individually, or connect with the Community to work your way through a project.\n` : ``}` + 
				`${audience ? `AUDIENCE: graphics designers\n` : ``}` + 
				`SCRIPT OUTLINE: 1. Introduction to Adobe XD\n` +
				`2. How to design in XD\n` + 
				`3. Learning Artboards, Guides, Layers\n` + 
				`4. Using Shapes, Objects, Paths\n` + 
				`5. Text and fonts\n` + 
				`6. Using Mask and Effects\n` + 
				`7. Learning to Prototype\n` + 
				`8. Sharing and exporting work\n` + 
				`9. Design System\n` + 
				`10. Using plugins and integrations\n` + 
				`###\n` +

				`VIDEO: Social Media Success: Video Storytelling on YouTube & Beyond\n` + 
				`${description ? `DESCRIPTION: Sharing the tips and tricks to improving your story telling and videos on youtube based on the experiences I've learnt about making ideas, filing, editing and more\n` : ``}` + 
				`${audience ? `AUDIENCE: social influencer\n` : ``}` + 
				`SCRIPT OUTLINE: 1. Introduction\n` +
				`2. The Power of Story\n` + 
				`3. Setting Your Goals\n` + 
				`4. Generating Ideas\n` + 
				`5. Writing a Script\n` + 
				`6. Shooting Your Video\n` + 
				`7. Editing Footage\n` + 
				`8. Posting Videos\n` + 
				`9. Growing a Channel\n` + 
				`###\n`

				let inputRaw = `VIDEO: ${title}\n` + 
				`${description ? `DESCRIPTION: ${description}\n` : ``}` + 
				`${audience ? `AUDIENCE: ${audience}\n` : ``}` + 
				`SCRIPT OUTLINE: 1.`

				prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'davinci',
				prompt,
				maxTokens: 150,
				// topP: 0.9,
				temperature: 0.5,
				frequencyPenalty: 0.2,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ["###", "<|endoftext|>", "TITLE", "TAGS" ],
			});

				
			let outputs = []

			if(gptResponse.data.choices[0].text){
				// Split break lines
				outputs = `1.${gptResponse.data.choices[0].text}`.split('\n')
		
				// remove entries with spaces or empty
				outputs = outputs.filter(function(output) {
					return (!(output === "" || output === " " || output === "\n"))
				})
		
				// remove numbers and spaces
				for (let i = 0; i < outputs.length; i++) {
					outputs[i] = outputs[i].substring(3)
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