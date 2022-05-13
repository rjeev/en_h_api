
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/improve', async (req, res, next) => {

	try {
			let { content, language, toLanguage } = req.body

			// for content string, where there are four spaces, convert them to tabs
			content = content.replace(/\s{4}/g, '\t')

			let prompt = `#### Improve the following code to be clean and simple using the latest standards\n\n` +

			// Example 1
			`### Poor JavaScript Code\n` + 
			`const doubleList = (list) => {\n` +
			`\tconst newList = []\n` +
			`\tfor(var i=0;i<list.length;i++){\n` +
			`\t\tnewList[i] = list[i] * 2;\n` +
			`\t}\n` +
			`\treturn newList;\n` +
			`};\n` +
			`### Clean JavaScript Code\n` + 
			`const doubleList = list => list.map(listItem => listItem * 2)\n\n` + 

			// Example 2
			`### Poor JS Code\n` + 
			`const yyyymmdstr = moment().format("YYYY/MM/DD")\n` +
			`### Clean JS Code\n` + 
			`const currentDate = moment().format("YYYY/MM/DD")\n\n` + 

			// Example 3
			`### Poor javascript Code\n` + 
			`a > b ? foo = 'apple' : foo = 'ball'\n` +
			`### Clean javascript Code\n` + 
			`foo = a > b ? 'apple' : 'ball'\n\n` + 

			// Example 4
			`### Poor javascript Code\n` + 
			`let a = foo[0], b = foo[1]\n` +
			`### Clean javascript Code\n` + 
			`let [a, b] = foo\n\n` + 

			// Example 5
			`### Poor JavaScript Code\n` + 
			`a = d;\n` +
			`b = d;\n` +
			`c = d;\n` +
			`### Clean JavaScript Code\n` + 
			`a = b = c = d;\n\n` + 

			// Example 6
			`### Poor JavaScript Code\n` + 
			`const Car = {\n` +
			`\tcarMake: "Honda",\n` +
			`\tcarModel: "Accord",\n` +
			`\tcarColor: "Blue"\n` + 
			`};\n\n` + 
			`function paintCar(car, color) {\n` + 
			`\tcar.carColor = color;\n` + 
			`}\n` + 
			`### Clean JavaScript Code\n` + 
			`const Car = {\n` +
			`\tcar: "Honda",\n` +
			`\tcar: "Accord",\n` +
			`\tcar: "Blue"\n` + 
			`};\n\n` + 
			`function paintCar(car, color) {\n` + 
			`\tcar.color = color;\n` + 
			`}\n\n` + 

			// Example 7
			`### Poor Python Code\n` + 
			`fullname = "Ryan McDermott"\n\n` +
			`def split_into_first_and_last_name() -> None:"\n` +
			`\tglobal fullname\n` +
			`\tfullname = fullname.split()\n\n` +
			`split_into_first_and_last_name()\n\n` +
			`print(fullname)\n` +
			`### Clean Python Code\n` + 
			`from typing import List, AnyStr"\n\n\n` +
			`def split_into_first_and_last_name(name: AnyStr) -> List[AnyStr]:"\n` +
			`\treturn name.split()\n\n` +
			`fullname = "Ryan McDermott"\n` +
			`name, surname = split_into_first_and_last_name(fullname)\n\n` +
			`print(name, surname)\n\n`

			// Example 1
			let inputRaw = `### Poor ${language} Code\n` + 
			`${content}\n` +
			`### Clean ${language} Code`

			prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'davinci-codex',
				prompt,
				maxTokens: 100,
				temperature: 0,
				topP: 1,
				frequencyPenalty: 0,
				presencePenalty: 0,
				bestOf: 1,
				user: req.user._id,
				stream: false,
				stop: ['###','####','#####', "<|endoftext|>" ],
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