
class Typewriter {

	constructor(target, phrases, {pause=1, typing=0.1, erasing=0.05, duration=4}, flexible=false){

		this.target = target
		this.phrases = phrases
		this.timing = {pause, typing, erasing, duration}
		this.running = false
		this.flexible = flexible
	}

	start(){

		this.running = true

		let adjust = (time, phrase) => !this.flexible ? time : (time/2 + time/2*(30/phrase.length))

		let write = (phraseidx, i) => {

			if(!this.running)
				return false;

			let phrase = this.phrases[phraseidx]

			$(this.target).text(phrase.slice(0, i))

			if(i < phrase.length)
				setTimeout(() => write(phraseidx, i+1), adjust(this.timing.typing*1000, phrase))
			else
				setTimeout(() => erase(phraseidx, i-1), this.timing.duration*1000)
		}

		let erase = (phraseidx, i) => {

			if(!this.running)
				return false;

			let phrase = this.phrases[phraseidx]

			$(this.target).text(i > 0 ? phrase.slice(0, i) : String.fromCharCode(8204)) //invisible space to keep height

			if(i > 0)
				setTimeout(() => erase(phraseidx, i-1), adjust(this.timing.erasing*1000, phrase))
			else
				setTimeout(() => write((phraseidx + 1) % this.phrases.length, 1), this.timing.pause*1000)
		}

		write(0, 0)
	}

	stop(){

		this.running = false
	}
}

$.getJSON("data/data.json", function(json){
    const DATA = json

	let r = ()=>0.5-Math.random()

	let headings = DATA.map(x => x["title"]).sort(r).sort(r).sort(r).sort(r)
	
	let writer = new Typewriter(
		$("#ukazka-nadpis"),
		headings,
		{
			pause: 1,
			typing: 0.1,
			erasing: 0.05,
			duration: 4
		},
		true)
	
	setTimeout(() => writer.start(), 3000)
})

/*let examples = ["Kybernetické útoky jako nástroj vedení hybridního konfliktu", "Vědomé a nevědomé vnímání hudby ve filmech", 
"Flow fenomén v tanci", "3D tisk", "Blood Run Cold: How Quentin Tarantino’s Manipulation of the Audience's Emotions through Cinematic Violence",
"Rozdílné vnímání doteků v různých světových kulturách", "Činnost Milady Horákové v poválečném období",
"Matematika v gamblingu", "Důležitost bílkovin ve stravě sportovců",
"Cirkadiánní biorytmy živočichů a člověka"]
*/
