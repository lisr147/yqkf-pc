import request from '@/utils/request'

/**
 * 特定人员接口
 */
// 特定人员名单列表
 export function getSubmitUser(params){
     return request({
         url:'/submitUser',
         method:'get',
         params
     })
 }
//  更新特定人员名单
 export function putSubmitUser(data){
     return request({
         url:'/submitUser',
         method:'put',
         data
     })
 } 
//  特定人员名单导出
 export function exportSubmitUser(params){
     return request({
         url:'/submitUser/export',
         method:'get',
         responseType:'blob',
         params
     })
 } 
// 删除特定人员名单
 export function delSubmitUser(groupId,id){
     return request({
         url: '/submitUser/'+groupId+'/' + id,
         method:'delete',
     })
 }


// 特定人员分组列表
  export function getSubmitUserGroup(params){
     return request({
         url:'/submitUserGroup',
         method:'get',
         params
     })
 }
//  添加特定人员分组
   export function postSubmitUserGroup(data){
     return request({
         url:'/submitUserGroup',
         method:'post',
         data
     })
 }
// 更新特定人员分组
   export function putSubmitUserGroup(data){
     return request({
         url:'/submitUserGroup',
         method:'put',
         data
     })
 }
//  删除特定人员分组
   export function delSubmitUserGroup(path){
     return request({
         url:'/submitUserGroup/'+path,
         method:'delete',
     })
 }