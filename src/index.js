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

const setAttributes = ($element, props) => {
  // If there is no props
  if (!Object.keys(props).length) return

  Object.keys(props).map((prop) => {
    $element.setAttribute(prop, props[prop])
  })
}

/**
 * Creates a DOM node.
 * @param {*} node
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

  // Uses recursion to create and append its children to the element
  node.children &&
    node.children.map((child) => {
      $element.appendChild(createElement(child))
    })

  return $element
}
