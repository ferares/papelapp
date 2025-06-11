import ResultData from '../Types/ResultData'

import Form from './Form'

class Result extends HTMLElement {
  readonly label: string
  readonly srLabel: string
  readonly quantity: number
  readonly meters: number
  readonly price: number
  readonly totalMeters: number
  readonly pricePerMeter: number
  index: number

  constructor(resultData: ResultData, index: number) {
    super()

    this.edit = this.edit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

    this.label = resultData.label
    this.quantity = resultData.quantity
    this.meters = resultData.meters
    this.price = resultData.price
    this.totalMeters = this.quantity * this.meters
    this.pricePerMeter = Math.round((((this.price / this.quantity) / this.meters) + Number.EPSILON) * 100) / 100
    this.srLabel = ''
    if (this.label) this.srLabel += `${this.label}: `
    this.srLabel += `${this.quantity.toLocaleString()} rollos de ${this.meters.toLocaleString()} metros a $${this.price.toLocaleString()},`
    this.srLabel += 'equivalen a '
    this.srLabel += `${this.totalMeters.toLocaleString()} metros a $${this.pricePerMeter.toLocaleString()} por metro`

    const template = document.querySelector('[js-template=result]') as HTMLTemplateElement

    const templateClone = template.content.cloneNode(true) as HTMLElement
    const titleElement = templateClone.querySelector('[js-title]') as HTMLElement
    const quantityElement = templateClone.querySelector('[js-value=quantity]') as HTMLElement
    const metersElement = templateClone.querySelector('[js-value=meters]') as HTMLElement
    const priceElement = templateClone.querySelector('[js-value=price]') as HTMLElement
    const totalMetersElement = templateClone.querySelector('[js-value=totalMeters]') as HTMLElement
    const pricePerMeterElement = templateClone.querySelector('[js-value=pricePerMeter]') as HTMLElement
    const deleteBtn = templateClone.querySelector('[js-delete]') as HTMLButtonElement
    titleElement.innerText = this.label
    quantityElement.innerText = this.quantity.toLocaleString()
    metersElement.innerText = this.meters.toLocaleString()
    priceElement.innerText = `$${this.price.toLocaleString()}`
    totalMetersElement.innerText = this.totalMeters.toLocaleString()
    pricePerMeterElement.innerText = `$${this.pricePerMeter.toLocaleString()}`
    this.classList.add('result')
    this.role = 'listitem'
    this.appendChild(templateClone)
    this.index = index
    deleteBtn.addEventListener('click', this.handleDelete)
    this.addEventListener('click', this.edit)
  }

  handleDelete(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    window.Results.removeResult(this.index)
  }

  edit() {
    const form = document.querySelector('[js-form-wrapper]') as Form
    if (!form) return
    form.show({ label: this.label, meters: this.meters, price: this.price, quantity: this.quantity, resultIndex: this.index })
  }

  updateIndex(index: number) {
    this.index = index
  }

  data() {
    return {
      label: this.label,
      quantity: this.quantity,
      meters: this.meters,
      price: this.price,
    }
  }
}

export default Result