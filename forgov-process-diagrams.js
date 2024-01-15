const fgProcessDiagram = () => {
  let processDiagram = document.querySelectorAll('.fg_process-diagram')

  processDiagram.forEach((diagram) => {
    let diagram_nodes = diagram.querySelectorAll('li')

    diagram_nodes.forEach((item) => {
      let childNodes = [...item.childNodes].filter((node) => {
            return node.nodeName !== "OL"
          }),
          content = childNodes.map((node) => {
          if (node.nodeType === 3) { // 3 = Node.TEXT_NODE
            return node.textContent
          }
          else if (node.nodeType === 1) { // 1 = Node.ELEMENT_NODE
            return node.outerHTML
          }
          }),
          style_classes = ['success', 'warning', 'danger', 'info'],
          item_style = [...item.classList].filter((item_class) => {
            return style_classes.includes(item_class)
          })

      // Wrap content in div tags and turn into card
      if (content) {
        let card = document.createElement('DIV'),
            card_body = document.createElement('DIV')

        card_body.innerHTML = content.join('')
        card_body.classList.add('card-body')
        card.classList.add('card')

        if (item_style.length) {
          card.classList.add('card-' + item_style[0])
          item.classList.remove(item_style[0])
        }

        card.appendChild(card_body)
        item.replaceChild(card, item.firstChild)
        childNodes.shift() // first child node has been replaced above
        childNodes.forEach((node) => {
          item.removeChild(node)
        })
      }
    })

    diagram_nodes.forEach((item) => {
      if (item.dataset.connectsTo) {
        fgProcessDiagramConnect(item, diagram.querySelector(`#${item.dataset.connectsTo}`))
      }
    })
  })
}

const fgProcessDiagramConnect = (current, target) => {
  // TODO: D.R.Y. out this function
  // console.log(current, target)
  current.setAttribute('aria-flowto',target.id)

  let connector = document.createElement('DIV'),
      current_position = current.getBoundingClientRect(),
      target_position = target.getBoundingClientRect(),
      target_above = current_position.y > target_position.y ? true : false,
      target_card = target.querySelector('.card'),
      target_card_position = target_card.getBoundingClientRect()

  connector.classList.add('connector')

  // console.log('current:', current_position)
  // console.log('target:', target_position)
  // console.log('target card:', target_card_position)

  let target_connector = { // defaults
        height: 10,
        width: 10
      },
      current_center = current_position.x + (current_position.width / 2),
      target_card_center = target_card_position.x + (target_card_position.width / 2),
      target_left = current_center > target_card_center ? true : false

  if (current_center > (target_card_center - 15)
      && current_center < (target_card_center + 15)) {
    connector.classList.add('connect-center')

    target_connector.left = target_position.width / 2

    if (target_above) {
      // TODO: Is this scenario ever possible? Would be connecting back to the card directly above...
      connector.classList.add('connect-above')
    }
    else {
      connector.classList.add('connect-below')

      target_connector.top = current_position.bottom - target_card_position.top
      target_connector.height = (target_card_position.top - current_position.bottom)
    }
  }
  else if (target_left) {
    connector.classList.add('connect-left')

      target_connector.left = target_position.width / 2
      target_connector.width = (target_position.width / 2) + (current_position.left - target_position.right)

    if (target_above) {
      connector.classList.add('connect-above')

      target_connector.top = target_position.height
      target_connector.height = (current_position.top - target_position.bottom) + (current_position.height / 2)
    }
    else if (target_position.y === current_position.y) {
      connector.classList.add('connect-level')
      target_connector.width = current_position.left - target_position.right
      target_connector.right = target_connector.width
      target_connector.left = target_position.width
      target_connector.top = current_position.height / 2
    }
    else {
      connector.classList.add('connect-below')
      target.classList.add('connect-below-target')

      target_connector.top = current_position.bottom - target_card_position.top
      target_connector.height = (target_card_position.top - current_position.bottom)
      target_connector.width = target_connector.width + (current_position.width / 2)
    }
  }
  else { // target_right
    connector.classList.add('connect-right')

    // target_right connector needs to be offset 2px because of...border width?
    target_connector.right = target_position.width / 2 - 2
    target_connector.width = (target_position.width / 2) + (target_position.left - current_position.right) + 2

    if (target_above) {
      connector.classList.add('connect-above')

      target_connector.top= target_position.height
      target_connector.height = (current_position.top - target_position.bottom) + (current_position.height / 2)
    }
    else if (target_position.y === current_position.y) {
      connector.classList.add('connect-level')
      target_connector.width = target_position.left - current_position.right
      target_connector.left = -target_connector.width
      target_connector.top = current_position.height / 2
    }
    else {
      connector.classList.add('connect-below')

      target_connector.top = current_position.bottom - target_card_position.top
      target_connector.height = (target_card_position.top - current_position.bottom)
      target_connector.width = target_connector.width + (current_position.width / 2)
    }
  }

  connector.style = Object.keys(target_connector).map((property) => {
    return `${property}: ${target_connector[property]}px;`
  }).join('')


  target.appendChild(connector)
}


fgProcessDiagram()
