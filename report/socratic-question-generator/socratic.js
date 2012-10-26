var questions =
	[	"Why are you saying that?",
		"What exactly does this mean?",
		"How does this relate to what we have been talking about?",
		"What do we already know about this?",
		"Can you give me an example?",

		"Can you rephrase that, please?",
		"What else could we assume?",
		"How did you choose those assumptions?",
		"How can you verify or disprove that assumption?",
		
		"Why is that happening?",
		"How do you know this?",
		"Can you give me an example of that?",
		"What is the nature of this?",
		"Are these reasons good enough?",
		"Would it stand up in court?",
		"How might it be refuted?",
		"How can I be sure of what you are saying?",

		"Why? (keep asking it -- you'll never get past a few times)",
		"What evidence is there to support what you are saying?",
		"On what authority are you basing your argument?",
		"What alternative ways of looking at this are there?",
		"Who benefits from this?",
		"How could you look another way at this?",
		
		"Then what would happen?",
		"What are the consequences of that assumption?",

		"What was the point of asking that question?",
		"Why do you think I asked this question?",
		"Am I making sense? Why not?",
		"What else might I ask?",
		"What does that mean?"
		]
		
function addQuestion() {
	var question = questions[Math.floor(Math.random()*questions.length)];
	$('div#footer').before('<h1>'+question+'</h1>');
	$('div#footer').before('<textarea rows=20 cols=80>Write your answer here...</textarea>');
}