alert("Type HELP to see commands");
var input = document.getElementById("current");
var lastQueries = [];
var inArray = 0;
var AddThis;
var prefix = ["Root"];
    input.setAttribute("data-prefix", prefix.join(" > ") + ":");
var returned;
var defCont = document.body.innerHTML;
var args;
var typeExist;
var gibrish;
var myDirs = [];
var myFiles = [];
var Root = {
    readme: "Hello_unfortunately_you_can't_have_spaces",
};

var currentDir = Root;
document.addEventListener('keydown', function(e){
    switch(e.keyCode){
        case 38:
            if(lastQueries.length > 0){
                e.preventDefault();
                input.innerHTML = lastQueries[inArray];
                inArray += (lastQueries.length - 1 > inArray) ? 1 : 0;
            }
            return;
            break;
            
        case 40:
            if(lastQueries.length > 0){
                if(inArray > 0)
                    inArray--;
                else{
                    input.innerHTML = "";
                    return;
                }
                input.innerHTML = lastQueries[inArray];
            }
            return;
            break;
            
        case 86:
            if(e.ctrlKey){
                navigator.clipboard.readText()
                    .then(text => {
                        input.innerHTML += text;
                    })
                    .catch(err => {
                        alert('Failed to read clipboard contents: ', err);
                    });
            }
            return;
            break;
            
        case 13:
            if(input.innerHTML != lastQueries[lastQueries.length-1])
                lastQueries.unshift(input.innerHTML);
            inArray = 0;
            process(input.innerHTML);
            input.innerHTML = "";
            scroll();
            return;
            break;
            
        case 8:
            inArray = 0;
            input.innerHTML = input.innerHTML.substring(0, input.innerHTML.length-1);
            return;
            break;
            
        default:
            return;
            break;
    }
});

document.addEventListener("keypress", function(e){
    if(e.keyCode != 13)
        input.innerHTML += String.fromCharCode(e.keyCode);
});

function process(text, ourinput){
    addThis = document.createElement("div");
    addThis.innerHTML = text;
    addThis.classList.add("input");
    addThis.setAttribute("data-prefix", prefix.join(" > ") + ":");
    insertBefore(addThis, input);
    
    exploded = text.split(" ");
    switch(exploded[0]){
        case "LENGTHOF":
            exploded.shift();
            LENGTHOF(exploded.join(" "));
            break;
            
        case "OPEN":
            exploded.shift();
            OPEN(exploded.join(" "));
            break;
            
        case "CLOSE":
            exploded.shift();
            CLOSE(exploded.join(" "));
            break;
            
        case "INFO":
            exploded.shift();
            INFO(exploded.join(" "));
            break;
            
        case "CREATE":
            exploded.shift();
            CREATE(exploded.join(" "));
            break;
            
        case "CLEAR":
            exploded.shift();
            CLEAR(exploded.join(" "));
            break;
            
        case "REWRITE":
            exploded.shift();
            REWRITE(exploded.join(" "));
            break;
            
        case "CALC":
            exploded.shift();
            CALC(exploded.join(" "));
            break;
            
        case "DELETE":
            exploded.shift();
            DELETE(exploded.join(" "));
            break;
            
        case "ENCRYPT":
            exploded.shift();
            ENCRYPT(exploded.join(" "));
            break;
        
        case "DECRYPT":
            exploded.shift();
            DECRYPT(exploded.join(" "));
            break;
            
        case "HASH":
            exploded.shift();
            HASH(exploded.join(" "));
            break;
            
        case "HELP":
            exploded.shift();
            HELP(exploded.join(" "));
            break;
            
        default:
            sayThis('<span class="highlight">'+exploded[0]+"</span> is not considered as valid command, type HELP to see valid commands");
            if(exploded[0].toUpperCase() != exploded[0])
                sayThis('<span class="highlight">NOTE:</span> type keywords all uppercase');
    }
    return;
}

function LENGTHOF(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 2, "LENGTHOF") === false)
        return;
        
    if(args[0] == "FILE"){
        if(currentDir.hasOwnProperty(args[1])==false){
            sayThis('<span class="highlight">LENGTHOF</span>: '+prefix.join(" > ")+' contains no file or directory named '+args[1]);
            return;
        }
        sayThis(currentDir[args[1]].length);
    }
    else if(args[0] == "TEXT"){
        sayThis(args[1].length);
    }
    else{
        sayThis('<span class="highlight">LENGTHOF</span>: '+args[0]+' is not considered as valid argument, use either FILE or TEXT');
    }
    return;
}

