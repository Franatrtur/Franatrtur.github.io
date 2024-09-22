
class BallsAnimation {
	constructor(balls, targetElement, speed=1, frameRate=60){
		this.balls = balls
		this.speed = speed
		this.frameRate = frameRate
		this.element = $(targetElement)
		this.running = false
		this.linked = false
	}
	start(){
		if(!this.linked)
			this.linkBalls()
		this.running = true
		this.interval = setInterval(() => this.frame(), 1000 / this.frameRate)
		this.frame(true)
	}
	stop(){
		this.running = false
		clearInterval(this.interval)
	}
	toggle(){
		if(this.running)
			this.stop()
		else
			this.start()
	}

	linkBalls(){
		for(let ball of this.balls)
			this.element.append(ball.element)
		this.linked = true
	}

	frame(fresh = false){

		if(!this.running)
			return

		this.x = this.element.width()
		this.y = this.element.height()
		
		if(fresh)
			this.lastFrame = performance.now()

		let now = performance.now()
		let deltaTime = now - this.lastFrame
		this.lastFrame = now


		for(let i = 0; i < this.balls.length; i++){

			this.bounceWall(this.balls[i])

			for(let j = i+1; j < this.balls.length; j++)
				this.calculateCollision(this.balls[i], this.balls[j])
					//console.log({i, j})
			
		}
		for(let i = 0; i < this.balls.length; i++){
			this.balls[i].move(deltaTime * this.speed / 1000)
			this.balls[i].render()
		}
	}
	calculateCollision(ball1, ball2){

		let dx = ball2.x - ball1.x
		let dy = ball2.y - ball1.y
		let dist = Math.sqrt(dx**2 + dy**2)
		let minDistance = ball1.r + ball2.r

		if(ball1.lastCollision == ball2)
			return false
		
		if(dist > minDistance)
			return false

		let spread = minDistance - dist

		let normVecX = dx / dist
		let normVecY = dy / dist

		let masses = (ball1.m) + (ball2.m)
		let fr1 = (ball1.m) / masses
		let fr2 = (ball2.m) / masses

		ball1.x -= normVecX * spread * 1.1 * fr2
		ball1.y -= normVecY * spread * 1.1 * fr2
		ball2.x += normVecX * spread * 1.1 * fr1
		ball2.y += normVecY * spread * 1.1 * fr1

		let relativeXvelocity = ball2.v.x - ball1.v.x
		let relativeYvelocity = ball2.v.y - ball1.v.y
		let speed = relativeXvelocity * normVecX + relativeYvelocity * normVecY

		ball1.v.x += speed * normVecX * fr2 * 2
		ball1.v.y += speed * normVecY * fr2 * 2
		ball2.v.x -= speed * normVecX * fr1 * 2
		ball2.v.y -= speed * normVecY * fr1 * 2

		ball1.lastCollision == ball2

		return true
	}

	bounceWall(ball){

		if(ball.x + ball.r >= this.x && ball.v.x > 0){
			ball.x = this.x - ball.r
			ball.v.x = -ball.v.x
		}
		else if (ball.x - ball.r <= 0 && ball.v.x < 0){
			ball.x = ball.r
			ball.v.x = -ball.v.x
		}

		if(ball.y + ball.r >= this.y && ball.v.y > 0){
			ball.y = this.y - ball.r
			ball.v.y = -ball.v.y
		}
		else if(ball.y - ball.r <= 0 && ball.v.y < 0){
			ball.y = ball.r
			ball.v.y = -ball.v.y
		}
	}
}
class Ball {
	constructor(x, y, radius, velocity, mass){
		this.x=x
		this.y=y
		this.r = radius
		this.v = velocity || new Vector(0,0)
		this.m = mass || this.r
	}
	createElement(){
		return this.link($(`<div class="ball"></div>`).css({
			"width": `${2*this.r}px`,
			"height": `${2*this.r}px`,
			"border-radius": `${this.r*2}px`
		}))
	}
	link(element){
		this.element = $(element)
		return this.element
	}
	move(deltaTime){
		this.x += this.v.x * deltaTime
		this.y += this.v.y * deltaTime
	}
	placeRandomly(maxX, maxY){
		this.x = Math.random() * (maxX - 2 * this.r) + this.r
		this.y = Math.random() * (maxY - 2 * this.r) + this.r
	}
	randomVelocity(momentum){
		let angle = Math.random() * Math.PI * 2
		let speed = momentum / this.r
		this.v.x = speed * Math.cos(angle)
		this.v.y = speed * Math.sin(angle)
	}
	render(){
		this.element.css({"left": `${this.x - this.r}px`, "top": `${this.y - this.r}px`})
	}
}
class Vector {
	constructor(x, y){
		this.x = x
		this.y = y
	}
}

