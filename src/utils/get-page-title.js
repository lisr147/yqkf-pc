import { title } from '@/config/setting'

const _title = title || 'framework'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${_title}`
  }
  return `${_title}`
}
