declare type Result = {
  label: string,
  quantity: number,
  meters: number,
  price: number,
  totalMeters: number,
  pricePerMeter: number,
}

function loadResults(): Result[] {
  let resultsString = localStorage.getItem('results')
  if (!resultsString) resultsString = '[]'
  const results = JSON.parse(resultsString) as Result[]
  return results.sort((a, b) => b.pricePerMeter - a.pricePerMeter)
}

function storeResult(result: Result) {
  const results = loadResults()
  results.push(result)
  localStorage.setItem('results', JSON.stringify(results))
  return results.sort((a, b) => b.pricePerMeter - a.pricePerMeter)
}

function removeResult(index: number) {
  const results = loadResults()
  results.splice(index, 1)
  localStorage.setItem('results', JSON.stringify(results))
  return results.sort((a, b) => b.pricePerMeter - a.pricePerMeter)
}

function resultLabel(result: Result, best: boolean = false) {
  let label = ''
  if (best) label += 'Opción más económica.'
  if (result.label) label += `${result.label}: `
  label += `${result.quantity.toLocaleString()} rollos de ${result.meters.toLocaleString()} metros a $${result.price.toLocaleString()},`
  label += 'equivalen a '
  label += `${result.totalMeters.toLocaleString()} metros a $${result.pricePerMeter.toLocaleString()} por metro`
  return label
}

function printResults(results: Result[]) {
  const resultsElement = document.querySelector('[js-results]') as HTMLElement
  const resultsSection = document.querySelector('[js-section="results"]') as HTMLElement
  resultsElement.innerText = ''
  const template = document.querySelector('[js-template="result"]') as HTMLTemplateElement
  if (results.length) resultsSection.classList.add('show')
  else resultsSection.classList.remove('show')
  for (const [index, result] of results.entries()) {
    const resultElement = template.content.cloneNode(true) as HTMLElement
    const titleElement = resultElement.querySelector('[js-title]') as HTMLElement
    const quantityElement = resultElement.querySelector('[js-value="quantity"]') as HTMLElement
    const metersElement = resultElement.querySelector('[js-value="meters"]') as HTMLElement
    const priceElement = resultElement.querySelector('[js-value="price"]') as HTMLElement
    const totalMetersElement = resultElement.querySelector('[js-value="totalMeters"]') as HTMLElement
    const pricePerMeterElement = resultElement.querySelector('[js-value="pricePerMeter"]') as HTMLElement
    const deleteBtn = resultElement.querySelector('[js-delete]') as HTMLButtonElement
    titleElement.innerText = result.label
    quantityElement.innerText = result.quantity.toLocaleString()
    metersElement.innerText = result.meters.toLocaleString()
    priceElement.innerText = `$${result.price.toLocaleString()}`
    totalMetersElement.innerText = result.totalMeters.toLocaleString()
    pricePerMeterElement.innerText = `$${result.pricePerMeter.toLocaleString()}`
    deleteBtn.addEventListener('click', () => printResults(removeResult(index)))
    resultsElement.prepend(resultElement)
  }
}

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
      srAlert('Error al ingresar los datos', 'assertive')
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
  const totalMeters = quantity * meters
  const pricePerMeter = Math.round((((price / quantity) / meters) + Number.EPSILON) * 100) / 100
  const result = { label, quantity, meters, price, totalMeters, pricePerMeter }
  const results = storeResult(result)
  printResults(results)
  form.classList.remove('validated')
  form.reset()
  const bestResult = results[results.length - 1]
  if (result === bestResult) {
    srAlert(resultLabel(result, true))
  } else {
    srAlert(resultLabel(result) + '. ' + resultLabel(results[results.length - 1], true))
  }
}

function clearResults() {
  localStorage.clear()
  printResults(loadResults())
}

function share() {
  const encodedResults = encodeURIComponent(JSON.stringify(loadResults()))
  const url = new URL(window.location.href)
  url.searchParams.set('results', encodedResults)
  if (navigator.share) {
    navigator.share({
      title: 'Papelapp',
      text: '',
      url: url.toString(),
    })
  } else {
    navigator.clipboard.writeText(url.toString())
    alert('Enlace copiado al portapapeles')
  }
}

function loadUrl() {
  const searchParams = new URLSearchParams(window.location.search)
  if (!searchParams.has('results')) return
  const encodedResults = searchParams.get('results') || ''
  const decodedResults = decodeURIComponent(encodedResults)
  localStorage.setItem('results', decodedResults)
  window.location.search = ''
}

function alert(content: string, type: 'danger' | 'info' | 'success' = 'info', timeout: number = 3000) {
  const alert = document.querySelector(`[js-alert]`) as HTMLElement
  const alertContent = alert.querySelector(`[js-alert-content]`) as HTMLElement
  alert.classList.remove('alert-danger')
  alert.classList.remove('alert-info')
  alert.classList.remove('alert-success')
  alert.classList.add(`alert-${type}`)
  alertContent.innerHTML = content
  alert.classList.add('show')
  setTimeout(() => alert.classList.remove('show'), timeout)
}

function srAlert(content: string, type: 'assertive' | 'polite' = 'polite', timeout: number = 3000) {
  const srAlert: HTMLDivElement | null = document.querySelector(`[js-sr-alert="${type}"]`)
  if (!srAlert) return
  srAlert.innerHTML = content
  setTimeout(() => srAlert.innerHTML = '', timeout)
}

function initAlert() {
  const alert = document.querySelector(`[js-alert]`) as HTMLElement
  const alertClose = alert.querySelector('[js-alert-close]') as HTMLElement
  alertClose.addEventListener('click', () => alert.classList.remove('show'))
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[js-form]') as HTMLFormElement
  form.addEventListener('submit', (event) => handleSubmit(event, form))
  const clearBtn = document.querySelector('[js-clear]') as HTMLButtonElement
  clearBtn.addEventListener('click', clearResults)
  const shareBtn = document.querySelector('[js-share]') as HTMLButtonElement
  shareBtn.addEventListener('click', share)
  initAlert()
  loadUrl()
  printResults(loadResults())
})