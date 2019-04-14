export default function getCursorXY(input, selectionPoint){
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
  } = input
  const div = document.createElement('div')
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  const swap = '.'
  const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
  const textContent = inputValue.substr(0, selectionPoint)
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  const span = document.createElement('span')
  span.textContent = inputValue.substr(selectionPoint) || '.'
  div.appendChild(span)
  document.body.appendChild(div)
  const { offsetLeft: spanX, offsetTop: spanY } = span
  document.body.removeChild(div)
  return {
    x: inputX + spanX,
    y: inputY + spanY,
  }
}
