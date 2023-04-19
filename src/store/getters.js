const getters = {
  token: state => state.user.token,
  username: state => state.user.username,
  userId: state=>state.user.id,
  departmentName: state=>state.user.departmentName
}

export default getters
