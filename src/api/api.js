import request from '@/utils/request.js' // 实际项目中，改用封装的request
import docList from './api-docs.json'
const serverUrl = ''
let apiList = {}
// let docList = [d1, d2]
// let docList = [d4]
docList.forEach((docs) => {
  let basePath = docs.basePath
  // let host = `http://${docs.host}`
  let host = ''
  for (let i in docs.tags) {
    let group = docs.tags[i].name
    let groupId = docs.tags[i].description.replace(/ /g, '')
    if (!apiList[groupId]) {
      apiList[groupId] = {}
    }
    for (let j in docs.paths) {
      let url = host + basePath + j
      for (let k in docs.paths[j]) {
        // url下每个method对应的接口,k:method
        let self = docs.paths[j][k]
        if (self.tags.includes(group)) {
          let method = k
          // let operationId = self.operationId
          let operationName = j
          /**
           * 特殊路径处理
           */
          switch (operationName) {
            case '/api/user/{departCode}/pageList':
              operationName = 'departCode_pageList'
              break
            case '/web/peoplefolw/flowPeople/pageList':
              operationName = 'flowPeople'
              break
            case "/web/peoplefolw/huji/pageList":
              operationName = 'huji'
              break
            case '/web/peoplefolw/place/pageList':
              operationName = 'place'
              break
            case '/web/peoplefolw/gasm/pageList':
              operationName = 'gasm'
              break
            case '/web/peoplefolw/commonPlace/pageList':
              operationName = 'commonPlace'
              break
            case '/web/peoplefolw/sksm/pageList':
              operationName = 'sksm'
              break
            case '/contact/alarm/setting/detail':
              operationName = 'setting'
              break
            default:
              break
          }
          operationName = operationName.replace(/{.*}/g, '')
          operationName.split('/').forEach(v => {
            if (v) {
              operationName = v
            }
          })
          let operationId = method + '_' + operationName
          let params = {}
          let data = {}
          let path = {}
          // 接口需要的数据，暂时只是方便查看接口需要哪些参数，并无实际作用
          // 可扩充成调用后，检查参数是否正确
          if (self.parameters) {
            self.parameters.forEach((v) => {
              if (v.in === 'query') {
                params[v.name] = v.type
              }
              if (v.in === 'body') {
                data[v.name] = v.type
              }
              if (v.in === 'path') {
                path[v.name] = v.type
              }
            })
          }
          let operation = {
            formData: !!self.consumes && self.consumes[0] === 'multipart/form-data', // 提交数据是否使用form-data方式
            url,
            method,
            params,
            data,
            path,
            originalUrl: url,
            summary: self.summary,
            request: (requestData = {
              path: {},
              params: {},
              data: {},
              headers: {}
            }) => {
              let thisUrl = operation.url
              // 检查参数
              // for (let i in operation.path) {
              //   if (!requestData.path || !requestData.path[i]) {
              //     console.error(`[API.JS]${operationId}:缺少path.${i}参数`)
              //   }
              // }
              // for (let i in operation.data) {
              //   if (!requestData.data || !requestData.data[i]) {
              //     console.warn(`[API.JS]${operationId}:缺少data.${i}参数`)
              //   }
              // }
              // for (let i in operation.params) {
              //   if (!requestData.params || !requestData.params[i]) {
              //     console.warn(`[API.JS]${operationId}:缺少params.${i}参数`)
              //   }
              // }
              for (let i in requestData.path) {
                thisUrl = thisUrl.replace(`{${i}}`, requestData.path[i])
              }
              requestData.url = serverUrl + thisUrl
              requestData.method = method
              if (operation.formData) {
                let postData = new FormData()
                for (let i in requestData.data) {
                  postData.append(i, requestData.data[i])
                }
                requestData.data = postData
              }
              // 调用接口时，遇到需要手动修改url的情况，在接口调用完成后，还原url为原始的url。以防再次调用该接口的时候，url是被上一次修改后的url导致产生的问题
              operation.url = operation.originalUrl
              return request(requestData)
            }
          }
          // 防止重名接口覆盖
          let count = 0
          let renameOperationId = (id) => {
            if (apiList[groupId][id]) {
              count++
              id += '_' + count
              renameOperationId(id)
            }
            return id
          }
          operationId = renameOperationId(operationId)
          apiList[groupId][operationId] = operation
        }
      }
    }
  }
})
// console.log('api列表', apiList)
window.Api = apiList
let apiDocs = function () {
  return apiList
}
// 修改API对象为函数，可以进行new
export default apiDocs
