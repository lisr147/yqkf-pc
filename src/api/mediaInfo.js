import request from "@/utils/request";
/**
 * 媒体库办接口
 */
// 下载媒体文件
export function downloadMedia(mediaInfoId) {
  return request({
    url: `/yqfk/api/mediaInfo/download/${mediaInfoId}`,
    method: "get",
  });
}
// 预览媒体文件
export function previewMedia(mediaInfoId) {
  return request({
    url: `/yqfk/api/mediaInfo/preview/${mediaInfoId}`,
    method: "get",
  });
}
// 文件上传
export function uploadFile(appType, file) {
  let formData = new FormData();
  formData.append("file", file);
  return request({
    url: `/yqfk/api/mediaInfo/upload?appType=${appType}`,
    method: "post",
    data: formData,
  });
}

// 督查督办文件上传
export function uploadDCDBfile(data) {
  let formData = new FormData();
  for (let i in data) {
    formData.append(i, data[i]);
  }
  return request({
    url: "/yqfk/api/mediaInfo/upload/dcdb",
    method: "post",
    data: formData,
  });
}
