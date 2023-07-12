import ResultData from '../Types/ResultData'

class Result extends HTMLElement {
  readonly label: string
  readonly srLabel: string
  readonly quantity: number
  readonly meters: number
  readonly price: number
  readonly totalMeters: number
  readonly pricePerMeter: number
  
  constructor(resultData: ResultData) {
    super()

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

    const template = document.querySelector('[js-template="result"]') as HTMLTemplateElement

    const templateClone = template.content.cloneNode(true) as HTMLElement
    const titleElement = templateClone.querySelector('[js-title]') as HTMLElement
    const quantityElement = templateClone.querySelector('[js-value="quantity"]') as HTMLElement
    const metersElement = templateClone.querySelector('[js-value="meters"]') as HTMLElement
    const priceElement = templateClone.querySelector('[js-value="price"]') as HTMLElement
    const totalMetersElement = templateClone.querySelector('[js-value="totalMeters"]') as HTMLElement
    const pricePerMeterElement = templateClone.querySelector('[js-value="pricePerMeter"]') as HTMLElement
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
    deleteBtn.addEventListener('click', () => window.Papelapp.emitEvent(this, 'result:remove'))
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