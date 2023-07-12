class Alert extends HTMLElement {
  constructor(content: string, type: string = 'info', timeout: number = 3000) {
    super()
    this.dismiss = this.dismiss.bind(this)

    const template = document.querySelector('[js-template="alert"]') as HTMLTemplateElement
    const templateClone = template.content.cloneNode(true) as HTMLElement
    this.appendChild(templateClone)
    this.role = 'alert'
    this.classList.add('alert')
    const alertContent = this.querySelector(`[js-alert-content]`) as HTMLElement
    alertContent.innerHTML = content
    this.classList.add(`alert-${type}`)
    const alertClose = this.querySelector('[js-alert-close]') as HTMLElement
    alertClose.addEventListener('click', () => this.dismiss())
    if (timeout) setTimeout(() => this.dismiss(), timeout)
    document.body.appendChild(this)
    setTimeout(() => this.classList.add('show'), 0)
  }

  dismiss() {
    this.addEventListener('transitionend', () => this.remove())
    this.classList.remove('show')
  }
}

export default Alert