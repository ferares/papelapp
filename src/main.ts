import Papelapp from './Classes/Papelapp'
import Results from './Classes/Results'
import Alert from './Elements/Alert'
import Modal from './Elements/Modal'
import Result from './Elements/Result'

declare global {
  interface Window {
    Papelapp: Papelapp,
    Results: Results,
  }
}

window.Papelapp = new Papelapp()

function validateForm(form: HTMLFormElement) {
  form.classList.add('validated')
  const inputs = form.elements
  for (const input of inputs) {
    const inputElement = input as HTMLInputElement
    inputElement.classList.remove('invalid')
    if (
      (!inputElement.checkValidity()) ||
      (
        (inputElement.getAttribute('js-input') === 'price') &&
        (Number(inputElement.value) <= 0)
      )
    ) {
      inputElement.classList.add('invalid')
      inputElement.focus()
      window.Papelapp.srAlert('Error al ingresar los datos', 'assertive')
      return false
    }
  }
  return true
}

function handleSubmit(event: SubmitEvent, form: HTMLFormElement) {
  event.preventDefault()
  if (!validateForm(form)) return
  const labelElement = form.querySelector('[js-input="label"]') as HTMLInputElement
  const metersElement = form.querySelector('[js-input="meters"]') as HTMLInputElement
  const quantityElement = form.querySelector('[js-input="quantity"]') as HTMLInputElement
  const priceElement = form.querySelector('[js-input="price"]') as HTMLInputElement
  const label = labelElement.value
  const quantity = Number(quantityElement.value)
  const price = Number(priceElement.value)
  const meters = Number(metersElement.value)
  const result = new Result({ label, quantity,  meters, price })
  window.Results.add(result)
  form.classList.remove('validated')
  form.reset()
  const modal =document.querySelector('[js-modal="form"]') as Modal
  modal.hide()
}

document.addEventListener('DOMContentLoaded', () => {
  customElements.define('papelapp-result', Result)
  customElements.define('papelapp-alert', Alert)
  customElements.define('papelapp-modal', Modal)
  window.Results = new Results()
  const form = document.querySelector('[js-form]') as HTMLFormElement
  form.addEventListener('submit', (event) => handleSubmit(event, form))

  // Register the service worker
  if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('/service-worker.js')
  }
})