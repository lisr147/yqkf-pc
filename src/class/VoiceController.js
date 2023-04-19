import {Howl, Howler} from 'howler';

class VoiceController {

  constructor(conf) {
    this.sound = null
    this.soundId = ''
    this.fnMap = {}
  }

  createVoice (id) {
    const src = this.getSource(id)
    this.sound = new Howl({
      src,
      format: ['mp3'],
      html5: true,
      onplay: () => {
        this.queueFn('play')
      },
      onstop: () => {
        this.queueFn('stop')
      },
      onplayerror: () => {
        console.log('onplayerror')
      },
      onend: () => {
        this.queueFn('end')
      }
    })
    this.soundId = id

  }

  addEventListener(eventType, callback) {

    if (!this.fnMap[eventType]) {
      this.fnMap[eventType] = []
    }
    this.fnMap[eventType].push(callback)

  }

  queueFn(eventType) {
    const fns = this.fnMap[eventType]
    if (fns) {
      for (let i = 0; i < fns.length; i++) {
        fns[i].apply(this, [this.soundId])
      }
    }
  }

  getSource(id) {
    return `${process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : 'http://dn.product.iot-cas.com:8081/yqfk'}/api/mediaInfo/preview/${id}`
  }

  removeVoice(){
    if(this.sound){
      this.sound.unload()
      this.queueFn('stop')
      this.sound = null
      this.soundId = ''
    }
  }

  play(id) {

    if (this.soundId !== id) {
      this.removeVoice()
      this.createVoice(id)
    }

    if (this.sound.playing()) {
      this.sound.stop()
    } else {
      this.sound.play()
    }
  }

}

export default new VoiceController()
