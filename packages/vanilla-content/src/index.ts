import "./index.styl"
import 'virtual:windi.css'
const container = document.querySelector("#app")
const editor = document.createElement("div")
editor.contentEditable="true"
editor.classList.add("shadow")
editor.classList.add("outline-none")
editor.classList.add("m-4")
editor.classList.add("p-4")
const span = document.createElement("span")
span.innerText="你好世界"
editor.append(span)
span.classList.add("deal-empty")

container.appendChild(editor)