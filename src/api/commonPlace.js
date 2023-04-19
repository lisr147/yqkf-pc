import request from "@/utils/request";

/**
 * 重点场所-公共场所-批量导出
 * @returns {*}
 */
 export function exportCommonData(data){
    return request({
      url: "/yqfk/web/peoplefolw/commonPlace/export",
      method: "post",
      responseType: "blob",
      data
    });
  }

// 公共场所关联核酸检测点列表
export function getNucleicPointList(data){
  return request({
    url: "/yqfk/web/peoplefolw/commonPlace/commonPlacelinkNucleicPoint",
    method: "get",
    params:data
  });
}

// 设置场所关联核酸点
export function setNucleicPointList(data) {
  return request({
    url: "/yqfk/web/peoplefolw/commonPlace/addLinkNucleicPoint",
    method: "post",
    data
  });
}
