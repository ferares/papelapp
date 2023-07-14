class Papelapp {
  callOnEsc: Function[] = []
  bodyScrollHide: number = 0

  constructor() {
    document.addEventListener('keydown', this.handleEsc.bind(this))
  }

  ready(fn: () => any) {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
  }

  emitEvent(element: Node, name: string, data?: any) {
    element.dispatchEvent(new CustomEvent(`papelapp/${name}`, { detail: data }))
  }

  srAlert(content: string, type: 'assertive' | 'polite' = 'polite', timeout: number = 3000) {
    const srAlert: HTMLDivElement | null = document.querySelector(`[js-sr-alert="${type}"]`)
    if (!srAlert) return
    srAlert.innerHTML = content
    setTimeout(() => srAlert.innerHTML = '', timeout)
  }

  handleEsc(event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    this.callOnEsc.pop()?.()
  }

  callOnEscPush(f: Function) { this.callOnEsc.push(f) }
  callOnEscRemove(f: Function) {
    const index = this.callOnEsc.indexOf(f)
    if (index === -1) return
    this.callOnEsc.splice(index, 1)
  }

  hideBodyScroll() {
    this.bodyScrollHide++
    document.body.classList.add('disable-scroll')
  }

  showBodyScroll() {
    this.bodyScrollHide--
    if (this.bodyScrollHide < 0) this.bodyScrollHide = 0
    if (this.bodyScrollHide === 0) {
      document.body.classList.remove('disable-scroll')
    }
  }
}

export default Papelapp