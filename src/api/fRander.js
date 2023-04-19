/**
 * 表单填写组件接口
 */
import request from '@/utils/request'
// 获取验证码
export function getSmsCode({ formKey, phone }) {
    return request({
        url: `/public/sms/${formKey}/getCode/${phone}`,
        method: 'get',
    })
}

// 校验验证码
export function verifySmsCode({ phone, code }) {
    return request({
        url: `/public/sms/${phone}/verifyCode/${code}`,
        method: 'get',
    })
}

// 上传接口
export function upload(formKey){
    return {
        url: `${process.env.VUE_APP_BASE_API}/file/upload/${formKey}`
    }
}

export function uploadImg(formKey, file) {
    let data = new FormData()
    data.append('file', file)
    return request({
        url: `/vform/file/upload/${formKey}`,
        method: 'post',
        data
    })
}

export function download(id){
    return {
        url: `/vform/file/download/${id}`
    }
}