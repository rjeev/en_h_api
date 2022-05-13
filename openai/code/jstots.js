
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/jstots', async (req, res, next) => {

	try {

			let { content, language } = req.body

			content = content.replace(/\s{4}/g, '\t')

			let gptObj =  {}

			switch(language) {
				case "JavaScript": 
					gptObj = JsToTsPrompt(content)
					break;
				case "TypeScript": 
					gptObj = TsToJsPrompt(content)
					break;
				default: 
					gptObj = JsToTsPrompt(content)
			}


			const gptResponse = await openai.complete({
				engine: 'davinci-codex',
				maxTokens: 250,
				temperature: 0,
				topP: 1,
				frequencyPenalty: 0,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ['/**','/*', ],
				...gptObj.gpt,
			});

			let output = `${gptResponse.data.choices[0].text}`

			// using regex, remove all extra spaces and newlines and \n at the beginning and end of the output
			output = output.trim()

			req.locals.input = gptObj.gpt.prompt
			req.locals.inputRaw = gptObj.inputRaw
			req.locals.output = output
			req.locals.code = output

			next();

		} catch(err){
			console.log(err)
		}
	
	})


const JsToTsPrompt = (content) => {

	let prompt =  `/** A tool that translates JavaScript to TypeScript: **/\n` +

	// Example 1
	`/* JavaScript: */\n` +
	`function verify(result) {\n if (result === "pass") {\n console.log("Passed") \n} else {\n console.log("Failed")\n }\n}\n` +

	`/* TypeScript: */\n` +
	`type Result = "pass" | "fail"\n` +
	`function verify(result: Result) {\n` +
	`  if (result === "pass") {\n` +
	`	console.log("Passed")\n` +
	`  } else {\n` +
	`	console.log("Failed")\n` +
	`  }\n` +
	`}\n` +

	// Example 2
	`/* JavaScript: */\n` +
	`let myName = "Alice";\n` +

	`/* TypeScript: */\n` +
	`let myName: string = "Alice";\n` +

	// Example 3
	`/* JavaScript: */\n` +
	`import React from 'react'\n\n` +

	`const Header = ({text, color}) => {\n` +
	`  return <h1 style={{ color }}>{text}</h1>\n` +
	`}\n\n` +
	
	`Header.defaultProps = {\n` +
	`  color: 'red',\n` +
	`  text: 'Hello world!'\n` +
	`}\n` +

	`/* TypeScript: */\n` +
	`import React from 'react'\n\n` +

	`type Props = {\n` +
	`  text: string;\n` +
	`  color: string;\n` +
	`}\n\n` +

	`const Header: React.FC<Props> = ({text = 'Hello world!', color = 'red'}) => {\n` +
	`  return <h1 style={{ color }}>{text}</h1>\n` +
	`}\n` +

	// Example 3
	`/* JavaScript: */\n` +
	`const [age, setAge] = React.useState(null);\n` +
	`const handleChange = event => setAge(event.target.value);\n` +

	`/* TypeScript: */\n` +
	`const [age, setAge] = React.useState<string | number>('');\n` +
	`const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => { setAge(event.target.value as number); };\n`
	

	let inputRaw = `/* JavaScript: */\n${content}\n`
	prompt += inputRaw
	prompt += `/* TypeScript: */`
	
	return { gpt: {
		prompt
	}, inputRaw }
}


const TsToJsPrompt = (content) => {

	let prompt =  `/** A tool that translates TypeScript to JavaScript: **/\n` +

	// Example 1
	`/* TypeScript: */\n` +
	`type Result = "pass" | "fail"\n` +
	`function verify(result: Result) {\n` +
	`  if (result === "pass") {\n` +
	`	console.log("Passed")\n` +
	`  } else {\n` +
	`	console.log("Failed")\n` +
	`  }\n` +
	`}\n` +

	`/* JavaScript: */\n` +
	`function verify(result) {\n if (result === "pass") {\n console.log("Passed") \n} else {\n console.log("Failed")\n }\n}\n` +

	

	// Example 2
	`/* TypeScript: */\n` +
	`let myName: string = "Alice";\n` +

	`/* JavaScript: */\n` +
	`let myName = "Alice";\n` +



	// Example 3

	`/* TypeScript: */\n` +
	`import React from 'react'\n\n` +

	`type Props = {\n` +
	`  text: string;\n` +
	`  color: string;\n` +
	`}\n\n` +

	`const Header: React.FC<Props> = ({text = 'Hello world!', color = 'red'}) => {\n` +
	`  return <h1 style={{ color }}>{text}</h1>\n` +
	`}\n` +

	`/* JavaScript: */\n` +
	`import React from 'react'\n\n` +

	`const Header = ({text, color}) => {\n` +
	`  return <h1 style={{ color }}>{text}</h1>\n` +
	`}\n\n` +
	
	`Header.defaultProps = {\n` +
	`  color: 'red',\n` +
	`  text: 'Hello world!'\n` +
	`}\n` +

	

	// Example 3
	`/* TypeScript: */\n` +
	`const [age, setAge] = React.useState<string | number>('');\n` +
	`const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => { setAge(event.target.value as number); };\n` +

	`/* JavaScript: */\n` +
	`const [age, setAge] = React.useState(null);\n` +
	`const handleChange = event => setAge(event.target.value);\n` 

	let inputRaw = `/* TypeScript: */\n${content}\n`
	prompt += inputRaw
	prompt += `/* JavaScript: */`
	
	return { gpt: {
		prompt
	}, inputRaw }
}

module.exports = app