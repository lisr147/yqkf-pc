class Queue {

  constructor() {
    this.list = []
    this.isRunning = false
    this.delay = 500
  }

  add(fn) {
    this.list.push(fn)
    if (!this.isRunning) {
      this.run()
    }
  }

  run() {

    this.isRunning = true
    const fn = this.list.shift()
    setTimeout(() => {
      if (typeof fn == "function") {
        fn()
      }
      if (this.list.length <= 0) {
        this.isRunning = false
      }
      this.run()
    }, this.delay)
  }

}

export default new Queue()
