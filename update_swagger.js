
let urls = [
  // 'http://jcfz.dn.iot-cas.com:8081/jcfz/v2/api-docs'
  // 'http://192.168.2.107:8899/jcfz/v2/api-docs' // 泽钦本地
  // 'http://192.168.2.127:8899/jcfz/v2/api-docs' // 李凡本地
  // 'http://192.168.1.79:9248/yqfk/v2/api-docs'
]

let apiDoc = require('./apiDoc.json')

const axios = require('axios')
const fs = require('fs')
let jsons = []
let run = async () => {
  for (let i in urls) {
    let res = await axios.get(urls[i])
    // console.log(res.data)
    jsons.push(res.data)
  }
  if (apiDoc) {
    jsons.push(apiDoc)
  }
  jsons.forEach(swagger => {
    delete swagger.info
    delete swagger.swagger
    delete swagger.securityDefinitions
    delete swagger.definitions

    for (let i in swagger.paths) {
      let path = swagger.paths[i]
      for (let j in path) {
        let method = path[j]
        delete method.responses
        delete method.security
        delete method.deprecated
        delete method.operationId
        delete method.produces
        if (method.parameters) {
          method.parameters.forEach(param => {
            delete param.schema
          })
        }
      }
    }
  })
  console.log(jsons)

  //   console.log(jsons)
  fs.writeFileSync('./src/api/api-docs.json', JSON.stringify(jsons))
  console.log('api-docs.json 更新成功')
}
run()
