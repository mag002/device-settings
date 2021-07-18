function createElement({ tagName, attributes, children, event, textContent }) {
    const element = document.createElement(tagName);
    Object.keys(attributes).forEach((attr) => {
      element.setAttribute(attr, attributes[attr]);
    });
    if (children) {
      children.forEach((child) => {
        const childElement = createElement(child);
        element.appendChild(childElement);
      });
    }
    if (textContent) {
      const text = document.createTextNode(textContent);
      element.appendChild(text);
    }
    if (event) {
      element.addEventListener(event.type, event.callback);
    }
    return element;
  }
  