let startX, startY, isDragging = false;
screenshoting=false

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
         let link = document.createElement("a");
         link.href = canvas.toDataURL();
         await fetch('https://secret404.onrender.com/post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: link.href }),
          })
            .then((res) => res.json())
            .then((data) => {
                let answer=document.createElement("p");
                answer.innerText=data.text;
                document.body.appendChild(answer);
                chrome.runtime.sendMessage({ type: "dataFromContent", data: data.text });
                console.log(data);
            });
        });
         selectionBox.style.display = "none"; // Hide the selection box
  screenshoting=false
}

document.addEventListener("keydown",(event)=>{
    if((event.ctrlKey || event.metaKey) && event.key === "`"){
        screenshoting=true
        console.log("keydown")
    }
   
});


