/**
 * gvdom's JSX pragma
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
 * Checks if a property is an event.
 * @param {string} prop
 * @return {boolean} true if it is an event, false otherwise
 */
const isEventProp = (prop) => {
  return /^on/.test(prop)
}

/**
 * Special treatment for boolean props.
 *
 * This is because in cases like checked={false} in JSX
 * are transformed into checked="false" wich is actually true.
 * @param {HTMLElement} $element
 * @param {string} prop
 * @param {boolean} value
 */
const setBooleanProp = ($element, prop, value) => {
  if (value) {
    $element[prop] = true
  } else {
    $element[prop] = false
  }
}

/**
 * Parses an event name.
 *
 * Example: "onClick" => "click"
 * @param {string} eventName
 * @return {string}
 */
const extractEventName = (eventName) => {
  return eventName.slice(2).toLowerCase()
}

/**
 * Add the attributes from the props to the given element.
 * @param {HTMLElement} $element
 * @param {object} props
 */
const setAttributes = ($element, props) => {
  // If there is no props
  if (!Object.keys(props).length) return

  Object.keys(props)
    .filter((prop) => !isEventProp(prop))
    .map((prop) => {
      $element.setAttribute(prop, props[prop])

      if (typeof props[prop] === "boolean") {
        setBooleanProp($element, prop, props[prop])
      }
    })
}

/**
 * Add the event listeners from the props to the given element.
 * @param {HTMLElement} $element
 * @param {object} props
 */
const addEventListeners = ($element, props) => {
  if (!props) return

  Object.keys(props)
    .filter(isEventProp)
    .forEach((event) =>
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
    return document.createTextNode(node)

  const $element = document.createElement(node.type)

  setAttributes($element, node.props)

  addEventListeners($element, node.props)

  // Uses recursion to create and append its children to the element
  node.children &&
    node.children.map((child) => {
      $element.appendChild(createElement(child))
    })

  return $element
}
