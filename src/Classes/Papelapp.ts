class Papelapp {
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
}

export default Papelapp