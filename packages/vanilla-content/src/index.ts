const container = document.querySelector("#app")
const editor = document.createElement("div")
editor.contentEditable="true"
editor.classList.add("deal-empty")
editor.classList.add("shadow")
container.appendChild(editor)