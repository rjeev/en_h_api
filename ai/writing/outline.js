
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/writing/outline', async (req, res, next) => {
	try {
		let { title, audience, desc, keywords } = req.body

		let prompt = `The following tool creates an outline for an article based on metadata provided:\n"""\n` +

		// Example 1
		`Title: Social Media Success: Video Storytelling on YouTube & Beyond\n` + 
		`${audience ? `Audience: social influencer\n` : ``}` + 
		`${desc ? `Description: Sharing the tips and tricks to improving your story telling and videos on youtube based on the experiences I've learnt about making ideas, filing, editing and more\n` : ``}` + 
		`${keywords ? `Keywords: influence, storytelling\n` : ``}` + 
		`Outline:\n1. Introduction\n` + 
		`2. The Power of Story\n` + 
		`3. Setting Your Goals\n` + 
		`4. Generating Ideas\n` + 
		`5. Writing a Script\n` + 
		`6. Shooting Your Video\n` + 
		`7. Editing Footage\n` + 
		`8. Posting Videos\n` + 
		`9. Growing a Channel\n` +
		`"""\n` +

		// Example 2
		`Title: 5 JavaScript Tips That'll Help You Save Time\n` + 
		`${audience ? `Audience: Developers, programmers\n` : ``}` + 
		`${desc ? `Description: In this article, I’ll share five potent JavaScript tips, tricks, and best practices that I follow and found useful to save you time.\n` : ``}` + 
		`${keywords ? `Keywords: JavaScript, developers, console, tips and tricks\n` : ``}` + 
		`Outline:\n1. Object deconstructing\n` + 
		`2. Merging objects is ES6\n` +
		`3. Array spread operator\n` + 
		`4. Removing duplications in arrays\n` + 
		`5. Using Ternary Operators\n` + 
		`"""\n` +

		// Example 3
		`Title: Beginners guide to react\n` + 
		`${audience ? `Audience: Developers, programmers\n` : ``}` +
		`${desc ? `Description: This course is for React newbies and anyone looking to build a solid foundation. It’s designed to teach you everything you need to start building web applications in React right away\n` : ``}` + 
		`${keywords ? `Keywords: react, coding, js\n` : ``}` + 
		`Outline:\n1. What is React\n` +
		`2. Introducing JSX\n` + 
		`3. Rendering Elements\n` + 
		`4. Components and Props\n` + 
		`5. State and Lifecycle\n` + 
		`6. Handling Events\n` + 
		`7. Conditional Rendering\n` + 
		`8. Lists and Keys\n` + 
		`9. Forms\n` + 
		`10. Lifting State Up\n` + 
		`###\n`

		let inputRaw = `Title: ${title}\n` + 
		`${audience ? `Audience: ${audience}\n` : ``}` + 
		`${desc ? `Description: ${desc}\n` : ``}` + 
		`${keywords ? `Keywords: ${keywords}\n` : ``}` + 
		`Outline:\n1.` 

		prompt += inputRaw

		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 150,
			temperature: 0.5,
			frequencyPenalty: 0.2,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`, "Title:","Audience:", "Outline:" ],
		});

		// let output = `${gptResponse.data.choices[0].text}`

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

			// remove entries with spaces or empty
			outputs = outputs.filter(function(output) {
				return (!(output === "" || output === " " || output === "\n"))
			})

			// remove duplicates
			outputs = outputs.filter((item, pos, self) => self.indexOf(item) === pos)
		}

		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.outputs = outputs


		next()

	} catch (err) {
		console.log(err)
	}
  })

  module.exports = app