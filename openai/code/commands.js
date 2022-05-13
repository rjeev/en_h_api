
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

app.post('/code/commands', async (req, res, next) => {

	try {
			let { content, command } = req.body

			let gptObj =  {}

			// create a switch that checks if the command is Bash, Powershell, Docker or Git, and runs different functions for each
			switch(command) {
				case "Bash": 
					gptObj = bashPrompt(content)
					break;
				case "Git": 
					gptObj = gitPrompt(content)
					break;
				case "Powershell": 
					gptObj = powershellPrompt(content)
					break;
				case "Docker": 
					gptObj = dockerPrompt(content)
					break;
				default: 
					gptObj = bashPrompt(content)
			}

			console.log(`gptObj.gpt`,gptObj.gpt)

			let gptPostObj = {
				search_model: "ada",
				documents: [],
				model: 'davinci-codex',
				maxTokens: 250,
				user: req.user._id,
				...gptObj.gpt,
			}

			const gptResponse = await openai.answers(gptPostObj);

			let output = `${gptResponse.data.answers[0]}`

			console.log(`output`,output)

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

const bashPrompt = (content) => {

	const question = content

	const examples_context =  "Provide the bash script required to complete the task"

	const examples = [
		[
			// Input
			`Copy all the files from ./jobs directory to ./draft/jobs`,
			// Output
			`cp -r ./jobs/* ./draft/jobs`
		],[
			// Input
			`perform a post request to https://hey.com passing an array called todo with two items, the word breakfast, and the word dinner`,
			// Output
			`curl -X POST -H "Content-Type: application/json" -d '{"todo":["breakfast", "dinner"]}' https://hey.com`
		],
	]

	const stop = ['###']
	
	const inputRaw = question
	
	return { gpt: {
				question,
				examples_context,
				examples,
				stop,
			}, inputRaw 
	}
}

const dockerPrompt = (content) => {

	const question = content

	const examples_context =  "Provide the docker script commands required to complete the task"

	const examples = [
		[
			// Input
			`Show me all the stopped containers`,
			// Output
			`docker ps -a`
		],[
			// Input
			`run a docker on port 80 called getting-started`,
			// Output
			`docker run -d -p 80:80 docker/getting-started`
		],[
			// Input
			`create a dockerfile that runs node 12-alpine, uses python in the folder app and installs packages g++ make and runs src/index.js when starting`,
			// Output
			`# syntax=docker/dockerfile:1\n` +
			`FROM node:12-alpine\n` +
			`RUN apk add --no-cache python g++ make\n` +
			`WORKDIR /app\n` +
			`COPY . .\n` +
			`RUN yarn install --production\n` +
			`CMD ["node", "src/index.js"]\n`
		],
	]

	const stop = ['###']
	
	const inputRaw = question
	
	return { gpt: {
				question,
				examples_context,
				examples,
				stop,
			}, inputRaw 
	}
}



const gitPrompt = (content) => {

	const question = content

	const examples_context =  "Provide the git commands required to complete the task"

	const examples = [
		[
			// Input
			`To add all files not staged`,
			// Output
			`git add .`
		],[
			// Input
			`Adding a commit with message saying all changes done`,
			// Output
			`git commit -m "All changes done"`
		],[
			// Input
			`Find out how much used and free space i have on my drives, and save it to a html file called PSDrive`,
			// Output
			`$group = Get-ADGroup -Identity "Testers"\n` +
			`$group.Members | ForEach-Object {\n` +
			`  $user = Get-ADUser -Identity $_.SamAccountName\n` +
			`  $user.AddToRole "Test Deployment"\n` +
			`}` 
		],
	]

	const stop = ['###']
	
	const inputRaw = question
	
	return { gpt: {
				question,
				examples_context,
				examples,
				stop,
			}, inputRaw 
	}

}


const powershellPrompt = (content) => {

	const question = content

	const examples_context =  "Provide the powershell command required to complete the task"

	const examples = [
		[
			// Input
			`Create a script that loops through systems.txt, which has a list of computer names, then create the user John Smith for each of those computers`,
			// Output
			`ForEach ($system in Get-Content "systems.txt")\n{\n  Invoke-Command { NET USER John /fullname:"John Smith" /ADD } -ComputerName $system\n}`
		],[
			// Input
			`create a script that loops through all the active directory users  in the group Testers and adds the security group Test Deployment to them`,
			// Output
			`$Group = "Testers"\n` +
			`$SecurityGroup = "Test Deployment"\n` +
			`$User = Get-ADUser -Filter {memberOfGroup -eq $Group}\n` +
			`$User.Groups.Add($SecurityGroup)` 
		],[
			// Input
			`Find out how much used and free space i have on my drives, and save it to a html file called PSDrive`,
			// Output
			`$group = Get-ADGroup -Identity "Testers"\n` +
			`$group.Members | ForEach-Object {\n` +
			`  $user = Get-ADUser -Identity $_.SamAccountName\n` +
			`  $user.AddToRole "Test Deployment"\n` +
			`}` 
		],
	]

	const stop = ['<#', '#>', '"""']
	
	const inputRaw = question
	
	return { gpt: {
				question,
				examples_context,
				examples,
				stop,
			}, inputRaw 
	}
}

module.exports = app

// Get-ChildItem -Path ./jobs | ForEach-Object { Rename-Item $_ -NewName {$_.BaseName + "-1"} } -