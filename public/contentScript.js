let startX, startY, isDragging = false;
screenshoting=false
let offsetXInput, offsetYInput,offsetYCard,offsetXCard;
let promptDragging = false;
let cardDragging = false;
let imageData=""
let promptData=""
/*chrome*/

console.log('contentScript.js loaded');

const newDiv = document.createElement("div");
newDiv.id = "captureBox";
document.body.appendChild(newDiv);
const selectionBox = document.getElementById("captureBox");



document.addEventListener("mousedown",(event)=>{
  console.log("mousedown")

  if(screenshoting){
    console.log("screenshoting")

    startSelection(event)
}});

function startSelection(e) {
    console.log("startSelection")


   startX = e.clientX;
   startY = e.clientY;
   selectionBox.style.left = `${startX}px`;
   selectionBox.style.top = `${startY}px`;
   selectionBox.style.width = "0px";
   selectionBox.style.height = "0px";
   selectionBox.style.display = "block";
   isDragging = true;
   document.body.addEventListener("mousemove", resizeSelection);
   document.body.addEventListener("mouseup", endSelection);
}

function resizeSelection(e) {
    console.log("resizeSelection")
   if (!isDragging) return;
   const width = e.clientX - startX;
   const height = e.clientY - startY;
   selectionBox.style.width = `${Math.abs(width)}px`;
   selectionBox.style.height = `${Math.abs(height)}px`;
   if (width < 0) selectionBox.style.left = `${e.clientX}px`;
   if (height < 0) selectionBox.style.top = `${e.clientY}px`;
}

function endSelection() {
  console.log("endSelection")
   isDragging = false;
   document.body.removeEventListener("mousemove", resizeSelection);
   document.body.removeEventListener("mouseup", endSelection);

   // Take screenshot of selected area
   const rect = selectionBox.getBoundingClientRect();
   html2canvas(document.body, { x: rect.left, y: rect.top, width: rect.width, height: rect.height })
   .then(async canvas => {
      
      imageData = canvas.toDataURL();
      console.log(imageData)
      console.log({ image: imageData, prompt: promptData})
      await fetch('https://secret404.onrender.com/post', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageData, prompt: promptData }),
      })
          .then((res) => res.json())
          .then((data) => {
              const card = document.createElement("div");
              card.style.position = "absolute";
              card.innerHTML=`
                    <div class="card"><span id="answer">ANSWER:</span>
                      <div id="typing-effect"></div>
                      <div class="card-footer">Made With Love &lt;3</div>
                    </div>
              `
              document.body.appendChild(card);
              const cardAnswers = document.querySelector(".card");
              const text = `${data.text}`;
  
              const typingEffectElement = document.getElementById("typing-effect");
              let index = 0;
  
            function type() {
              if (index < text.length) {
              typingEffectElement.textContent += text.charAt(index);
              index++;
  
              const delay = text.charAt(index - 1) === "\n" ? 100 : 30;
              setTimeout(type, delay);
              }
            }
  
            type();
            card.addEventListener("mousedown", (e) => {
              console.log("mousedowncard")
              cardDragging = true;
              offsetXCard = e.clientX - card.offsetLeft;
              offsetYCard = e.clientY - card.offsetTop;
            });

            document.addEventListener("mousemove", (e) => {

              if (cardDragging ) {
                console.log("cardDragging")
                card.style.left = `${e.clientX - offsetXCard}px`;
                card.style.top = `${e.clientY - offsetYCard}px`;
                console.log(e.clientX,e.clientY.offsetXCard)
              }
            });

            document.addEventListener("mouseup", () => {
              console.log("mouseupcard")
              cardDragging = false;
            });
          });      

     });

  selectionBox.style.display = "none"; 
  screenshoting=false
}
function getPrompt() {
  return new Promise((resolve) => {
    const prompt = document.createElement("div");
    prompt.className = "prompt";
    prompt.innerHTML = `
        <div class="form"  >
            <label for="search">
                <input name="prompt" class="input" type="text" required="" placeholder="Write your prompt" id="search">
                <div class="fancy-bg"></div>
                <div class="search">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr">
                        <g>
                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                        </g>
                    </svg>
                </div>
                <button class="close-btn" type="reset">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </label>
        </div>
    `;
    
    document.body.appendChild(prompt);
    const inputArea = document.body.querySelector(".form");
    inputArea.addEventListener("mousedown", (e) => {
      console.log("mousedownprompt")
      promptDragging = true;
      offsetXInput = e.clientX - inputArea.offsetLeft;
      offsetYInput = e.clientY - inputArea.offsetTop;

    });
    
    document.addEventListener("mousemove", (e) => {
      if (promptDragging ) {
        inputArea.style.left = `${e.clientX - offsetXInput}px`;
        inputArea.style.top = `${e.clientY - offsetYInput}px`;
      }
    });
    
    document.addEventListener("mouseup", () => {
      promptDragging = false;
    });
    if(document.body.querySelector(".input")){
      console.log("input")
      document.body.querySelector(".input").addEventListener("keydown",(event)=>{
        if(event.key==="Enter"){
          promptData=document.body.querySelector(".input").value
          console.log(promptData)
          screenshoting=true
        }
    })}
  });
}

function getBackendData (){
  console.log ({ image: imageData, prompt: promptData})

}




document.addEventListener("keydown",(event)=>{
    if((event.ctrlKey || event.metaKey) && event.key === "`"){
        getPrompt()
        console.log("keydown")
    }
   
});


