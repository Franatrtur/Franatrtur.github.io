
const maxX = $("#content").width()
const maxY = $("#content").height()
let ballNumber = 1


function createImageBall(path, confidence, scale=1){

	let name = path.split(".")[0].split("/").reverse()[0] //get ball name
	let r = (0.5 + maxX/2000) * (20 + confidence/2)

	let ball = new Ball(0, 0, r)
	ball.placeRandomly(maxX, maxY)
	ball.randomVelocity(1000)

	let element = ball.createElement()
	
	$(element).css({"animation": "ballappear 1s ease " + (ballNumber++) / 2 + "s both"}).click(() => {

		closeBallDetails()
		if($(element).hasClass("clicked"))
			return

		$(element).addClass("clicked")
		$("#balldetail").addClass("show")
		$("#detailhdr img").attr("src", path)
		$("#detailhdr h2").text(name)
		$(barlength).css({"width": confidence + "%"})


	}).addClass("imgball").css({"--color": "white"}).append(
		$(`<img src="${path}">`).css({
			"width": 2*scale*r+"px",
			"height": 2*scale*r+"px"
		})
	)

	return ball
}

function closeBallDetails(){
	$(".ball").removeClass("clicked")
	$("#balldetail").removeClass("show")
}

$("#close").click(closeBallDetails)


let balls = [
	createImageBall("img/skills/javascript.png", 100, 1.35),
	createImageBall("img/skills/css.png", 100, 1.35),
	createImageBall("img/skills/html.png", 100, 1.35),
	createImageBall("img/skills/jquery.png", 75, 1.35),
	createImageBall("img/skills/nodejs.png", 85, 1.35),
	createImageBall("img/skills/figma.png", 60, 1),
	createImageBall("img/skills/github.png", 70, 1.5),
	createImageBall("img/skills/sql.png", 30, 0.8),
	createImageBall("img/skills/mongodb.png", 40, 0.8),
	createImageBall("img/skills/python.png", 95, 1),
	createImageBall("img/skills/gemini api.png", 45, 1),
	createImageBall("img/skills/typescript.png", 65, 1.1),
	createImageBall("img/skills/flask.png", 35, 0.8),
	createImageBall("img/skills/ruby.svg", 25, 0.9),
	createImageBall("img/skills/kryptografie.png", 50, 0.7),
	createImageBall("img/skills/php.png", 50, 1.35),
]

const Billiard = new BallsAnimation(balls, $("#content"), maxX/1000*4, maxX > 500 ? 60 : 40)

$(window).on("load", () => {

	Billiard.start()
	for(let i = 0; i < 20; i++)
		Billiard.frame() //get balls to not overlap
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