function OPEN(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 1, "OPEN") == false)
        return;
    
    if(currentDir.hasOwnProperty(args[0])==false){
        sayThis('<span class="highlight">OPEN</span>: '+prefix.join(" > ")+' contains no file or directory named '+args[0]);
        return;
    }
    
    if(typeof(currentDir[args[0]])===typeof("a")){
        fileContent = currentDir[args[0]].split("\n")
        fileContent.forEach(function(content, index){
            sayThis(content);
        });
        return;
    }
    
    if(currentDir !== Root){
        if(currentDir[args[0]] === currentDir.parentDir){
            prefix.pop();
            currentDir = currentDir.parentDir;
            input.setAttribute("data-prefix", prefix.join(" > ") + ":");
            return;
        }
    }
    
    prefix.push(args[0]);
    currentDir = currentDir[args[0]];
    input.setAttribute("data-prefix", prefix.join(" > ") + ":");
    return;
}

function CLOSE(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    argsNum(args.length, 0, "CLOSE");
    if(prefix.length == 1){
        sayThis('<span class="highlight">CLOSE</span>: cannot go above <span class="high">Root</span>');
        return;
    }
    currentDir = currentDir.parentDir;
    prefix.pop();
    input.setAttribute("data-prefix", prefix.join(" > ") + ":");
    return;
}

function INFO(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    argsNum(args.length, 0, "INFO");
    myDirs = [];
    myFiles = [];
    for(var prop in currentDir) {
        if(Object.prototype.hasOwnProperty.call(currentDir, prop)) {
            if(typeof(currentDir[prop])===typeof(Root))
                myDirs.push(prop);
            if(typeof(currentDir[prop])===typeof("a"))
                myFiles.push(prop);
        }
    }
    sayThis(myDirs.length+" Directories: "+myDirs.join(", "));
    sayThis(myFiles.length+" Files: "+myFiles.join(", "));
    return;
}

function CREATE(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 3, "CREATE") == false)
        return;
        
    if(typeof(currentDir[args[1]]) === typeof(Root["a b"])){
        if(args[0] == "DIR"){
            currentDir[args[1]] = {};
            currentDir[args[1]].parentDir = currentDir;
            if(args[2] == "TRUE"){
                currentDir = currentDir[args[1]];
                prefix.push(args[1]);
                input.setAttribute("data-prefix", prefix.join(" > ") + ":");
            }
            return;
        }
        else if(args[0] == "FILE"){
            currentDir[args[1]] = args[2];
        }
    }
    else{
        typeExist = (typeof(currentDir[args[1]]) === typeof("a")) ? "file" : "directory";
        sayThis('<span class="highlight">CREATE</span>: '+prefix.join(" > ")+' already contains '+typeExist+' named '+args[1]);
    }
}

function CLEAR(argument){
    currentDir = Root;
    prefix = ["Root"];
    document.body.innerHTML = defCont;
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 0, "CLEAR") == false)
        return;
    lastQueries = [];
    inArray = 0;
    input = document.getElementById("current");
    input.setAttribute("data-prefix", prefix.join(" > ") + ":");
    return;
}

function REWRITE(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 2, "REWRITE") == false)
        return;
        
    if(typeof(currentDir[args[0]]) === typeof("a")){
        currentDir[args[0]] = args[1];
    }
    else{
        sayThis('<span class="highlight">REWRITE</span>: '+prefix.join(" > ")+' doesn\'t contain a file named '+args[0]);
    }
}

function ENCRYPT(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 2, "ENCRYPT") === false)
        return;
    
    gibrish = Sentence.encrypt(args[0], args[1]);
    sayThis(gibrish);
    return;
}

function DECRYPT(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 2, "DECRYPT") === false)
        return;
    
    gibrish = Sentence.decrypt(args[0], args[1]);
    sayThis(gibrish);
    return;
}

function HASH(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 2, "HASH") === false)
        return;
        
    switch(args[1]){
        case "TRUE":
            args[1] = true;
            break;
        case "FALSE":
            args[1] = false;
            break;
        default:
            sayThis('<span class="highlight">HASH</span>: as 2nd argument expecting TRUE/FALSE, '+args[1]+' given');
            return;
            break;
    }
        
    gibrish = hashIt(args[0], args[1]);
    sayThis(gibrish);
    return;
}

