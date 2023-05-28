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
 * Removes a boolean prop.
 *
 * @param {HTMLElement} $element
 * @param {string} prop the prop's name
 */
const removeBooleanProp = ($element, prop) => {
  $element.removeAttribute(prop)
  $element[prop] = false
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
 * Removes a given prop from an element.
 *
 * @param {HTMLElement} $element
 * @param {string} prop the prop's name
 * @param {*} value the prop's value
 */
const removeProp = ($element, prop, value) => {
  if (isCustomProp(prop)) {
    return
  } else if (typeof value === "boolean") {
    removeBooleanProp($element, prop)
  } else {
    $element.removeAttribute(prop)
  }
}

/**
 * Add the event listeners from the props to the given element.
 * @param {HTMLElement} $element
 * @param {object} props
 */
const addEventListeners = ($element, props) => {
  Object.keys(props)
    .filter(isEventProp)
    .map((event) => addEventListener($element, event, props[event]))
}

/**
 * Add the given event listener and its value to the given element.
 * @param {HTMLElement} $element
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} value
 */
const addEventListener = ($element, event, value) => {
  $element.addEventListener(extractEventName(event), value)
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

/**
 * Checks if a two nodes are different or not.
 * @param {*} node
 * @return {boolean} true if they are, false otherwise
 */
const areNodesDifferent = (node1, node2) => {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    node1.type !== node2.type
  )
}

/**
 * Updates an HTML element's prop depending on difference between the values of the prop passed
 * @param {HTMLElement} $element the parent of the nodes
 * @param {*} prop
 * @param {*} newValue
 * @param {*} oldValue
 */
const updateProp = ($element, prop, newValue, oldValue) => {
  if (!newValue) {
    removeProp($element, prop, oldValue)
  } else if (!oldValue || newValue !== oldValue) {
    addProp($element, prop, newValue)
  }
}

/**
 * Updates an HTML element's props depending on difference between the props passed
 * @param {HTMLElement} $element the parent of the nodes
 * @param {object} newProps
 * @param {object} oldProps
 */
const updateProps = ($element, newProps, oldProps) => {
  const props = Object.assign({}, newProps, oldProps)
  Object.keys(props).map((name) => {
    updateProp($element, name, newProps[name], oldProps[name])
  })
}

/**
 * Updates the event listeners from the props to the given element re-adding them.
 * @param {HTMLElement} $element
 * @param {object} newProps
 * @param {object} oldProps
 */
const updateEventListeners = ($element, newProps, oldProps) => {
  // Gets the event listeners from the props
  const props = Object.assign({}, newProps, oldProps)
  const events = new Set(Object.keys(props).filter((prop) => isEventProp(prop)))

  events.forEach((event) => {
    updateEventListener(
      $element,
      extractEventName(event),
      newProps[event],
      oldProps[event]
    )
  })
}

/**
 * Updates the event listeners from the props to the given element re-adding them.
 * @param {HTMLElement} $element
 * @param {string} event the name of the event
 * @param {EventListenerOrEventListenerObject} newValue
 * @param {EventListenerOrEventListenerObject} oldValue
 */
const updateEventListener = ($element, event, newValue, oldValue) => {
  if (!newValue) {
    $element.removeEventListener(event, oldValue)
  } else if (!oldValue) {
    $element.addEventListener(event, newValue)
  } else {
    $element.removeEventListener(event, oldValue)
    $element.addEventListener(event, newValue)
  }
}

/**
 * Updates an HTML element depending on difference between the nodes passed
 * @param {HTMLElement} $element the parent of the nodes
 * @param {*} newNode
 * @param {*} oldNode
 * @param {number} index the node's index from the parent's childNodes list
 */
export const updateElement = ($element, newNode, oldNode, index = 0) => {
  // If the old node doesn't exist, it adds the new one to the parent.
  if (!oldNode) {
    $element.appendChild(createElement(newNode))
  }
  // If the new node doesn't exist, it removes the child at index from the parent.
  else if (!newNode) {
    $element.removeChild($element.childNodes[index])
  }
  // If the nodes have changed, it replaces the old one with its new version.
  else if (areNodesDifferent(newNode, oldNode)) {
    $element.replaceChild(createElement(newNode), $element.childNodes[index])
  }
  // If the node is not a text node
  else if (newNode.type) {
    // Updates its props
    updateProps($element.childNodes[index], newNode.props, oldNode.props)
    // Updates its events
    updateEventListeners(
      $element.childNodes[index],
      newNode.props,
      oldNode.props
    )

    const newLength = (newNode.children && newNode.children.length) || 0
    const oldLength = (oldNode.children && oldNode.children.length) || 0

    // Recursively updates its children
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $element.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}
