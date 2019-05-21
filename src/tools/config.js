export const httpUrl = process.env.VUE_APP_HTTP_URL || 'http://localhost:10002/v1.0'
export const imageUrl = process.env.VUE_APP_IMAGE_URL || 'http://localhost:10003/'
export const imageUploadUrl = process.env.VUE_APP_IMAGE_UPLOAD_URL || 'http://localhost:10004/upload'


export default {
  httpUrl,
  imageUrl,
  imageUploadUrl,
}
