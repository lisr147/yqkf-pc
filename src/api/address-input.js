import request from '@/utils/request'


/**
 * 根据父id获取地址
 */
export function getTownById ({id}) {
  return request({
    baseURL: '/vform',
    url: `/public/area/${id}`,
    method: 'get',
    params: {showModal: false}
  })
}


