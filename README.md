# Gvdom

A really small VDOM library to build UI interfaces through JSX syntax.

## ❓ Description

In order to learn how a VDOM (Virtual Document Object Model) library works, I started building one from zero.

## ⚡️ Getting Started

You can easily use this VDOM library with [create gvdom app](https://github.com/galobponce/create-gvdom-app), a build tool that sets up a gvdom app with zero configuration.

Just run `npx create-gvdom-app my-app` or `yarn create gvdom-app my-app` to get started.

Then, you can create components like React with ***JSX*** syntax.

## 🔨 Creating Components

As mentioned before, the syntax is similar to React:

```
import { gvdom, createElement } from "gvdom"

const Title = ({ text }) => {
  return (
    <h1 class="title" onClick={() => console.log("Hello World!")}>
      {text}
    </h1>
  )
}
```

Then, you can render it like this:

```
import { gvdom, createElement } from "gvdom"

const Title = ({ text }) => {
  return (
    <h1 class="title" onClick={() => console.log("Hello World!")}>
      {text}
    </h1>
  )
}

document
  .getElementById("app")
  .appendChild(createElement(<Title text="My First Gvdom App" />))
```

## 📚 References

 - [How to write your own Virtual DOM](https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060)
