export function getToken () {
  if(localStorage.token){
    return localStorage.token
  }
}

export function setToken (token) {
  localStorage.token  = token
}

export function removeToken () {
  // Cookies.remove('SESSION')
  localStorage.token = ''
}
