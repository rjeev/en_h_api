
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/convert', async (req, res, next) => {

	try {
			let { content, language, toLanguage } = req.body

			// for content string, where there are four spaces, convert them to tabs
			content = content.replace(/\s{4}/g, '\t')

			let prompt = `##### Translate code, converting it from one type to another\n\n` +

			// Example 1
			`#### Translate from React into Vue\n` +
			`### React\n` + 
			`import React, { Component } from 'react'\n\n` +
			`export default class index extends Component {\n` +
   		`\trender() {\n` +
			`\t\treturn (\n` +
			`\t\t\t<div>\n` +
			`\t\t\t\tHello World\n` +
			`\t\t\t</div>\n` +
			`\t\t)\n` +
			`\t}\n` +
			`}\n` + 
			`### Vue\n` + 
			`import Vue from 'vue'\n\n` + 

			`export default Vue.extend({\n` + 
			`\trender() {\n` + 
			`\t\treturn (\n` + 
			`\t\t\t<div>\n` + 
			`\t\t\t\tHello World\n` + 
			`\t\t\t</div>\n` + 
			`\t\t)\n` + 
			`\t}\n` + 
			`})\n\n` +

			// Example 2
			`#### Translate from Python into JavaScript\n` +
			`### Python\n` + 
			`def remove_common_prefix(x, prefix, ws_prefix):\n` +
    	`\tx["completion"] = x["completion"].str[len(prefix) :]\n` +
    	`\tif ws_prefix:\n` +
			`\t\t# keep the single whitespace as prefix\n` +
			`\t\tx["completion"] = " " + x["completion"]\n` +
			`return x\n` + 

			`### JavaScript\n` + 
			`function remove_common_prefix(x, prefix, ws_prefix) {\n` +
    	`\tx.completion = x.completion.substring(prefix.length);\n` +
    	`\tif (ws_prefix) {\n` +
      `\t\t// keep the single whitespace as prefix\n` +
      `\t\tx.completion = " " + x.completion;\n` +
    	`\t}\n` +
    	`\treturn x;\n` +
			`}\n\n`

			let inputRaw = `#### Translate from ${language || "code"} into ${toLanguage || "code"}\n` +
			`### ${language || "code"}\n` + 
			`${content}\n` +
			`### ${toLanguage || "code"}`

			prompt += inputRaw

			const gptResponse = await openai.complete({
				engine: 'davinci-codex',
				prompt,
				maxTokens: 250,
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