function CALC(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 1, "CALC") === false)
        return;
        
    args[0] = args[0].split("PI").join("3.14159");
    args[0] = args[0].split("Pi").join("3.14159");
    args[0] = args[0].split("pi").join("3.14159");
        
    try{
        sayThis(eval(args[0]));
        return;
    }
    catch(err){
        sayThis("ERROR: "+err.message);
        return;
    }
}

function DELETE(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    if(argsNum(args.length, 1, "DELETE") == false)
        return;
    
    if(currentDir.hasOwnProperty(args[0])==false){
        sayThis('<span class="highlight">DELETE</span>: '+prefix.join(" > ")+' contains no file or directory named '+args[0]);
        return;
    }
    
    delete currentDir[args[0]];
    return;
}

function HELP(argument){
    args = (argument.length > 0) ? argument.split(" ") : "";
    argsNum(args.length, 0, "HELP");
        
    sayThis("<i>JS CMD BY FRANATRTUR</i>");
    sayThis("<i>TYPE ALL KEYWORDS UPPERCASE</i>");
    sayThis("<i>USE UP AND DOWN ARROWS TO LOAD COMMANDS FROM HISTORY</i>");
    sayThis("<i>ARGUMENTS ARE SEPARATED BY SPACES => DON'T USE SPACES IN NAMES OR MATH EXAMPLES</i>");
    sayThis("<i>LIST OF COMMANDS:</i>");
    sayThis("<span class='highlight'>LENGTHOF</span> [FILE/TEXT] [filename/text-to-evauluate] - returns length of file or typed text");
    sayThis("<span class='highlight'>OPEN</span> [filename/dirname] - if file, prints out file, if directory, opens directory");
    sayThis("<span class='highlight'>CLOSE</span> - goes up the directory");
    sayThis("<span class='highlight'>INFO</span> - prints info about the current directory");
    sayThis("<span class='highlight'>CREATE</span> DIR [name] [TRUE/FALSE] - creates directory with name. If TRUE, the directory is automaticaly opened");
    sayThis("<span class='highlight'>CREATE</span> FILE [name] [text] - creates file with the [text] as content");
    sayThis("<span class='highlight'>DELETE</span> [filename/dirname] - deletes the directory or file named [filename/dirname]");
    sayThis("<span class='highlight'>REWRITE</span> [filename] [text] - replaces the current content of the file with the [text] content");
    sayThis("<span class='highlight'>ENCRYPT</span> [text] [key] - returns the text encrypted by the key via MyCrypt->MCS cipher");
    sayThis("<span class='highlight'>DECRYPT</span> [encrypted text] [key] - returns the encrypted text decrypted by the key via cezzar2.1 cipher");
    sayThis("<span class='highlight'>HASH</span> [text] [TRUE/FALSE] - returns primitive hash of the text, if TRUE the result will be hexadecimal");
    sayThis("<span class='highlight'>CLEAR</span> - clears the console and history, but changes you made remain");
    sayThis("<span class='highlight'>CALC</span> - returns the result of following math example (don't use spaces) (type PI for working with pi)");
    sayThis("<span class='highlight'>HELP</span> - prints out all controls and commands");
    
    return;
}


function insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
}

function sayThis(what){
    addThis = document.createElement("div");
    addThis.innerHTML = what;
    addThis.classList.add("console");
    insertBefore(addThis, input);
}

function argsNum(argsArr, many = 0, calling = "UNCAUGHT"){
    if(argsArr != many){
        sayThis('<span class="highlight">'+calling+'</span>: expecting '+many+' argument/s, '+argsArr+' given');
        return false;
    }
    return true;
}

