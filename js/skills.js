
mx = $("#content").width()
my = $("#content").height()
let t = 1

function TextBall(name, confidence, color="black", fontSize="2rem"){
	
	let r = (0.5 + mx/2000) * (20 + confidence/2)

	let ball = new Ball(0, 0, r)
	ball.placeRandomly(mx, my)
	ball.randomVelocity(1000)

	let element = ball.createElement()
	
	$(element).attr(
		"title",
		`${name} - umím tak na ${confidence}%`
	).css({
		"animation": "ballappear 1s ease "+(t++)/2+"s both"
	}).text(name).addClass("textball").css({
		"--color": color,
		"font-size": fontSize
	})

	return ball
}
function ImageBall(path, confidence, scale=1){

	let name = path.split(".")[0].split("/").reverse()[0] //get ball name
	let r = (0.5 + mx/2000) * (20 + confidence/2)

	let ball = new Ball(0, 0, r)
	ball.placeRandomly(mx, my)
	ball.randomVelocity(1000)

	let element = ball.createElement()
	
	$(element).css({"animation": "ballappear 1s ease "+(t++)/2+"s both"}).attr(
		"title",
		`${name} - umím tak na ${confidence}%`
	).addClass("imgball").css({"--color": "white"}).append(
		$(`<img src="${path}">`).css({
			"width": 2*scale*r+"px",
			"height": 2*scale*r+"px"
		})
	)
	return ball
} 


let balls = [
	ImageBall("img/skills/js.png", 100, 1.35),
	ImageBall("img/skills/css.png", 100, 1.35),
	ImageBall("img/skills/html.png", 100, 1.35),
	ImageBall("img/skills/jquery.png", 75, 1.35),
	ImageBall("img/skills/nodejs.png", 85, 1.35),
	ImageBall("img/skills/figma.png", 60, 1),
	ImageBall("img/skills/github.png", 70, 1.5),
	TextBall("SQL", 35, "darkorange", "2rem"),
	ImageBall("img/skills/mongodb.png", 40, 0.8),
	ImageBall("img/skills/python.png", 95, 1),
	ImageBall("img/skills/gemini api.png", 45, 1),
	ImageBall("img/skills/typescript.png", 65, 1.1),
	ImageBall("img/skills/flask.png", 35, 0.8),
	ImageBall("img/skills/ruby.svg", 25, 0.9),
	ImageBall("img/skills/kryptografie.png", 50, 0.7),
	ImageBall("img/skills/php.png", 50, 1.35),
]

const Billiard = new BallsAnimation(balls, $("#content"), mx/1000*4, mx > 500 ? 60 : 40)

$(window).on("load", () => {

	Billiard.start()
	Billiard.frame() //get balls to not overlap
	Billiard.frame()
	Billiard.stop()

	setTimeout(()=>{

		$("#toggle").toggleClass("switched")
		setTimeout(()=>Billiard.toggle(), 200)
	}, 10000)
})


$("#toggle").click(() => {
	$("#toggle").toggleClass("switched")
	Billiard.toggle()
})