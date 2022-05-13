
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/change', async (req, res, next) => {

	try {

			let { content, changes, language } = req.body

			let prompt = `A tool that changes HTML code making minor edits and revisions` +
			// Input
			`<h2>Features</h2>\n` +
			`<ul>\n` +
			`  <li>Cool stuff</li>\n` +
			`  <li>Random feature</li>\n` +
			`  <li>Team feature</li>\n` +
			`</ul>\n` +
			// Task
			`<!-- Change: Add another list item to features called Free extras -->` +
			// Changes
			`<h2>Features</h2>\n` +
			`<ul>\n` +
			`  <li>Cool stuff</li>\n` +
			`  <li>Random feature</li>\n` +
			`  <li>Team feature</li>\n` +
			`  <li>Free extras</li>\n` +
			`</ul>` + 
			`<p>Sign Up Form</p>\n` +
			`<input type="text" id="username" placeholder="Username" required>\n` +
			`<input type="password" id="password" placeholder="Password" required>\n` +
			`<button type="submit">Sign Up</button>\n` +
			// Task
			`<!-- Change: Add an input for first name after the username -->` +
			// Changes
			`<p>Sign Up Form</p>\n` +
			`<input type="text" id="username" placeholder="Username" required>\n` +
			`<input type="text" id="fname" placeholder="First Name" required>\n` +
			`<input type="password" id="password" placeholder="Password" required>\n` +
			`<button type="submit">Sign Up</button>` 

			let inputRaw = `${content}\n<!-- Change: ${changes} -->`
			prompt += inputRaw

			const gptResponse = await openai.answers({
				search_model: "ada",
				documents: [],
				model: 'davinci-codex',
				maxTokens: 500,
				user: req.user._id,
				question: inputRaw,
				examples_context: "A tool that changes HTML code making minor edits and revisions",
				examples: [
					[
						// Input
						`<h2>Features</h2>\n` +
						`<ul>\n` +
						`  <li>Cool stuff</li>\n` +
						`  <li>Random feature</li>\n` +
						`  <li>Team feature</li>\n` +
						`</ul>\n` +
						// Task
						`<!-- Change: Add another list item to features called Free extras -->`,
						// Changes
						`<h2>Features</h2>\n` +
						`<ul>\n` +
						`  <li>Cool stuff</li>\n` +
						`  <li>Random feature</li>\n` +
						`  <li>Team feature</li>\n` +
						`  <li>Free extras</li>\n` +
						`</ul>` 
					],[
						// Input
						`<p>Sign Up Form</p>\n` +
						`<input type="text" id="username" placeholder="Username" required>\n` +
						`<input type="password" id="password" placeholder="Password" required>\n` +
						`<button type="submit">Sign Up</button>\n` +
						// Task
						`<!-- Change: Add an input for first name after the username -->`,
						// Changes
						`<p>Sign Up Form</p>\n` +
						`<input type="text" id="username" placeholder="Username" required>\n` +
						`<input type="text" id="fname" placeholder="First Name" required>\n` +
						`<input type="password" id="password" placeholder="Password" required>\n` +
						`<button type="submit">Sign Up</button>` 
					],
				],
				stop: ['<!--','-->', '---', ],
				// ...gptObj.gpt,
			});
			// console.log(gptResponse.data.answers[0])

			let output = `${gptResponse.data.answers[0]}`

			// using regex, remove all extra spaces and newlines and \n at the beginning and end of the output
			output = output.trim()

			req.locals.input = prompt
			req.locals.inputRaw = inputRaw
			req.locals.output = output
			req.locals.code = output

			next();

		} catch(err){
			console.log(err)
		}
	
	})


const HtmlPrompt = (content, changes) => {

	let prompt =  `<!-- A tool that changes HTML code making minor edits and revisions -->\n` +


	// Example 2
	`<!-- Code -->\n` +
	`<h2>Features</h2>\n` +
	`<ul>\n` +
	`  <li>Cool stuff</li>\n` +
	`  <li>Random feature</li>\n` +
	`  <li>Team feature</li>\n` +
  	`</ul>\n` +
	`<!-- Changes: Add another list item to features called Free extras -->\n` +
	`<h2>Features</h2>\n` +
	`<ul>\n` +
	`  <li>Cool stuff</li>\n` +
	`  <li>Random feature</li>\n` +
	`  <li>Team feature</li>\n` +
	`  <li>Free extras</li>\n` +
  	`</ul>\n\n` +

	  
	// Example 3
	`<!-- Code -->\n` +
	`<p>Sign Up Form</p>\n` +
	`<input type="text" id="username" placeholder="Username" required>\n` +
	`<input type="password" id="password" placeholder="Password" required>\n` +
	`<button type="submit">Sign Up</button>\n` +
	`<!-- Changes: Add an input for first name after the username -->\n` +
	`<p>Sign Up Form</p>\n` +
	`<input type="text" id="username" placeholder="Username" required>\n` +
	`<input type="text" id="fname" placeholder="First Name" required>\n` +
	`<input type="password" id="password" placeholder="Password" required>\n` +
	`<button type="submit">Sign Up</button>\n\n` 
	

	let inputRaw = `<!-- Code -->\n${content}\n<!-- Changes: ${changes} -->`
	prompt += inputRaw
	
	return { gpt: {
		prompt
	}, inputRaw }
}


const CssPrompt = (content) => {

	let prompt =  `/* A tool that style changes to CSS by making minor edits and revisions */\n` +

	// Example 1
	`/* Style: */\n` +
	`\n`

	let inputRaw = `/* TypeScript: */\n${content}\n`
	prompt += inputRaw
	prompt += `/* JavaScript: */`
	
	return { gpt: {
		prompt
	}, inputRaw }
}

module.exports = app