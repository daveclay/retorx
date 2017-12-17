const location = window.location
const host = `${location.protocol}//${location.hostname}${(location.port ? ':'+location.port: '')}/`

const baseServicesPath = (path) => {
  if (window.location.href) {
  }
  return host + "services/" + path;
}

export const baseAdminContentServicePathBuilder = (path) => {
  return baseServicesPath("admin/" + path)
}

export const baseAboutContentServicePathBuilder = (path) => {
  return baseServicesPath("about/" + path)
}

export const baseImageContentServicePathBuilder = (path) => {
  return baseServicesPath("images/" + path)
}
