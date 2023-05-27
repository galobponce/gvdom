/**
 * gvdom's JSX pragma
 *
 * @param {*} type
 * @param {*} props
 * @param  {...any} args
 */
export const gvdom = (type, props, ...args) => {
  const children = args.length ? [...args] : null
  return {
    type,
    props: props || {},
    children,
  }
}

/**
 * Checks if a prop is custom so it should not be in the real dom.
 *
 * @param {string} prop
 * @return {boolean} true if it is, false otherwise
 */
const isCustomProp = (prop) => {
  return isEventProp(prop)
}

/**
 * Checks if a prop is an event.
 *
 * @param {string} prop
 * @return {boolean} true if it is, false otherwise
 */
const isEventProp = (prop) => {
  return /^on/.test(prop)
}

/**
 * Adds a boolean prop.
 *
 * This is because in cases like checked={false} in JSX
 * are transformed into checked="false" wich is actually true.
 *
 * @param {HTMLElement} $element
 * @param {string} prop the prop's name
 * @param {boolean} value the prop's value
 */
const addBooleanProp = ($element, prop, value) => {
  if (value) {
    $element.setAttribute(prop, value)
    $element[prop] = true
  } else {
    $element[prop] = false
  }
}

/**
 * Parses an event name.
 *
 * Example: "onClick" => "click"
 *
 * @param {string} eventName
 * @return {string}
 */
const extractEventName = (eventName) => {
  return eventName.slice(2).toLowerCase()
}

/**
 * Adds all given props to an element.
 *
 * @param {HTMLElement} $element
 * @param {object} props
 */
const addProps = ($element, props) => {
  // If there is no props
  if (!Object.keys(props).length) return

  Object.keys(props).map((prop) => addProp($element, prop, props[prop]))
}

/**
 * Adds a given prop to an element.
 *
 * @param {HTMLElement} $element
 * @param {string} prop the prop's name
 * @param {*} value the prop's value
 */
const addProp = ($element, prop, value) => {
  if (isCustomProp(prop)) return

  if (typeof value === "boolean") {
    addBooleanProp($element, prop, value)
  } else {
    $element.setAttribute(prop, value)
  }
}

/**
 * Add the event listeners from the props to the given element.
 * @param {HTMLElement} $element
 * @param {object} props
 */
const addEventListeners = ($element, props) => {
  // If there is no props
  if (!Object.keys(props).length) return

  Object.keys(props)
    .filter(isEventProp)
    .map((event) =>
      $element.addEventListener(extractEventName(event), props[event])
    )
}

/**
 * Creates a DOM element given a JSX node.
 * @param {*} node
 * @return {HTMLElement} the node converted into a DOM element
 */
export const createElement = (node) => {
  // Handler for functional components
  if (typeof node.type === "function")
    return createElement(node.type(node.props))

  // Handler for text nodes
  if (typeof node === "string" || typeof node === "number")
    return document.createTextNode(node.toString())

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
