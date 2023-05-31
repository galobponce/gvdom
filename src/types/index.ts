// Gvdom's Nodes related //
export type GvdomNode = {
  type: NodeType
  props: NodeProps
  children: NodeChildren
}
export type NodeType = ((props: NodeProps | undefined) => GvdomNode) | string
export type NodeProps = {
  [key: string]: string | boolean | EventListener
} | null
export type NodePropValue = string | boolean | number | EventListener
export type NodeChildren = string[] | GvdomNode[]

// JSX related //
export type JsxNode = GvdomNode | string | number
export type JsxPragma = (
  type: NodeType,
  props: NodeProps,
  ...children: NodeChildren
) => GvdomNode

// Miscellaneous //
export type StringOrBooleanOrNumber = string | boolean | number
