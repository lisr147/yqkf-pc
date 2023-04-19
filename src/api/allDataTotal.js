import request from "@/utils/request";
/**
 * 密接次密接人员数量
 * @param {} data
 * @returns
 */
export function getConnectionCountstatistics(params) {
  return request({
    url: `/yqfk/web/picture/connectionCount/statistics`,
    method: "get",
    params
  });
}

/**
 * 人口数量
 * @param {} data
 * @returns
 */
 export function getRenkouCount(params) {
    return request({
      url: `/yqfk/web/renkou/count`,
      method: "get",
      params
    });
  }


  /**
 * 重点行业人员核酸数量
 * @param {} data
 * @returns
 */
 export function getDomainCount(params) {
    return request({
      url: `/yqfk/hsStatistic/fullStatistic`,
      method: "get",
      params
    });
  }
    /**
 * 常态化防疫监控数量
 * @param {} data
 * @returns
 */
 export function getMoniterCount(params) {
    return request({
      url: `/yqfk/normalizedEpm/statistic`,
      method: "get",
      params
    });
  }
  /**
* 社区监控重点人员数量
* @param {} data
* @returns
*/
export function getCommunityCount(params) {
  return request({
    url: `/yqfk/web/picture/redCount/statistics`,
    method: "get",
    params
  });
}
/**
* 社区监控重点人员统计图表
* @param {} data
* @returns
*/
export function getCommunityChart(params) {
  return request({
    url: `/yqfk/web/picture/redCount/sszj`,
    method: "get",
    params
  });
}

/**
* 人力资源情况
* @param {} data
* @returns
*/
export function getResourceCount(params) {
  return request({
    url: `/yqfk/web/picture/humanResources/statistics`,
    method: "get",
    params
  });
}
/**
* 重点人员情况
* @param {} data
* @returns
*/
export function getImportantCount(params) {
  return request({
    url: `/yqfk/web/picture/zdPeople/statistics`,
    method: "get",
    params
  });
}

/**
* 密接次密接人员镇街统计
* @param {} data
* @returns
*/
export function getContactCount(params) {
    return request({
      url: `/yqfk/web/picture/connectionCount/sszj`,
      method: "get",
      params
    });
  }
/**
 * 社区监控重点人员下钻
 * @data {} data
 * @returns
 */
export function getRedCountList(data) {
  return request({
    url: `/yqfk/web/picture/redCount/detail`,
    method: "post",
    data
  });
}
/**
 * 密接下钻
 * @data {} data
 * @returns
 */
export function getConnectionCountList(data) {
  return request({
    url: `/yqfk/web/picture/connectionCount/detail`,
    method: "post",
    data
  });
}
