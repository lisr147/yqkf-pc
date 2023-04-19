const baseUrl = './static/medicalJson/'
import axios from 'axios'

const request = (data) => {
  return new Promise(resolve => {
    data.url = baseUrl + data.url
    axios(data).then(res => {
      resolve(res.data)
    })
  })
}

export function getAllData() {
  return request({
    url: 'all.json',
    method: "get",
  })
}
export function getGridData() {
  return request({
    url: 'grid.json',
    method: "get",
  })
}

export function getStreetData() {
  return request({
    url: 'street.json',
    method: "get",
  })
}

export function getVillageData() {
  return request({
    url: 'village.json',
    method: "get",
  })
}
