
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/write', async (req, res, next) => {

	try {
			let { content, language, library } = req.body

			// for content string, where there are four spaces, convert them to tabs
			content = content.replace(/\s{4}/g, '\t')

			let prompt =  `/** Provide the plain JavaScript required to complete the task, do not use other frameworks or libraries: **/\n` +
			`/* Task: print hello world to the console */\n` +
			`// Outputs a message to the console\n` +
			`console.log("Hello World")\n` +

			`/* Task: How do I redirect to another webpage? */\n` +
			`// similar behavior as an HTTP redirect\n` +
			`window.location.replace("http://stackoverflow.com");\n` +
			`// similar behavior as clicking on a link\n` +
			`window.location.href = "http://stackoverflow.com";\n\n` +

			`/* Task: How can I remove a specific item from an array? */\n` +
			`// remove the first item from an array\n` +
			`var array = ["a", "b", "c"];\n` +
			`array.shift();\n` +
			`// remove the last item from an array\n` +
			`var array = ["a", "b", "c"];\n` +
			`array.pop();\n` +
			`// remove the item at a specific index from an array\n` +
			`var array = ["a", "b", "c"];\n` +
			`array.splice(1, 1);\n\n`

			let inputRaw = `/* Task: ${content} */`
			prompt += inputRaw

			const gptResponse = await openai.complete({

				engine: 'davinci-codex',
				prompt,
				maxTokens: 150,
				temperature: 0,
				topP: 1,
				frequencyPenalty: 0.2,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ["/*", "*/", "<|endoftext|>" ],
			});



			let output = `${gptResponse.data.choices[0].text}`

			// output.trim()
			// use regex to remove all trailing break lines
			// output = output.replace(/\n+$/, '')

			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.output = output
			req.locals.code = output

			next();

		} catch(err){
			console.log(err)
		}
	
	})

module.exports = app