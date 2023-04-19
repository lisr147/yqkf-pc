import request from '@/utils/request'
const moduleName = '/rest/auth/menuItem/'
const moduleName2 = '/rest/auth/commonMenuItem/'

/**
 * 获取导航菜单（过滤掉当前用户无权操作的菜单项）
 * @param String menuItemId
 * @param String menuItemType
 * @param String caption
 */
export function queryMenu (data) {
  return request({
    url: moduleName + 'list',
    method: 'post',
    data
  })
}

/**
 * 获取当前节点的下级树节点，如不指定则获取一级节点
 * @param String menuItemId
 */
export function getTree (data) {
  return request({
    url: moduleName + 'getMenuItemTree',
    method: 'post',
    data
  })
}

/**
 * 获取下级菜单
 * @param String menuItemId
 * @param Boolean includeDisabled
 */
export function getSubMenu (data) {
  return request({
    url: moduleName + 'getChildMenuItem',
    method: 'post',
    data
  })
}

/**
 * 分页查询子菜单
 * @param String menuItemId
 * @param Boolean includeDisabled
 */
export function getSubMenuList (data) {
  return request({
    url: moduleName + 'getChildMenuItemPager',
    method: 'post',
    data
  })
}

/**
 *  查询常用菜单
 * @param String menuItemId
 */
export function queryCommonMenu (data) {
  return request({
    url: moduleName + 'getCommonMenuItems',
    method: 'get',
    params: data
  })
}

/**
 *  获取菜单基本信息
 * @param Number id
 */
export function getMenuItem (data) {
  return request({
    url: moduleName + 'getMenuItem',
    method: 'get',
    params: data
  })
}

/**
 * 新增菜单信息
 * @param String parentMenuItemId
 * @param String caption 菜单标题
 * @param Number position
 * @param String imgCss
 * @param String url
 * @param String openType
 * @param String description
 */
export function createMenuItem (data) {
  return request({
    url: moduleName + 'saveOrUpdateMenuItem',
    method: 'post',
    data
  })
}

/**
 * 编辑菜单信息
 * @param Number id
 * @param String parentMenuItemId
 * @param String caption 菜单标题
 * @param Number position
 * @param String imgCss
 * @param String url
 * @param String openType
 * @param String description
 */
export function updateMenuItem (data) {
  return request({
    url: moduleName + 'saveOrUpdateMenuItem',
    method: 'post',
    data
  })
}

/**
 * 删除菜单信息
 * @param String ids
 */
export function removeMenuItem (data) {
  return request({
    url: moduleName + 'deleteMenuItem',
    method: 'get',
    params: data
  })
}

/**
 * 启用菜单信息
 * @param String ids
 */
export function enableMenuItem (data) {
  return request({
    url: moduleName + 'enableMenuItem',
    method: 'get',
    params: data
  })
}

/**
 * 禁用菜单信息
 * @param String ids
 */
export function disableMenuItem (data) {
  return request({
    url: moduleName + 'disableMenuItem',
    method: 'get',
    params: data
  })
}

/**
 * 获取当前导航菜单
 */
export function getNavigation (data) {
  return request({
    url: moduleName + 'getCurrentAppMenu',
    method: 'get',
    params: data
  })
}

/**
 *  获取用户快捷菜单列表
 *
 */
export function getCommonMenuItem (data) {
  return request({
    url: moduleName2 + 'getUserCommonMenuItem',
    method: 'get',
    params: data
  })
}

/**
 *  获取用户快捷菜单树
 *
 */
export function getCommonMenuItemTree (data) {
  return request({
    url: moduleName2 + 'getCommonMenuItemTree',
    method: 'get',
    params: data
  })
}

/**
 *  设置用户快捷菜单
 *  @param ids {String} 菜单id
 */
export function setUserCommonMenuItem (data) {
  return request({
    url: moduleName2 + 'saveOrUpdateCommonMenuItem',
    method: 'post',
    params: data
  })
}
