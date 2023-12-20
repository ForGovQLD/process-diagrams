const fgProcessDiagram = () => {
  let processDiagram = document.querySelectorAll('.fg_process-diagram')

  processDiagram.forEach((diagram) => {
    let diagram_nodes = diagram.querySelectorAll('li')
    diagram_nodes.forEach((item) => {
      let text = item.firstChild && item.firstChild.nodeType === Node.TEXT_NODE ? item.firstChild.textContent.trim() : false,
      // TODO: refactor to accept HTML content (paragraphs, anchors)
        style_classes = ['success', 'warning', 'danger', 'info'],
        item_style = [...item.classList].filter((item_class) => {
          return style_classes.includes(item_class)
        })

      // Wrap text in div tags and turn into card
      if (text) {
        let card = document.createElement('DIV'),
          card_body = document.createElement('DIV')

        card_body.innerText = text
        card_body.classList.add('card-body')
        card.classList.add('card')
        if (item_style.length) {
          card.classList.add('card-' + item_style[0])
          item.classList.remove(item_style[0])
        }
        card.appendChild(card_body)
        item.replaceChild(card, item.firstChild)
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
  console.log(current, target);
  current.setAttribute('aria-flowto',target.id)

  let connector = document.createElement('DIV'),
    current_position = current.getBoundingClientRect(),
    target_position = target.getBoundingClientRect(),
    target_above = current_position.y > target_position.y ? true : false,
    target_card = target.querySelector('.card'),
    target_card_position = target_card.getBoundingClientRect()

  connector.classList.add('connector')
  console.log('current:', current_position)
  console.log('target:', target_position)
  console.log('target card:', target_card_position)

  let target_connector = { // defaults
    height: 10,
    width: 10
  }

    let current_center = current_position.x + (current_position.width / 2),
        target_card_center = target_card_position.x + (target_card_position.width / 2),
        target_left = current_center > target_card_center ? true : false

  if (current_center > (target_card_center - 15)
      && current_center < (target_card_center + 15)) {
    console.log('TARGET CENTRE')
    connector.classList.add('connect-center')

    target_connector.left = target_position.width / 2

    if (target_above) {
      connector.classList.add('connect-above')

    }
    else if (target_position.y === current_position.y) {
      connector.classList.add('connect-level')

    }
    else {
      connector.classList.add('connect-below')

      target_connector.top = current_position.bottom - target_card_position.top
      target_connector.height = (target_card_position.top - current_position.bottom)
    }
  }
  else if (target_left) {
    connector.classList.add('connect-left')

      // target_connector.left = (targetPosition.right - targetPosition.left) / 2
      target_connector.left = target_position.width / 2
      target_connector.width = (target_position.width / 2) + (current_position.left - target_position.right)

    console.log('target left')
    console.log({
      target_width: target_position.width
    })

    if (target_above) {
      console.log('target above')
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
      console.log('target below')

      target.classList.add('connect-below-target')

      target_connector.top = current_position.bottom - target_card_position.top
      target_connector.height = (target_card_position.top - current_position.bottom)
      target_connector.width = target_connector.width + (current_position.width / 2)
      // target_connector.right = current_position.width / 2
    }
  }
  else { // targetRight
    connector.classList.add('connect-right')
    console.log('target right')

    // targetRight connector needs to be offset 2px because of...border width?
    target_connector.right = target_position.width / 2 - 2
    target_connector.width = (target_position.width / 2) + (target_position.left - current_position.right) + 2

    if (target_above) {
      console.log('target above')
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
      console.log('target below')
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
