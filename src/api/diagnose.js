import request from '@/utils/request'

export function getDiagnoseLayerData() {
  return request({
    url: `/yqfk/riskArea/getPersonTrend`,
    method: 'get'
  })
}
