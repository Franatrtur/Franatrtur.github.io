
class RealTimeLLMResponseEmulator {

	constructor(element, tokenDelay=100, maxTime=Infinity, randomDelay=0){

		this.element = element
		this.options = {tokenDelay, maxTime, randomDelay}
	}

	write(text, options, doneCallback){

		let tokens = text.split(" ")

		options = {...this.options, ...options}
		let delay = options.tokenDelay

		if(delay * tokens.length > options.maxTime)
			delay = options.maxTime / tokens.length

		console.log({options, delay})
		let i = 0

		let next = () => {

			if(i >= tokens.length)
				return doneCallback()

			$(this.element).append("<span>" + tokens[i++] + " " + "</span> ")

			let x = delay + Math.random()**3 * options.randomDelay

			this.next = setTimeout(next, x)
		}

		next()
	}
}
