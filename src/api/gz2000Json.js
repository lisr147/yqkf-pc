const baseUrl = './static/gz2000Json/'
import axios from 'axios'

const request = (data) => {
    return new Promise(resolve => {
        data.url = baseUrl + data.url
        axios(data).then(res => {
            resolve(res.data)
        })
    })
}

export function gridGz2000() {
    return request({
        url: 'gridGz2000.json',
        method: "get",
    })
}
export function streetGz2000() {
    return request({
        url: 'streetGz2000.json',
        method: "get",
    })
}
export function villageGz2000() {
    return request({
        url: 'villageGz2000.json',
        method: "get",
    })
}
export function jinzhouGz2000() {
    return request({
        url: 'jinzhouGz2000.json',
        method: "get",
    })
}
export function riversGz2000() {
    return request({
        url: 'riversGz2000.json',
        method: "get",
    })
}
export function roadGz2000() {
    return request({
        url: 'roadGz2000.json',
        method: "get",
    })
}
export function houseEstateGz2000() {
    return request({
        url: 'houseEstateGz2000.json',
        method: "get",
    })
}
export function buildingGz2000() {
    return request({
        url: 'buildingGz2000.json',
        method: "get",
    })
}

