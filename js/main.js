
function goto(self, delay = 400){
	console.log(self, $(self), $(self).attr("--data-href"))
	$("#nav a").removeClass("active")
	$(self).addClass("active")
	setTimeout(() => {
		window.location.href = $(self).attr("--data-href")
	}, delay)
}

