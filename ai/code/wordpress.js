
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/wordpress', async (req, res, next) => {

	try {
			let { content } = req.body

			let prompt = `A tool for WordPress using PHP to make functions, features and changes` +
			`Modify the Read More Text in Wordpress Excerpt to Learn More` +
			`function modify_read_more() {\n` +
			`  return '<a class="readmore" href="' . get_permalink() . '">Learn More</a>';\n` +
			`}\n` +
			`add_filter( 'the_content_more_link', 'modify_read_more' );` +
			`Remove the WordPress Version` +
			`function remove_wordpress_version() {\n` +
			`  return '';\n` +
			`}\n` +
			`add_filter('the_generator', 'remove_wordpress_version');` 

			let inputRaw = `${content}`
			prompt += inputRaw

			const gptResponse = await openai.answers({
				search_model: "ada",
				documents: [],
				model: 'davinci-codex',
				maxTokens: 250,
				user: req.user._id,
				question: inputRaw,
				examples_context: "A tool for WordPress using PHP to make functions, features and changes",
				examples: [
					[
						// Input
						`Modify the Read More Text in Wordpress Excerpt to Learn More`,
						// Changes
						`function modify_read_more() {\n` +
						`  return '<a class="readmore" href="' . get_permalink() . '">Learn More</a>';\n` +
						`}\n` +
						`add_filter( 'the_content_more_link', 'modify_read_more' );`
					],[
						// Input
						`Remove the WordPress Version`,
						// Changes
						`function remove_wordpress_version() {\n` +
						`  return '';\n` +
						`}\n` +
						`add_filter('the_generator', 'remove_wordpress_version');` 
					]
				],
				stop: [ '---' ],
			});
		
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

module.exports = app