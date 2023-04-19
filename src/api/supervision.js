import request from '@/utils/request'
/**
 * 督查督办接口
 */
// 督查督办任务列表
 export function getTaskList(data){
     return request({
         url:'/yqfk/supervision/pageList',
         method:'post',
         data
     })
 }
 // 督查督办任务列表
  export function addTask(data){
      return request({
          url:'/yqfk/supervision',
          method:'post',
          data
      })
  }
//  更新督查督办任务
 export function supervisionUpdate(data){
     return request({
         url:'/yqfk/supervision/process',
         method:'post',
         data
     })
 }
 //  获取督查督办任务进度更新数据
  export function getSupervisionProcessDetail(data){
      return request({
          url:'/yqfk/supervision/process/detail',
          method:'post',
          data
      })
  }
  //  获取督查督办任务进度更新数据
   export function getSupervisionDetail(id, data){
       return request({
           url:`/yqfk/supervision/${id}`,
           method:'post',
           data
       })
   }
//  督查督办任务导出
 export function exportSupervision(data){
     return request({
         url:'/yqfk/supervision/export',
         method:'post',
         responseType: "blob",
         data
     })
 }

 //  督查督办任务催办
 export function urgeSupervision(data){
    return request({
        url:'/yqfk/supervision/cuiBanTask',
        method:'post',
       data
    })
}

// 任务进度更新
export function getProcessByMobile (data) {
  return request({
    url: `/yqfk/supervision/process/detail`,
    method: 'post',
    params: data
  })
}
// 任务结束
export function stopTask (data) {
  return request({
    url: `/yqfk/supervision/stopTask`,
    method: 'post',
    data
  })
}
/**
 * 获取上传文件地址
 */
export function getUploadDCDBfileUrl () {
  return '/yqfk/api/mediaInfo/upload/dcdb'
}

// 删除任务
export function deleteTask(ids) {
    return request({
        url: `/yqfk/supervision/${ids}`,
        method: 'delete'
      })
}

export function getJsTicket(params){
    return request({
        url:'/yqfk/wx/token',
        method:'get',
        params
    })
}
