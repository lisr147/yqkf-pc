import request from '@/utils/request'
const SEAL_AREA_TEMPLATE_ID = 10076; // 防控管理器模板Id
/**
 * 封控管理接口
 */
// 封控管理-列表
 export function getGridList(data){
     return request({
         url:'/yqfk/geojson/grid/pageList',
         method:'post',
         data
     })
 }

// 封控管理-新增
export function addSealArea(data){
    return request({
        url: `/yqfk/api/template/data/${SEAL_AREA_TEMPLATE_ID}`,
        method:'post',
        data
    })
}

// 封控管理-删除
export function deleteSealArea(ids){
    return request({
        url: `/yqfk/api/template/data/${ids}`,
        method:'delete'
    })
}

// 封控管理-修改
export function editSealArea(id, data){
    return request({
        url: `/yqfk/api/template/data/${id}`,
        method:'put',
        data
    })
}

// 封控管理-根据网格自动带出 “流动人口” 、“户籍人口”、“总人口” 
export function getPeopleSum(data){
    return request({
        url: `/yqfk/web/peoplefolw/getPeopleSum`,
        method:'post',
        data
    })
}

// 封控管理-启停
export function areaEnable(enable, id){
    return request({
        url: `/yqfk/controlArea/isEnable?enable=${enable}&id=${id}`,
        method:'get'
    })
}

// 封控管理-是否设置为重点场所
export function areaIsKey(data){
    return request({
        url: `/yqfk/controlArea/isKey`,
        method:'get',
        params: data
    })
}

