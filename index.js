/** @jsx gvdom */

export const gvdom = (type, props, ...args) => {
  const children = args.length ? [].concat(args) : null
  return {
    type,
    props: props || {},
    children,
  }
}

export const createElement = (node) => {
  const element = document.createElement(node.type)
  element.appendChild(document.createTextNode(node.children))
  return element
}
