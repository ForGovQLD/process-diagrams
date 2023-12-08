const fgProcessDiagram = () => {
  let processDiagram = document.querySelectorAll('.fg_process-diagram')

  processDiagram.forEach((diagram) => {
    diagram.querySelectorAll('li').forEach((item) => {
      let text = item.firstChild && item.firstChild.nodeType === Node.TEXT_NODE ? item.firstChild.textContent.trim() : false,
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
  })
}

fgProcessDiagram();
