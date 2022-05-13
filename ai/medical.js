const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

  app.post('/medical/diagnose', async (req, res, next) => {
	try {
	let { content } = req.body
  
	let prompt = `A doctor that reads a patients symptoms and identifies the correct diagnoses they have:\n###\n` +
	`SYMPTOMS: Ongoing chest pain or haemodynamic instability, Crescendo angina, New ischaemic changes on ECG\nDIAGNOSES: Acute Coronary Syndromes\n###\n` +
	`SYMPTOMS: Haemodynamic instability, Pulmonary oedema, Ischaemic chest pain, Syncope\nDIAGNOSES: Atrial Fibrillation (AF)\n###\n` +
	`SYMPTOMS: Well‑demarcated, erythematous, scaly plaques over the extensor surfaces of the elbows and knees. Involves scalp, trunk, and nails.\nDIAGNOSES: Psoriasis\n###\n` +
	`SYMPTOMS: Change in bowel habit, rectal bleeding, or strong family history of bowel cancer may indicate bowel cancer irrespective of iFOBT result.\nDIAGNOSES: Bowel Cancer\n###\n` +
	`SYMPTOMS: acute onset of hypotension, bronchospasm, or laryngeal involvement after exposure to the allergen, even in the absence of typical skin involvement.\nDIAGNOSES: Anaphylaxis\n###\n`

	let inputRaw = `SYMPTOMS: ${content}\nDIAGNOSES:`

	prompt += inputRaw
  
	const gptResponse = await openai.complete({
		engine: 'davinci',
		prompt,
		maxTokens: 50,
		temperature: 0,
		frequencyPenalty: 0,
		presencePenalty: 0,
		bestOf: 1,
		user: req.user._id,
		n: 1,
		stream: false,
		stop: ["###", "<|endoftext|>","SYMPTOMS","DIAGNOSES", ],
	});
  
	let output = `${gptResponse.data.choices[0].text}`

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.output = output
	req.locals.skipFilter = true

	next()
	
	} catch (err) {
	console.log(err.response)
	}
  });

module.exports = app