
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/writing/conclusion', async (req, res, next) => {
	try {
		let { title, audience, desc, keywords } = req.body

		let prompt = `The following tool creates a conclusion paragraph for an article, the conclusion is succinct, with context, key points and concludes the text based on metadata provided so far:\n"""\n` +

		// Example 1
		`Title: Financial literacy should be taught in school that isn't\n` + 
		`${audience ? `Audience: Students, Parents\n` : ``}` + 
		`${keywords ? `Keywords: Students, Financial literacy, Learning\n` : ``}` + 
		`${desc ? `Article: With money being so fundamental in society, students should be learning the requirements and taught early on how to use their bank and 401k.\n` : ``}` + 
		`Conclusion: Financial literacy is one of the most important things a person needs to understand as a fully functional adult. It's crucial for someone to be able to know how to purchase a car, open a bank account, invest in a 401k plan, and pay back his or her student debt all while being able to balance paying rent and saving money. Financial literacy should be taught to students while they are still in high school so that they can feel prepared to go out on their own and make a positive contribution to society.\n` + 
		`"""\n` +

		// Example 2
		`Title: Should schools start later in the morning\n` + 
		`${audience ? `Audience: Parents, Children, Teachers\n` : ``}` + 
		`${keywords ? `Keywords: students, school, start time\n` : ``}` + 
		`${desc ? `Article: Another benefit is that students who start early don't have enough sleep. This means they cannot concentrate as well for their studies which results in poorer performance.\n` : ``}` + 
		`Conclusion: There are some clear benefits to starting school later in the morning for K-12 students such as better academic performance and improved sleeping schedules. Although it might take a bit of rearranging schedules for parents to take their kids to school later on in the day, it's more important that students perform better academically than for the drop-off to be convenient for the parents on their way to work. To combat this, increased bus routes and crossing guards should be implemented so that parents who have to get to work at a certain time can be assured that their kids are making it to school safely.\n` + 
		`"""\n`

		let inputRaw = `Title: ${title}\n` + 
		`${audience ? `Audience: ${audience}\n` : ``}` + 
		`${keywords ? `Keywords: ${keywords}\n` : ``}` + 
		`${desc ? `Article: ${desc}\n` : ``}` + 
		`Conclusion:` 

		prompt += inputRaw

		console.log({
			prompt
		})

		const gptResponse = await openai.complete({
			engine: 'davinci',
			prompt,
			maxTokens: 150,
			temperature: 0.8,
			frequencyPenalty: 0.2,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`, "Keywords:","Title:", "Conclusion:" ],
		});

		let output = `${gptResponse.data.choices[0].text}`

		// remove the first character from output
		output = output.substring(1, output.length)

		// If the output string ends with one or more hashtags, remove all of them
		if (output.endsWith('"')) {
			output = output.substring(0, output.length - 1)
		}

		// If the output string ends with one or more hashtags, remove all of them
		if (output.endsWith('"')) {
			output = output.substring(0, output.length - 1)
		}

		// remove a single new line at the end of output if there is one
		if (output.endsWith('\n')) {
			output = output.substring(0, output.length - 1)
		}
	
		req.locals.input = prompt
		req.locals.inputRaw = inputRaw
		req.locals.output = output

		next()

	} catch (err) {
		console.log(err)
	}
  })

  module.exports = app