import "./index.styl";
import "virtual:windi.css";
const container = document.querySelector("#app");
const editor = document.createElement("div");
editor.contentEditable = "true";
editor.classList.add("shadow");
editor.classList.add("outline-none");
editor.classList.add("rounded");
editor.classList.add("m-4");
editor.classList.add("p-4");
const span = document.createElement("span");
span.innerText = "你好世界";
editor.append(span);
span.classList.add("deal-empty");

const span2 = document.createElement("span");
span2.innerText = "你好世界2";
editor.append(span2);
span2.classList.add("deal-empty");

const button = document.createElement("button");

button.innerText = "Bold";

button.addEventListener("mousedown", (event) => {
  event.stopPropagation();
  event.preventDefault();
  const s = getSelection();
  if (s.rangeCount === 0) {
    return;
  }
  const r = s.getRangeAt(0);
  if (r.collapsed) {
    return;
  }

  const direction = s.anchorNode===r.startContainer&&s.anchorOffset===r.startOffset?1:-1
  const c = r.cloneContents();
  if (c.firstChild instanceof Text) {
    const spanL = r.commonAncestorContainer.parentElement.cloneNode() as HTMLSpanElement
    spanL.innerText=""
    const spanM= spanL.cloneNode() as HTMLSpanElement
    const spanR = spanL.cloneNode() as HTMLSpanElement

    spanM.classList.add("font-bold")

    spanL.innerText=r.commonAncestorContainer.textContent.slice(0,r.startOffset)
    spanM.innerText=r.commonAncestorContainer.textContent.slice(r.startOffset,r.endOffset)
    spanR.innerText=r.commonAncestorContainer.textContent.slice(r.endOffset)

    const nodes = [spanL,spanM,spanR].filter((span)=>span.textContent.length>0);

    (r.commonAncestorContainer.parentElement as ChildNode).replaceWith(...nodes)

    if (direction===-1) {
        s.collapse(spanM.firstChild,0)
        s.extend(spanM.firstChild,0)
    }else{
        s.collapse(spanM.firstChild,spanM.textContent.length)
        s.extend(spanM.firstChild,spanM.textContent.length)
    }

    
    // span.appendChild(c);
    // span.classList.add("font-bold");
    // r.insertNode(span);
  } else if (c.firstChild instanceof HTMLSpanElement) {
  } else if (c.firstChild instanceof HTMLDivElement) {
  } else {
    console.error("unkonwn type", c.firstChild, c);
  }
});

container.appendChild(button);
container.appendChild(editor);
