import request from '@/utils/request'
const moduleName = '/rest/auth/role/'
const moduleName2 = '/rest/auth/userRole/'
/**
 * 获取角色列表
 * @param String keyword  角色标识/角色名称
 * @param String appInfoId  所属应用id
 * @param  Number rp
 * @param  Number page
 */
export function queryRoles (data) {
  return request({
    url: moduleName + 'list',
    method: 'post',
    data
  })
}

/**
 * 新增角色
 * @param String roleName
 * @param String roleCode
 * @param  Number appInfoId
 * @param  String description
 */
export function createRole (data) {
  return request({
    url: moduleName + 'saveOrUpdateRole',
    method: 'post',
    data
  })
}

/**
 * 编辑角色
 * @param String roleName
 * @param String roleCode
 * @param  Number appInfoId
 * @param  String description
 * @param Number id 角色id
 */
export function updateRole (data) {
  return request({
    url: moduleName + 'saveOrUpdateRole',
    method: 'post',
    data
  })
}

/**
 *  删除角色
 * @param Number ids 角色ids，多个id以“,”分隔
 */
export function removeRoles (data) {
  return request({
    url: moduleName + 'deleteRole',
    method: 'get',
    params: data
  })
}

/**
 * 获取当前角色权限
 * @param Number id
 * @param Boolean isAvailable
 */
export function getPermission (data) {
  return request({
    url: moduleName + 'getRoleConfigAuthority',
    method: 'get',
    params: data
  })
}

/**
 * 保存当前角色功能权限
 * @param Number roleId
 * @param String configAuthorityIds
 * @param Boolean isAvailable
 */
export function setPermission (data) {
  return request({
    url: moduleName + 'saveOrUpdateRoleConfigAuthority',
    method: 'post',
    data
  })
}

/**
 * 获取组织架构的根节点
 * @param Number roleId
 */
export function getUserTreeRoot (data) {
  return request({
    url: moduleName2 + 'findChildDepartmentUser',
    method: 'get',
    params: data
  })
}

/**
 * 获取组织架构的二级架构
 * @param Number roleId
 * @param Number departmentId
 */
export function getUserTreeByNode (data) {
  return request({
    url: moduleName2 + 'findChildDepartmentUser',
    method: 'get',
    params: data
  })
}

/**
 * 获取已勾选的用户信息
 * @param Number roleId
 */
export function getUserByRoleId (data) {
  return request({
    url: moduleName2 + 'userInfolist',
    method: 'post',
    data
  })
}

/**
 * 保存配置用户信息
 * @param Number roleId
 * @param String userIds
 */
export function setUserByRoleId (data) {
  return request({
    url: moduleName2 + 'saveOrUpdateRoleUser',
    method: 'post',
    params: data
  })
}

/**
 * 获取用户对应的角色列表
 * @param Number userId
 * @param String appInfoIds
 */
export function getRoleSetting (data) {
  return request({
    url: moduleName2 + 'roleList',
    method: 'post',
    data
  })
}

/**
 * 保存用户的角色配置
 * @param Number userId
 */
export function saveRoleSetting (data) {
  return request({
    url: moduleName2 + 'saveOrUpdateUserRole',
    method: 'post',
    params: data
  })
}

/**
 * 获取当前用户的角色配置
 * @param Number userId
 */
export function getMyRoles (data) {
  return request({
    url: moduleName2 + 'getCurrentUserRole',
    method: 'get',
    params: data
  })
}

/**
 * 查询角色可授权的角色列表
 * @param Number id
 */
export function getAvaliableRoleList (data) {
  return request({
    url: moduleName + 'availableRolelist',
    method: 'get',
    params: data
  })
}

/**
 * 查询角色可授权的角色列表
 * @param String ids  需要配置的角色idString roleIds 可授权的角色ids，多个id用逗号隔开
 */
export function saveOrUpdateAvailableRole (data) {
  return request({
    url: moduleName + 'saveOrUpdateAvailableRole',
    method: 'post',
    params: data
  })
}


/**
 * 获取所有领域数据权限
 *
 */
export function getDomainAccessList(data){
  return request({
    url: moduleName + 'dictionaryData/all',
    method: 'get',
    params: data
  })
}

/**
 * 获取所有标签数据权限
 *
 */
export function getTagAccessList(data){
  return request({
    url: moduleName + 'tag/all',
    method: 'get',
    params: data
  })
}

/**
 * 根据角色id获取当前数据权限状态
 * @param data
 */
export function getDomainAndTagByRoleId(data){
  return request({
    url: moduleName + 'getDomainAndTag',
    method: 'get',
    params: data
  })
}

/**
 * 保存当前角色数据权限状态
 * @param roleId {Number}
 * @param panelItemDomainIds {Array}
 * @param deviceTagIds {Array}
 */
export function setDataPermission (data) {
  return request({
    url: moduleName + 'saveOrUpdateDomainTagAuthority',
    method: 'post',
    data
  })
}


/**
 * 获取全部自定义用户标签
 * @param data
 */
export function getAllCustomTag (data) {
  return request({
    url: moduleName + 'findAllUserDeviceTag',
    method: 'get',
    params: data
  })
}

/**
 * 角色管理-数据权限 选中(取消)自定义标签
 */
export function saveOrUpdateUserTag(data){
  return request({
    url: moduleName + 'saveOrUpdateUserTag',
    method: 'post',
    data
  })
}

/**
 * 角色管理-数据权限 获取角色的自定义标签
 */
export function getUserTag (data) {
  return request({
    url: moduleName + 'getUserTag',
    method: 'get',
    params: data
  })
}

/**
 * 角色管理-数据权限 删除自定义标签
 * @param roleId {Number}
 * @param userTagId {Number}
 */
export function deleteUserTag (data) {
  return request({
    url: moduleName + 'deleteUserTag',
    method: 'DELETE',
    params: data
  })
}

/**
 * 角色管理-自定义标签统计
 * @param userTagId {String}
 */
export function getTagStatics(data){
  return request({
    url: moduleName + 'countUserTag',
    method: 'get',
    params: data
  })
}
