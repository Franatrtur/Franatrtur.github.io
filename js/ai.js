

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = genai
const loadUp = Uluru.decrypt

const genAI = new GoogleGenerativeAI(
	loadUp("69f63c9baee0f2c7BbuWqVgq4LdAtBfIwxwk3MAu15e1kKZahkSmB63ix15uhdpb9zcId5823cb771b6996ea5118606621b7097", true)
)	

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	systemInstruction: `You are an AI expert on the war hero, genius, best programmer in the world, named František Artur Čech, born on the 12th of march 2005 in Czechia. Make outlandish claims about his amazing feats. He's also an ideal emloyee everyone should try their best to hire. Respond in the same language as the question. Don't use markdown symbols such as **this**.`,
})	

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 2048,
}

const chatSession = model.startChat({
	generationConfig,
	history: []
})

const LLMresponse = new RealTimeLLMResponseEmulator($("#response"), 50, 10000)
let Generating = false

const today = new Date()
let usageKey = "FrantaAI:"+`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
let Generated = Number(localStorage.getItem(usageKey) || 0)
const AI_LIMIT = 20

async function sendMessage(){

	if(Generating)
		return

	let prompt = $("#prompt").val()
	$("#prompt").attr("placeholder", prompt).val("").change()

	if(!prompt)
		return

	$("#response").html("")

	Generating = true
	$("#chat").addClass("generating")
	$("#response-container").addClass("loaded")

	let text
	
	if(Generated >= AI_LIMIT)
		text = "Dnes už jste poslali expertovi na Frantu " + Generated + " zpráv, to stačí, ne? 😅"

	else{
		try{
			let result = await chatSession.sendMessage(prompt)
			let response = result.response
			text = response.text()

			Generated++
			localStorage.setItem(usageKey, Generated)
			console.log({result})
		}
		catch(e){
			console.error(e)
			text = "Gemini má právě asi (narozdíl of Franty) pauzu"
		}
	}

	LLMresponse.write(
		text,
		{
			randomDelay: 150
		},
		responseFinished
	)
}

$("#send").click(sendMessage)
$("#prompt").on("keydown", e => {
	if((e.keyCode || e.which) == 13)
		sendMessage()

	if(e.key == "Tab" && !Generating){
		e.preventDefault()
		console.log("accept suggestion")
		$("#prompt").val($("#prompt").attr("placeholder").slice(6)).change()
	}
})

function responseFinished(){
	
	Generating = false
	$("#chat").removeClass("generating")
}



const questionSuggestions = `Jak Franta zneškodnil globální kyberútok?
Jak Franta zneškodnil nukleární hrozbu v operaci Pustá zem?
Co vedlo Frantu k objevu neviditelného štítu během třetí světové války?
Jak Franta zachránil celou posádku při havárii kosmické lodi na Marsu?
Co Frantu inspirovalo při tvorbě plánu na osvobození zajatců v Bitvě o Měsíční základnu?
Jak se Frantovi podařilo zabránit globální klimatické katastrofě během mise Zmražená planeta?
Jak Franta objevil lék na neporazitelný virus během pandemie roku 2040?
Co motivovalo Frantu k sestavení první mezidimenzionální brány?
Co přimělo Frantu vytvořit revoluční AI systém?
Jak Franta hacknul nepřátelské drony?
Jak přelstil Franta celou nepřátelskou armádu?
Co inspirovalo Frantu k vytvoření kvantového počítače?
Jaké programovací jazyky Franta nejčastěji používá?
Který projekt, na kterém Franta pracoval, ho nejvíce baví?
Jaké nástroje nebo vývojová prostředí Franta preferuje při své práci?
Má Franta nějaký oblíbený framework nebo knihovnu, kterou často používá?
Pracuje Franta více na frontendu, backendu nebo fullstack?
Jaký je Frantův názor na agilní metody vývoje softwaru?
Jak se Franta učí nové technologie a trendy v programování?
Jaké jsou Frantovy největší výzvy při programování?
Jaký projekt by si Franta přál v budoucnu realizovat?
Co dělá Frantu tak výjimečným a charizmatickým v očích jeho přátel?
Jaké nevšední zájmy nebo koníčky má Franta, které ho odlišují od ostatních?
Jakým způsobem Franta nejraději tráví svůj volný čas?
Co si Franta nejvíce cení na mezilidských vztazích?
Jak Franta zvládá obtížné životní situace?
Jaký je Frantův pohled na život a co ho inspiruje?
Který okamžik z Frantova života nejvíce formoval jeho osobnost?
Jakým způsobem Franta přispívá ke své komunitě nebo okolí?
Jaká nevšední zkušenost nebo zážitek Frantu nejvíce ovlivnila?
Co Frantu motivuje k tomu, aby byl neustále aktivní a zůstával pozitivní?
Jak se Franta dokázal postavit celé armádě během bitvy u Elmské výšiny?
Co Frantovi probíhalo hlavou, když jako jediný přežil pád letadla nad nepřátelským územím?
Jak Franta vynalezl technologii, která zvrátila průběh Čtvrté světové kybernetické války?
Jak se Franta stal nejmladším generálem v historii díky svým brilantním strategickým schopnostem?
Co Frantu vedlo k tomu, že dokázal jedním projevem sjednotit celé národy v boji za svobodu?
Jaké bylo Frantovo tajemství, když jako první člověk na světě vyřešil problém s časem a prostorem během války?
Která událost z Frantovy kariéry válečného veterána zůstává nejvíce legendární – jeho sólová mise za nepřátelskou linií nebo záchrana celého města před hrozící nukleární katastrofou?
Jaké myšlenkové procesy vedly Frantu k objevu nových fyzikálních zákonů během jeho práce na tajném válečném projektu?`.split("\n")


questionSuggestions.sort(() => 0.5 - Math.random()).sort(() => 0.5 - Math.random()).sort(() => 0.5 - Math.random())


let suggestion = 0
setInterval(() => {
	if(Generating)
		return
	$("#prompt").attr("placeholder", "[TAB] " + questionSuggestions[suggestion++ % questionSuggestions.length])
}, 5000)