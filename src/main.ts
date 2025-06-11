import Papelapp from './Classes/Papelapp'
import Results from './Classes/Results'
import Alert from './Elements/Alert'
import Form from './Elements/Form'
import Modal from './Elements/Modal'
import Result from './Elements/Result'

declare global {
  interface Window {
    Papelapp: Papelapp,
    Results: Results,
  }
}

window.Papelapp = new Papelapp()

document.addEventListener('DOMContentLoaded', () => {
  customElements.define('papelapp-result', Result)
  customElements.define('papelapp-alert', Alert)
  customElements.define('papelapp-modal', Modal)
  customElements.define('papelapp-form', Form)
  window.Results = new Results()

  const form = document.querySelector('[js-form-wrapper]') as Form | null
  document.querySelector('[js-add]')?.addEventListener('click', () => form?.show())

  // Register the service worker
  if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('/service-worker.js')
  }
})