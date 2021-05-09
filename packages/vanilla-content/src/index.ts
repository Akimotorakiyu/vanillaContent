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
editor.classList.add("editor");

const firstLine = document.createElement("div");
firstLine.classList.add("deal-empty");
firstLine.classList.add("line");

const span = document.createElement("span");
span.innerText = "你好世界";
firstLine.append(span);
span.classList.add("deal-empty");
span.classList.add("meta");

const span2 = span.cloneNode() as HTMLSpanElement;
span2.innerText = "你好世界2";
firstLine.append(span2);
span2.classList.add("deal-empty");
span2.classList.add("meta");

editor.appendChild(firstLine);

const button = document.createElement("button");

button.innerText = "Bold";

function normal() {
  editor.normalize();
  editor.childNodes.forEach((line) => {
    line.childNodes.forEach((block) => {
      if (block.textContent.length === 0) {
        block.remove();
      }
    });

    if (line.textContent.length === 0) {
      line.remove();
    }
  });
}

editor.addEventListener("input", (e) => {
  const event = e as InputEvent;
  if (event.inputType == "deleteContentBackward") {
    normal();
    if (!(editor.firstChild instanceof HTMLDivElement)) {
      console.log("insert new")
      const firstLine = document.createElement("div");
      firstLine.classList.add("deal-empty");
      firstLine.classList.add("line");

      const span = document.createElement("span");
      firstLine.append(span);
      span.classList.add("deal-empty");
      span.classList.add("meta");
      const text = new Text()
      span.appendChild(text)
      editor.appendChild(firstLine);

      
      const s=getSelection()

      s.collapse(span.firstChild, 0);
      s.extend(span.firstChild, 0);
    }
  }
});
document.addEventListener("selectionchange",(e)=>{
  const s =getSelection();
  const an = s.anchorNode
  if (an==editor) {
   s.collapse(an.firstChild.firstChild.firstChild,0)
   s.extend(an.lastChild.lastChild.lastChild,an.lastChild.lastChild.lastChild.textContent.length)
  }
})
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

  const direction =
    s.anchorNode === r.startContainer && s.anchorOffset === r.startOffset
      ? 1
      : -1;
  const c = r.cloneContents();
  if (c.firstChild instanceof Text) {
    // 三段法
    // 选中全部 -> 在中间
    // 选中开头 -> 在中间
    // 选中结尾 -> 在中间
    // 选中中间 -> 在中间
    const spanL = r.commonAncestorContainer.parentElement.cloneNode() as HTMLSpanElement;
    spanL.innerText = "";
    const spanM = spanL.cloneNode() as HTMLSpanElement;
    const spanR = spanL.cloneNode() as HTMLSpanElement;

    spanM.classList.add("font-bold");

    spanL.innerText = r.commonAncestorContainer.textContent.slice(
      0,
      r.startOffset
    );
    spanM.innerText = r.commonAncestorContainer.textContent.slice(
      r.startOffset,
      r.endOffset
    );
    spanR.innerText = r.commonAncestorContainer.textContent.slice(r.endOffset);

    const nodes = [spanL, spanM, spanR].filter(
      (span) => span.textContent.length > 0
    );

    (r.commonAncestorContainer.parentElement as ChildNode).replaceWith(
      ...nodes
    );

    if (direction === -1) {
      s.collapse(spanM.firstChild, 0);
      s.extend(spanM.firstChild, spanM.textContent.length);
    } else {
      s.collapse(spanM.firstChild, spanM.textContent.length);
      s.extend(spanM.firstChild, 0);
    }
  } else if (c.firstChild instanceof HTMLSpanElement) {
    const c = r.extractContents();
    c.childNodes.forEach((span) => {
      (span as HTMLSpanElement).classList.add("font-bold");
    });
    r.insertNode(c);
  } else if (c.firstChild instanceof HTMLDivElement) {
    const startContainer = r.startContainer.parentElement
      .parentElement as HTMLDivElement;
    const endContainer = r.endContainer.parentElement
      .parentElement as HTMLDivElement;

    const c = r.extractContents();

    c.childNodes.forEach((div) => {
      (div as HTMLDivElement).childNodes.forEach((span) => {
        (span as HTMLSpanElement).classList.add("font-bold");
      });
    });

    const tl = c.childNodes.item(0).firstChild;
    const tr = (c.childNodes.item(c.childNodes.length - 1) as HTMLDivElement)
      .lastChild;

    startContainer.append(...c.childNodes.item(0).childNodes);
    endContainer.firstChild.before(
      ...c.childNodes.item(c.childNodes.length - 1).childNodes
    );

    c.childNodes.item(0).remove();
    c.childNodes.item(c.childNodes.length - 1).remove();

    r.insertNode(c);

    if (direction === -1) {
      s.collapse(tl.firstChild, 0);
      s.extend(tr.firstChild, tr.textContent.length);
    } else {
      s.collapse(tr.firstChild, tr.textContent.length);
      s.extend(tl.firstChild, 0);
    }
  } else {
    console.error("unkonwn type", c.firstChild, c);
  }

  normal();
});

container.appendChild(button);
container.appendChild(editor);
