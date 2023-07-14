import Alert from '../Elements/Alert'
import Result from '../Elements/Result'
import ResultData from '../Types/ResultData'

class Results {
  private results: Result[] = []
  private resultsElement: HTMLElement
  private resultsSection: HTMLElement
  private welcomeSection: HTMLElement
  
  constructor() {
    this.share = this.share.bind(this)
    this.print = this.print.bind(this)
    this.load = this.load.bind(this)
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)

    this.welcomeSection = document.querySelector('[js-section="welcome"]') as HTMLElement
    this.resultsSection = document.querySelector('[js-section="results"]') as HTMLElement
    this.resultsElement = this.resultsSection.querySelector('[js-results]') as HTMLElement
    const shareBtn = this.resultsSection.querySelector('[js-share]') as HTMLButtonElement
    shareBtn.addEventListener('click', this.share)
    this.load()
  }

  private stringify() {
    return JSON.stringify(this.results.map((result) => result.data()))
  }

  private loadFromUrl() {
    const searchParams = new URLSearchParams(window.location.search)
    if (!searchParams.has('results')) return false
    const encodedResults = searchParams.get('results') || ''
    const resultItems = encodedResults.split('/')
    const results = []
    for (const resultItem of resultItems) {
      const [label, quantity, meters, price] = resultItem.split('\\')
      results.push(new Result({
        label: decodeURIComponent(label),
        quantity: Number(quantity),
        meters: Number(meters),
        price: Number(price),
      }))
    }
    localStorage.setItem('results', JSON.stringify(results))
    window.location.search = ''
    return true
  }

  private load() {
    if (this.loadFromUrl()) return
    let resultsString = localStorage.getItem('results')
    if (!resultsString) resultsString = '[]'
    const resultsData = JSON.parse(resultsString) as ResultData[]
    const results = resultsData.map((resultData) => new Result(resultData))
    this.results = results.sort((a, b) => b.pricePerMeter - a.pricePerMeter)
    this.print()
  }
  
  private remove(index: number) {
    this.results.splice(index, 1)
    localStorage.setItem('results', this.stringify())
    this.print()
  }

  add(result: Result) {
    this.results.push(result)
    this.results = this.results.sort((a, b) => b.pricePerMeter - a.pricePerMeter)
    localStorage.setItem('results', this.stringify())
    this.print()
    const bestResult = this.results[this.results.length - 1]
    let message = 'Opción más económica. '
    if (result === bestResult) message += result.srLabel
    else message += `${result.srLabel}. ${bestResult.srLabel}`
    window.Papelapp.srAlert(`Opción más económica. ${message}`)
  }

  private print() {
    this.resultsElement.innerText = ''
    if (this.results.length) {
      this.resultsSection.classList.add('show')
      this.welcomeSection.classList.remove('show')
    } else {
      this.resultsSection.classList.remove('show')
      this.welcomeSection.classList.add('show')
    }

    for (const [index, result] of this.results.entries()) {
      result.addEventListener('papelapp/result:remove', () => this.remove(index))
      this.resultsElement.prepend(result)
    }
  }

  share() {
    let encodedResults = ''
    for (const result of this.results) {
      encodedResults += `/${encodeURIComponent(result.label)}\\${result.quantity}\\${result.meters}\\${result.price}`
    }
    const url = new URL(window.location.href)
    url.searchParams.set('results', encodedResults.slice(1))
    if (navigator.share) {
      navigator.share({
        title: 'Papelapp',
        text: '',
        url: url.toString(),
      })
    } else {
      navigator.clipboard.writeText(url.toString())
      new Alert('Enlace copiado al portapapeles')
    }
  }
}

export default Results