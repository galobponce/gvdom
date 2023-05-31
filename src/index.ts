import {
  JsxNode,
  JsxPragma,
  GvdomNode,
  NodeProps,
  StringOrBooleanOrNumber,
} from "./types"

/**
 * Gvdom's JSX pragma
 */
export const gvdom: JsxPragma = (type, props, ...children): GvdomNode => {
  return {
    type,
    props: props || {},
    children,
  }
}

/**
 * Checks if a value is a function or not.
 *
 * @return {boolean} true if it is, false otherwise
 */
const isFunction = (value: any): boolean => typeof value === "function"

/**
 * Parses an event name.
 *
 * Example: "onClick" => "click"
 *
 * @return {string} the event name parsed
 */
const extractEventName = (eventName: string): string => {
  return eventName.slice(2).toLowerCase()
}

/**
 * Adds all given props to an element.
 */
const addProps = ($element: HTMLElement, props: NodeProps) => {
  if (!props) return

  Object.keys(props).map((propName) => {
    if (isFunction(props[propName])) return // Ignore event listeners

    addProp($element, propName, props[propName] as StringOrBooleanOrNumber)
  })
}

/**
 * Adds a specific given prop to an element.
 */
const addProp = (
  $element: HTMLElement,
  propName: string,
  value: StringOrBooleanOrNumber
) => {
  if (typeof value === "boolean") {
    $element.toggleAttribute(propName, value)
  } else if (typeof value === "number" || typeof value === "string") {
    $element.setAttribute(propName, value.toString())
  }
}

/**
 * Add all event listeners from given props to an element.
 */
const addEventListeners = ($element: HTMLElement, props: NodeProps) => {
  if (!props) return

  Object.keys(props).map((propName) => {
    // Ignore everything except event listeners
    if (!isFunction(props[propName])) return

    addEventListener($element, propName, props[propName] as EventListener)
  })
}

/**
 * Add a specific event listener and its value to the given element.
 */
const addEventListener = (
  $element: HTMLElement,
  propName: string,
  value: EventListener
) => {
  $element.addEventListener(extractEventName(propName), value)
}

/**
 * Creates a DOM element given a JSX node.
 *
 * @return {HTMLElement | Text} the node converted into a DOM element
 */
export const createElement = (node: JsxNode): HTMLElement | Text => {
  // Handler for text or number nodes
  if (typeof node === "string" || typeof node === "number")
    return document.createTextNode(node.toString())

  // Handler for functional components
  if (typeof node.type === "function")
    return createElement(node.type(node.props))

  const $element = document.createElement(node.type)

  addProps($element, node.props)

  addEventListeners($element, node.props)

  // Uses recursion to create and append its children to the element
  node.children &&
    node.children.map((child) => {
      $element.appendChild(createElement(child))
    })

  return $element
}
