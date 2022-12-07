const el = document.createElement("div");
el.classList.add("container");

const style = `
  <style>
    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .whack1 {
      height: 50%;
      background: lightblue;
      position: relative;
    }

    .whack2 {
      height: 50%;
      background: lightred;
      position: relative;
    }

    .button-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }

    .vertical-bar {
      position: absolute;
      background: black;
      height: 100%;
      width: 1px;
      transform: translate(-50%, 0);
    }

    .horizontal-bar {
      position: absolute;
      background: black;
      width: 100%;
      height: 1px;
      transform: translate(0, -50%);
    }

    .whack-indicator {
      position: absolute;
      background: grey;
      width: 5px;
      height: 5px;
    }

    .whack-off {
      display: none;
    }
  </style>
`

const view = `
  ${style}
  <div class="whack1"></div>
  <div class="whack2"></div>
  <div class="button-container"><button>play</button></div>
`

el.innerHTML = view;

render(el);

const whack1 = el.querySelector(".whack1");
const whack2 = el.querySelector(".whack2");

const { width, height } = whack1.getBoundingClientRect();

const cellWidth = width/32;
const cellHeight = height/14;

const whack1Music = {};
const whack2Music = {};

for (let x = 0; x < 32; x++) {
  for (let y = 0; y < 14; y++) {
    whack1Music[`${x}_${y}`] = false;
    whack2Music[`${x}_${y}`] = false;

    const whackIndicator1 = document.createElement("div");
    whackIndicator1.classList.add("whack-indicator");
    whackIndicator1.classList.add(`whack-x${x}-y${y}`);
    whackIndicator1.classList.add(`whack-off`);
    whackIndicator1.style.left = `${x*cellWidth}px`;
    whackIndicator1.style.top = `${y*cellHeight}px`;
    whackIndicator1.style.width = `${cellWidth}px`;
    whackIndicator1.style.height = `${cellHeight}px`;
    whack1.append(whackIndicator1);

    const whackIndicator2 = document.createElement("div");
    whackIndicator2.classList.add("whack-indicator");
    whackIndicator2.classList.add(`whack-x${x}-y${y}`);
    whackIndicator2.classList.add(`whack-off`);
    whackIndicator2.style.left = `${x*cellWidth}px`;
    whackIndicator2.style.top = `${y*cellHeight}px`;
    whackIndicator2.style.width = `${cellWidth}px`;
    whackIndicator2.style.height = `${cellHeight}px`;
    whack2.append(whackIndicator2);
  }
}

for (let i = 0; i < 32; i++) {
  const el1 = document.createElement("div");
  el1.classList.add("vertical-bar");
  el1.style.left = `${cellWidth*i}px`;
  whack1.append(el1);

  const el2 = document.createElement("div");
  el2.classList.add("vertical-bar");
  el2.style.left = `${cellWidth*i}px`;
  whack2.append(el2);
} 


for (let i = 0; i < 14; i++) {
  const el1 = document.createElement("div");
  el1.classList.add("horizontal-bar");
  el1.style.top = `${cellHeight*i}px`;
  whack1.append(el1);

  const el2 = document.createElement("div");
  el2.classList.add("horizontal-bar");
  el2.style.top = `${cellHeight*i}px`;
  whack2.append(el2);
} 

function getMouse(e, el) { 
  const x = e.pageX - el.offsetLeft; 
  const y = e.pageY - el.offsetTop; 

  return [x, y];
}


whack1.addEventListener("click", (e) => {
  const [xpx, ypx ] = getMouse(e, whack1);
  
  const x = Math.floor(xpx/width*32);
  const y = Math.floor(ypx/height*14)-1;
  const key = `${x}_${y}`;
  const og = whack1Music[key];

  for (let i = 0; i < 14; i++) {
    const key = `${x}_${i}`;
    const whackIndicator = whack1.querySelector(`.whack-x${x}-y${i}`);
    whackIndicator.classList.add("whack-off");
    whack1Music[key] = false;
  }

  if (!og) {
    whack1Music[key] = true;
    const whackIndicator = whack1.querySelector(`.whack-x${x}-y${y}`);
    whackIndicator.classList.toggle("whack-off");
  }
})

whack2.addEventListener("click", (e) => {
  const [ xpx, ypx ] = getMouse(e, whack2);

  const x = Math.floor(xpx/width*32);
  const y = Math.floor(ypx/height*14)-1;
  const key = `${x}_${y}`;
  const og = whack2Music[key];
  
  for (let i = 0; i < 14; i++) {
    const key = `${x}_${i}`;
    const whackIndicator = whack2.querySelector(`.whack-x${x}-y${i}`);
    whackIndicator.classList.add("whack-off");
    whack2Music[key] = false;
  }

  if (!og) {
    whack2Music[key] = true;
    const whackIndicator = whack2.querySelector(`.whack-x${x}-y${y}`);
    whackIndicator.classList.toggle("whack-off");
  }
})

function getSong() {
  const song = [];

  
  for (let x = 0; x < 32; x++) {

    let whack1Note = 0;
    let whack2Note = 0;
    
    for (let y = 0; y < 14; y++) {
      const key = `${x}_${y}`;
      
      if (whack1Music[key]) {
        whack1Note = y;
        break;
      }      
    }

    for (let y = 0; y < 14; y++) {
      const key = `${x}_${y}`;
      
      if (whack2Music[key]) {
        whack2Note = y;
        break;
      }      
    }

    song.push([
      whack1Note,
      whack2Note
    ])
  }

  return song;
}

el.querySelector("button").addEventListener("click", () => {
  console.log(getSong());
  console.log(whack1Music, whack2Music);
})








