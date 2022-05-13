<|endoftext|>/* I start with a blank HTML page, and incrementally modify it via <script> injection. Written for Chrome. */
/* Command: Add "Hello World", by adding an HTML DOM node */
var helloWorld = document.createElement('div');
helloWorld.innerHTML = 'Hello World';
document.body.appendChild(helloWorld);
/* Command: Clear the page. */
while (document.body.firstChild) {
  document.body.removeChild(document.body.firstChild);
}

/* Command: Display this image of a cat: https://bit.ly/3fsc0rH */
var cat = document.createElement('img');
cat.src = 'https://bit.ly/3fsc0rH';
document.body.appendChild(cat);

/* Command: Make it 20% */
cat.style.width = '20%';

/* Command: Make it 30% */
cat.style.width = '30%';

/* Command: Make it 25 */
