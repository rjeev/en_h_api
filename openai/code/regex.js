
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/regex', async (req, res, next) => {

	try {
			let { content, } = req.body

			// for content string, where there are four spaces, convert them to tabs

			let prompt = `/* Create the regex javascript code required to complete the task using regular expression syntax */\n\n` +

			// Example 1:

			`/* Task: Create a regular expression that looks for one or more characters followed by a space in the string fee fi fo fum */\n` + 
			`var regSpaceMatch = /\\w+\\s/g;\n` + 
			`var str = 'fee fi fo fum';\n` + 
			`var myArray = str.match(regSpaceMatch);\n` + 
			`console.log(myArray);\n` + 
			`// output: ["fee ", "fi ", "fo "]\n\n` + 

			// Example 2:
			`/* Task: Create a function that checks if the phone number input follows 000-000-0000 standard and prints out true or false */\n` + 
			`var regPhoneCheck = /(?:\\d{3}|\\(\\d{3}\\))([-\\/\\.])\\d{3}\\1\\d{4}/;\n` + 
			`function testPhone(phoneInput) {\n` + 
			`  const isPhoneNumber = regPhoneCheck.exec(phoneInput);\n` + 
			`  if(isPhoneNumber){\n` + 
			`    return true;\n` + 
			`  } else {\n` + 
			`    return false;\n` + 
			`  }\n` + 
			`console.log(testPhone("123-456-7890"));\n` + 
			`// output: true\n\n` + 

			// Example 3:
			`/* Task: Test if the number for exists in the string 4567 */\n` + 
			`const regexFourCheck = /^\\d{4}$/g; \n` + 
			`console.log(regexFourCheck.test('4567'));\n` + 
			`// output: true\n\n` + 

			// Example 4:
			`/* Task: Match the word how in the follow phrase Hello how are you? */\n` + 
			`const regexHowMatch = /how/; \n` + 
			`console.log(regexHowMatch.match("Hello how are you?"));\n` + 
			`// output: "how"\n\n` + 

			// Example 5:
			`/* Task: Split the following string any time there is a comma */\n` + 
			`const stringToSplit = 'Here is a good, simple string to split'; \n` + 
			`const regSplitComma = /,\\s+/;\n` + 
			`const arrayThatWasSpit = regSplitComma.split(stringToSplit);\n` +
			`console.log(arrayThatWasSpit);\n` + 
			`// output: ["Here is a good", "simple string to split"]\n\n`



			let inputRaw = `/* Task: ${content} */`
			prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'davinci-codex',
				prompt,
				maxTokens: 200,
				temperature: 0,
				topP: 1,  
				frequencyPenalty: 0,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ['/*','*/','Task:', "<|endoftext|>" ],
			});

			let output = `${gptResponse.data.choices[0].text}`

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

module.exports = app