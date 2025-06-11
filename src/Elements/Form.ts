import Modal from './Modal'
import Result from './Result'

type FormValues = { label: string, quantity: number, meters: number, price: number, resultIndex: number }

class Form extends HTMLElement {
  private resultIndex?: number
  private form: HTMLFormElement
  private label: HTMLInputElement
  private quantity: HTMLInputElement
  private meters: HTMLInputElement
  private price: HTMLInputElement
  private modal: Modal
  private titleElement: HTMLHeadingElement
  private btnElement: HTMLButtonElement

  constructor() {
    super()

    this.show = this.show.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.modal = document.querySelector('[js-modal=form]') as Modal
    this.label = this.querySelector('#label') as HTMLInputElement
    this.quantity = this.querySelector('#quantity') as HTMLInputElement
    this.meters = this.querySelector('#meters') as HTMLInputElement
    this.price = this.querySelector('#price') as HTMLInputElement
    this.form = this.querySelector('[js-form]') as HTMLFormElement
    this.titleElement = document.querySelector('[js-modal-title]') as HTMLHeadingElement
    this.btnElement = this.querySelector('[js-form-btn]') as HTMLButtonElement

    this.form.addEventListener('submit', this.handleSubmit)
  }

  show(values?: FormValues) {
    this.form.reset()
    this.resultIndex = undefined
    this.titleElement.innerText = "Agregar producto"
    this.btnElement.innerText = "Agregar"
    if (values) {
      this.resultIndex = values.resultIndex
      this.label.value = values.label
      this.quantity.value = values.quantity.toString()
      this.meters.value = values.meters.toString()
      this.price.value = values.price.toString()
      this.titleElement.innerText = "Editar producto"
      this.btnElement.innerText = "Editar"
    }
    this.modal.show()
  }

  validateForm() {
    this.form.classList.add('validated')
    const inputs = this.form.elements
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

  handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    if (!this.validateForm()) return
    const labelElement = this.form.querySelector('[js-input="label"]') as HTMLInputElement
    const metersElement = this.form.querySelector('[js-input="meters"]') as HTMLInputElement
    const quantityElement = this.form.querySelector('[js-input="quantity"]') as HTMLInputElement
    const priceElement = this.form.querySelector('[js-input="price"]') as HTMLInputElement
    const label = labelElement.value
    const quantity = Number(quantityElement.value)
    const price = Number(priceElement.value)
    const meters = Number(metersElement.value)
    const result = new Result({ label, quantity, meters, price }, -1)
    if (this.resultIndex !== undefined) {
      window.Results.editResult(this.resultIndex, result)
    } else {
      window.Results.add(result)
    }
    this.form.classList.remove('validated')
    this.form.reset()
    this.modal.hide()
  }
}

export default Form