$(window).scroll(function(){
	$("#left").css("margin-top", ($(window).innerWidth() > 1000 ? $(window).scrollTop() : 0) + "px")
})



$.getJSON("data/data.json", function(json){
	const DATA = json

	let [minYear, maxYear] = DATA.reduce(([min, max], item) => [
		Math.min(item["year"], min),
		Math.max(item["year"], max)
	], [2023, 2023])

	$("#fromyear").attr("min", minYear).attr("max", maxYear)
	$("#toyear").attr("min", minYear).attr("max", maxYear)

	const OBORY = {
		'MA': "Matematika",
		'FY': "Fyzika",
		'BIO': "Biologie",
		'IVT': "Informatika",
		'CH': "Chemie",
		'GE': "Geografie",
		'TV': "Tělesná výchova",
		'NS': "Nauka o společnosti",
		'SC': "Sociologie",
		'PO': "Politologie",
		'DĚ': "Dějepis",
		'PS': "neevim",
		'ČJ': "Český jazyk",
		'FJ': "Francouzský jazyk",
		'NJ': "Německý jazyk",
		'ŠP': "Španělský jazyk",
		'LAT': "Latina",
		'AJ': "Anglický jazyk",
		'IT': "Italský jazyk"
	}

	const FIELDS = {
		"sci": ["MA", "FY", "BIO", "IVT", "CH", "GE", "TV"],
		"soc": ["NS", "SC", "PO", "DĚ"],
		"hum": ["NS", "PS", "DĚ", "ČJ", "FJ", "NJ", "ŠP", "LAT", "AJ", "IT"],
	}

	FIELDS["all"] = []
	for(let field of Object.values(FIELDS))
		for(let obor of field)
			if(!FIELDS["all"].includes(obor))
				FIELDS["all"].push(obor)
	
	for(let obor of FIELDS["all"]){
	
		$("#obor").append(
			$("<option></option>").attr("value", obor).text(OBORY[obor])
		)
	}

	$("#reset-button").click(reset)
	$("#searchbox").keypress(function(e){
		if(e.which == 13)
			search($("#searchbox").val())
	})
	
	$("#search-button").click(() => search($("#searchbox").val()))
	
	$("#showmore").click(() => renderResults(true))
	
	function reset(){
	
		$("#searchbox").val("")
		$("#opt1").prop('checked', true)
		$("#opt2").prop('checked', true)
		$("#opt3").prop('checked', true)
		$("#opt4").prop('checked', true)
		$("#obor").val("all").change()
		$("#fromyear").val(minYear)
		$("#toyear").val(maxYear)
	}
	
	reset()
	
	
	function getField(obor){
	
		if(Object.keys(FIELDS).includes(obor))
			return FIELDS[obor]
	
		return obor
	}
	
	function createSearch(list){
	
		let keys = []
	
		if($("#opt1").prop('checked'))
			keys.push({
				name: "title", weight: 1
			})
		if($("#opt2").prop('checked'))
			keys.push({
				name: "keywords", getFn: (thesis) => thesis["keywords"].join("; "), weight: 0.8
			})
		if($("#opt3").prop('checked'))
			keys.push({
				name: "author", weight: 0.6
			})
		if($("#opt4").prop('checked'))
			keys.push({
				name: "supervisor", weight: 0.5
			})
	
		let options = {
			// isCaseSensitive: false,
			includeScore: true,
			shouldSort: true,
			// includeMatches: false,
			// findAllMatches: false,
			// minMatchCharLength: 1,
			// location: 0,
			threshold: 0.5,
			// distance: 100,
			// useExtendedSearch: false,
			ignoreLocation: true,
			// ignoreFieldNorm: false,
			// fieldNormWeight: 1,
			keys
		}
	
		console.log("options", options)
	
		return new Fuse(list, options)
	}
	
	let RESULTS
	
	function search(query){
	
		let obory = getField($("#obor").val())
		let yearmin = $("#fromyear").val()
		let yearmax = $("#toyear").val()
	
		let filtered = Object.values(DATA).filter(
			record => record["year"] <= yearmax && record["year"] >= yearmin && obory.includes(record["field"])
		)
	
		RESULTS = query ? createSearch(filtered).search(query).map(result => result.item) : filtered
	
		$(window).scrollTop(0)
		renderResults(false)
	}
	
	
	function renderResults(full = false){
		console.log(RESULTS)
	
		$("#results").html("")
	
		if(RESULTS.length == 0){
			$("#results").html("<br><br>Žádné výsledky")
		}
	
		let len = full ? RESULTS.length : Math.min(RESULTS.length, 20)
	
		if(len < RESULTS.length)
			$("#results").removeClass("full")
		else
			$("#results").addClass("full")
	
		for(let i = 0; i < len; i++){
	
			let result = RESULTS[i]
			$("#results").append(
				$("<div></div>").addClass("thesis-li").append(
					$("<a></a>").attr("href", `#${result["id"]}`).append(
						$("<h5></h5>").text(result["title"]),
						$("<p></p>").append(
							$("<span></span>").addClass("author").text(result["author"]),
							$("<span></span>").addClass("second").text(result["year"])
						),
						$("<p></p>").append(
							$("<span></span>").addClass("supervisor").text(result["supervisor"]),
							$("<span></span>").addClass("second").text(result["field"])
						)
					)
				).css({'animation-delay' : `${full? 0 : i/20}s`}).addClass(full ? "static" : 0)
			)
		}
	
	}
	
	let gethash = () => window.location.hash.slice(1)
	
	window.onhashchange = () => displayDetails(gethash())
	
	let scrolled = 0

	let citation = ""

	function cite(thesis){
		let krestni = thesis["author"].split(" ").slice(0, -1).join(" ")
		let prijmeni = thesis["author"].split(" ").slice(-1)[0].toUpperCase()
		let odkaz = `http://gymnaslo.cz/rocnikovky/data/docs/${thesis["id"]}.pdf`
		let now = new Date()
		let citovano = `[cit. ${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}]`
		citation = `${prijmeni}, ${krestni}. ${thesis["title"]} [online]. Brno, ${thesis["year"]} ${citovano}. Dostupné z: ${odkaz}. Ročníková práce. Gymnázium Brno, Slovanské náměstí. Vedoucí práce ${thesis["supervisor"]}`

		$("#citation").text(citation)
	}
	
	function displayDetails(id){
	
		if(id == ""){
	
			document.title = "Vyhledávání ročníkovek"
			$("#overlay").removeClass("show")
			$("#overlay").addClass("hide")
			$(window).scrollTop(scrolled)
			return
		}
	
		let thesis = DATA.filter(i => i["id"] == id)[0]
		console.log(id, thesis)
		document.title = `${thesis["title"]} - ročníková práce`

		$("#details-title").text(thesis["title"])
		$("#details-author").text(thesis["author"])
		$("#details-supervisor").text(thesis["supervisor"])
		$("#details-field").text(`${OBORY[thesis["field"]]} (${thesis["field"]})`)
		$("#details-date").text(thesis["year"])

		$("#details-keywords").text(thesis["keywords"].join("; "))
		$("#pdflink").attr("href", `/data/docs/${thesis["id"]}.pdf`)

		if(thesis["award"]){
			console.log("Award")
			$("#awards").addClass("show")
			$("#award").text(thesis["award"])
		}
		else
			$("#awards").removeClass("show")

		cite(thesis)
	
		$("#overlay").removeClass("hide")
		$("#overlay").addClass("show")
		scrolled = $(window).scrollTop()
	}

	$("#copybutton").click(function(){
		navigator.clipboard.writeText(citation).then(
			() => {
				//window.alert("citace zkopírována")
			},
			err => {
				window.alert("citaci se nezdařilo zkopírovat")
				console.log(err)
			}
		)
	})
	
	$("#overlay-close").click(() => window.location.hash = '')
	
	if(gethash() != "")
		displayDetails(gethash())
})
