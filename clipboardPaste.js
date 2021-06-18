let resizable = false;      // To track b/w resizing & drag/drop

document.addEventListener("paste", function (e) {
    try {
        let item = e.clipboardData.items[0];

        if (item.type.indexOf("image") === 0) {
            let blob = item.getAsFile();
            let reader = new FileReader();
            reader.onload = function (e) {
                let pasteImg = document.createElement("div");
                pasteImg.setAttribute("class", "paste-img");
                let img = document.createElement("img");
                img.src = e.target.result;
                img.style.width = "100%";
                img.style.height = "100%";
                pasteImg.appendChild(img);
                setClipboardImageProp(pasteImg);
                document.body.appendChild(pasteImg);
            }

            reader.readAsDataURL(blob);
        }
    }
    catch (e) {
        console.log(e);
    }
})

function setClipboardImageProp(pasteImg) {
    try {
        // To resize img
        pasteImg.addEventListener("dblclick", (e) => {
            resizable = !resizable;
            if (resizable) pasteImg.style.resize = "both";
            else pasteImg.style.resize = "none";
        })

        // To delete img
        // Shift key pressed with click to delete img
        pasteImg.addEventListener("click", (e) => {
            if (e.shiftKey) pasteImg.remove();         
        })

        // To drag and drop img
        pasteImg.addEventListener("mousedown", function (e) {
            if (resizable) return;

            let shiftX = e.clientX - pasteImg.getBoundingClientRect().left;
            let shiftY = e.clientY - pasteImg.getBoundingClientRect().top;

            //This keeps the ticket at same position where the mouse clicked, wherever you drag the ticket
            function moveAt(pageX, pageY) {  
                pasteImg.style.left = pageX - shiftX + "px";  
                pasteImg.style.top = pageY - shiftY + "px";
            }

            moveAt(e.pageX, e.pageY);
            function moveImg(e) {
                moveAt(e.pageX, e.pageY);
            };

            pasteImg.addEventListener("mousemove", moveImg);
            pasteImg.addEventListener("mouseup", (e) => {
                pasteImg.removeEventListener("mousemove", moveImg);
            })

            //To have no effect on default draggable from browser on elements
            pasteImg.ondragstart = function () {  
                return false;
            }
        })
    }
    catch (e) {
        console.log(e);
    }
}