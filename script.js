class Char {
    constructor (svg) {
        this.svg = svg;
        let widthString = svg.match(/width="(\d+(\.\d+)?)"/);
        this.width = parseInt(widthString[0].substring(7, widthString[0].length-1));
        let heightString = svg.match(/height="(\d+(\.\d+)?)"/);
        this.height = parseInt(heightString[0].substring(8, heightString[0].length-1));
        this.length = undefined;
    }
}
class CharDiv {
    constructor (svg) {
        this.svg = svg;
        this.dom = document.createElement("div");
        this.char = new Char(svg);
        this.dom.innerHTML = this.svg;
        this.char.length = this.dom.querySelector("path").getTotalLength();
        this.dom.style.height = this.char.height;
        this.dom.style.width = this.char.width;
        this.dom.style.setProperty("--length", this.char.length);
    }
    setScale(scale) {
        this.dom.style.height = this.char.height*scale;
        this.dom.style.width = this.char.width*scale;
        this.dom.querySelector("svg").style.height = this.char.height*scale;
        this.dom.querySelector("svg").style.width = this.char.width*scale;
        this.char.length = this.dom.querySelector("path").getTotalLength()*scale;
        this.dom.style.setProperty("--length", this.char.length);
    }
}

class Word {
    constructor(word) {
        this.word = word;
        this.duration = word.length*0.2+0.2;
        this.dom = document.createElement("div");
        this.dom.classList.add("word")
        if (word.includes("g")||word.includes("y")||word.includes("p")) {
            this.dom.style.alignItems = "flex-start"
        }
        this.maxHeight = 0;
        this.charArr = []
        word.split("").forEach((ele, ind) => {
            this.charArr.push(new CharDiv(bounder[ele]));
            if (this.charArr[ind].char.height>this.maxHeight) this.maxHeight = this.charArr[ind].char.height;
            this.dom.appendChild(this.charArr[ind].dom);
        });

    }
    animate () {
        let ticker = 0;
        let interval = setInterval(() => {
            this.charArr[ticker].dom.querySelector("path").style.transition = "0.4s stroke-dashoffset"
            this.charArr[ticker].dom.querySelector("path").style.strokeDashoffset = 0;
            ticker++;
            if (ticker===this.word.length) clearInterval(interval);
        }, 200);
    }
    setScale(scale) {
        this.charArr.forEach(ele => {ele.setScale(scale)});
    }
}


const sentence = {
    Will: new Word("Will"),
    you: new Word("you"),
    go: new Word("go"),
    to: new Word("to"),
    prom: new Word("prom"),
    withVar: new Word("with"),
    me: new Word("me?"),
}
const container = document.createElement("div");
const buttonContainer = document.createElement("div");
document.body.appendChild(container);
document.body.appendChild(buttonContainer);
const yes = document.createElement("div");
yes.textContent = "Yes!";
const no = document.createElement("div");
no.classList.add("no");

no.textContent = "No :(";
buttonContainer.appendChild(yes);
buttonContainer.appendChild(no);
let totalHeight = 0;
Object.keys(sentence).forEach(ele => {
    container.appendChild(sentence[ele].dom)
    totalHeight += sentence[ele].maxHeight+40;
})
let scale = window.innerHeight*0.75/totalHeight;
buttonContainer.style.fontSize = `${40*scale}px`
Object.keys(sentence).forEach(ele => {
    sentence[ele].setScale(scale);
})
let totalDuration = 0;

Object.keys(sentence).forEach(ele => {
    setTimeout(()=>{sentence[ele].animate()}, totalDuration*1000)
    console.log(totalDuration)
    totalDuration += sentence[ele].duration;
});
setTimeout(()=> {
    Object.keys(sentence).forEach(ele => {
        sentence[ele].dom.querySelectorAll("path").forEach(path => {path.style.fill = "pink"})
    })
    document.body.style.backgroundColor = "white";
    yes.classList.add("button");
    no.classList.add("button");
    yes.addEventListener("click", ()=>{alert("YAY!")});
    no.addEventListener("click", ()=> {
        no.style.zIndex = 999998;
        yes.style.zIndex = 999999;
        no.style.bottom = Math.random()*(window.innerHeight-no.offsetHeight);
        no.style.left= Math.random()*(window.innerWidth-no.offsetWidth);
    })
}, totalDuration*1000+100)

