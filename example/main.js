/** @jsx gvdom */
import { gvdom, createElement } from "../src/index"

const Title = ({ text }) => <h1 class="title">{text}</h1>

document.body.appendChild(createElement(<Title text="Hola" />))