//Sentence.js v1.3 by FranaTrtur
//Copyright (c) 2020 František Artur Čech
var Sentence={_SubWord:function(e,n){(n=void 0===n||!!n)&&(e^=3383184987);var t=[e>>>24,e<<8>>>24,e<<16>>>24,e<<24>>>24],r=function(e){return(e<<3|e>>5)<<24>>>24};n?(t[1]^=t[0],t[2]^=t[1],t[3]^=t[2],t[2]^=r(t[3]),t[1]^=r(t[2]),t[0]^=r(t[1])):(t[0]^=r(t[1]),t[1]^=r(t[2]),t[2]^=r(t[3]),t[3]^=t[2],t[2]^=t[1],t[1]^=t[0]);var o=t[0]<<24|t[1]<<16|t[2]<<8|t[3];return n?o:3383184987^o},_DoExpandKey:function(e){var n,t=Sentence._SubWord((n=e[3])<<21|n>>>11,!0)^e[0]^452984832,r=t^e[1],o=r^e[2];return[t,r,o,o^e[3]]},_DoCryptBlock:function(e,n,t){t="number"==typeof t?t:7;for(var r=function(e,n){return e<<n|e>>>32-n},o=e.slice(0),c=n.slice(0),a=0;a<t;a++)o[0]=r(Sentence._SubWord(o[0],!0),3),o[1]=r(Sentence._SubWord(o[1],!0),11),o[2]=r(Sentence._SubWord(o[2],!0),19),o[3]=r(Sentence._SubWord(o[3],!0),27),o[0]^=c[0],o[1]^=o[0]^c[1],o[2]^=o[1]^c[2],o[3]^=o[2]^c[3],o[2]^=o[3],o[1]^=o[2],o[0]^=o[1],c=Sentence._DoExpandKey(c);return o},_DeCryptBlock:function(e,n,t){t="number"==typeof t?t:7;for(var r=function(e,n){return e<<n|e>>>32-n},o=[n],c=1;c<t;c++)o.unshift(Sentence._DoExpandKey(o[0]));for(var a,i=e.slice(0),u=0;u<t;u++)a=o[u],i[0]^=i[1],i[1]^=i[2],i[2]^=i[3],i[3]^=i[2]^a[3],i[2]^=i[1]^a[2],i[1]^=i[0]^a[1],i[0]^=a[0],i[0]=Sentence._SubWord(r(i[0],29),!1),i[1]=Sentence._SubWord(r(i[1],21),!1),i[2]=Sentence._SubWord(r(i[2],13),!1),i[3]=Sentence._SubWord(r(i[3],5),!1);return i},_DoXorBlocks:function(e,n){return[e[0]^n[0],e[1]^n[1],e[2]^n[2],e[3]^n[3]]},_RandWords:function(e){e="number"==typeof e?e:4;for(var n=[],t=0;t<e;t++)n[t]=Math.floor(4294967296*Math.random())<<0;return n},_DoPad:function(e){for(;e.length%16!=0;)e.push(0);return e},_UnPad:function(e){for(;0===e[e.length-1];)e.pop();return e},_DoFormat:function(e,n){n="number"==typeof n?n:4;for(var t=[],r=0;r<e.length;r+=n)t.push(e.slice(r,r+n));return t},_DeFormat:function(e){for(var n=[],t=0;t<e.length;t++)n=n.concat(e[t]);return n}};Sentence.CFB={encrypt:function(e,n,t,r){for(var o=Sentence._DoFormat(e),c=[r],a=0;a<o.length;a++)c[a]=Sentence._DoCryptBlock(c[a],n,t),o[a]=Sentence._DoXorBlocks(c[a],o[a]),c[a+1]=o[a];return Sentence._DeFormat(o)},decrypt:function(e,n,t,r){for(var o=Sentence._DoFormat(e),c=[r].concat(o),a=0;a<o.length;a++)c[a]=Sentence._DoCryptBlock(c[a],n,t),o[a]=Sentence._DoXorBlocks(c[a+1],c[a]);return Sentence._DeFormat(o)}},Sentence.CTR={encrypt:function(e,n,t,r,o){for(var c,a=Sentence._DoFormat(e),i=function(e){e.reverse();for(var n=0;n<e.length;n++){if(!(e[n]>=4294967295)){e[n]++;break}e[n]=0}return e.reverse()},u=Array.isArray(o)?o:[0,0],f=0;f<a.length;f++)c=Sentence._DoXorBlocks(r,u),c=Sentence._DoCryptBlock(c,n,t),a[f]=Sentence._DoXorBlocks(c,a[f]),i(u);return Sentence._DeFormat(a)},decrypt:function(e,n,t,r,o){return Sentence.CTR.encrypt(e,n,t,r,o)}},Sentence.CBC={encrypt:function(e,n,t,r){for(var o=Sentence._DoFormat(e),c=[r],a=0;a<o.length;a++)o[a]=Sentence._DoXorBlocks(o[a],c[a]),o[a]=Sentence._DoCryptBlock(o[a],n,t),c[a+1]=o[a];return Sentence._DeFormat(o)},decrypt:function(e,n,t,r){for(var o=Sentence._DoFormat(e),c=[r].concat(Sentence._DoFormat(e)),a=0;a<o.length;a++)o[a]=Sentence._DeCryptBlock(o[a],n,t),o[a]=Sentence._DoXorBlocks(o[a],c[a]);return Sentence._DeFormat(o)}},Sentence.Enc={},Sentence.Enc.Latin1={parse:function(e){for(var n=[],t=0;t<e.length;t++)n.push(e.charCodeAt(t));return n},stringify:function(e){for(var n="",t=0;t<e.length;t++)n+=String.fromCharCode(e[t]);return n}},Sentence.Enc.Base64={parse:function(e){return Sentence.Enc.Latin1.parse(atob(e))},stringify:function(e){return btoa(Sentence.Enc.Latin1.stringify(e))}},Sentence.Enc.Utf8={parse:function(e){return Sentence.Enc.Latin1.parse(unescape(encodeURIComponent(e)))},stringify:function(e){return decodeURIComponent(escape(Sentence.Enc.Latin1.stringify(e)))}},Sentence.Enc.Hex={parse:function(e){for(var n=[],t=0;t<e.length;t+=2)n.push(parseInt(e.charAt(t)+e.charAt(t+1),16));return n},stringify:function(e){for(var n="",t=0;t<e.length;t++)n+=("00"+e[t].toString(16)).substr(-2);return n}},Sentence.Enc.Words={to:function(e){for(var n=[],t=0;t<e.length;t+=4)n.push(e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3]);return n},from:function(e){for(var n=[],t=0;t<e.length;t++)n=n.concat([e[t]>>>24,e[t]<<8>>>24,e[t]<<16>>>24,e[t]<<24>>>24]);return n}},Sentence.DeriveKey=function(e,n){var t=function(e){for(var n,t=[],r=0;r<256;r++){n=r;for(var o=0;o<8;o++)n=1&n?3988292384^n>>>1:n>>>1;t[r]=n}for(var c=-1,a=0;a<e.length;a++)c=c>>>8^t[255&(c^e.charCodeAt(a))];return-1^c},r=[],o=Array.isArray(n)?Sentence.Enc.Latin1.stringify(Sentence.Enc.Words.from(n)):"ªU";return r[0]=t(e.split("").reverse().join("")+o+e),r[1]=t(r[0]+e+o.split("").reverse().join("")),r[2]=t(r[0]+e.split("").reverse().join("")+r[1]+o),r[3]=t(r[2]+o.split("").reverse().join("")+r[1]+e+r[0]+o),r},Sentence.encrypt=function(e,n,t,r){t="object"==typeof t?t:Sentence.CBC;var o=!!(r=void 0===r||!!r)&&Sentence._RandWords(2),c=Sentence.Enc.Words.to(Sentence._DoPad(Sentence.Enc.Utf8.parse(e))),a=Sentence.DeriveKey(n,o),i=Sentence._DoCryptBlock(Sentence._DoXorBlocks(a,o),Sentence._DoExpandKey(a)),u=t.encrypt(c,a,7,i);return{mode:t,words:u,salt:o,key:a,iv:i,toBytes:function(){return Sentence.Enc.Words.from(this.words)},toString:function(e,n){e="object"==typeof e?e:Sentence.Enc.Base64;var t=[];return(n=0!=this.salt&&(void 0===n||!!n))&&(t=Sentence.Enc.Latin1.parse("Salted__").concat(Sentence.Enc.Words.from(this.salt))),t=t.concat(this.toBytes()),e.stringify(t)}}},Sentence.decrypt=function(e,n,t){if(t="object"==typeof t?t:Sentence.CBC,"string"==typeof e)var r=Sentence.Enc.Base64.parse(e),o=(c="Salted__"===Sentence.Enc.Latin1.stringify(r.slice(0,8))&&Sentence.Enc.Words.to(r.slice(8,16)))?Sentence.Enc.Words.to(r.slice(16)):r;else if("object"==typeof e){var c=e.salt;o=e.words}var a=Sentence.DeriveKey(n,c),i=Sentence._DoCryptBlock(Sentence._DoXorBlocks(a,c),Sentence._DoExpandKey(a)),u=t.decrypt(o,a,7,i);return{mode:t,bytes:u=Sentence._UnPad(Sentence.Enc.Words.from(u)),salt:c,key:a,iv:i,toWords:function(){return Sentence.Enc.Words.to(this.bytes)},toString:function(e){return(e="object"==typeof e?e:Sentence.Enc.Utf8).stringify(this.bytes)}}};

function hashIt(string, hex){
	var hash = 0, i, chr;
	if(string.length === 0) return hash;
	for(i = 0; i < string.length; i++){
		chr = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	thisis = ((hash > 0) ? hash : 0xFFFFFFFF + hash + 1);
	return (hex === true) ? thisis.toString(16) : thisis;
}

function scroll(){
    window.scrollTo(0, 999999);
}

