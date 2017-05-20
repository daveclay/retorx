// https://github.com/bitinn/node-fetch

const location = window.location
const host = `${location.protocol}//${location.hostname}${(location.port ? ':'+location.port: '')}/`

export const jsonApiFor = (baseUrl) => {
  return {
    get: (url) => {
      return fetch(host + baseUrl + url, {
        credentials: 'same-origin'
      })
        .then(res => res.json())
        .catch(err => {
          console.error(err);
        })
    },

    post: (params) => {
      return fetch(host + baseUrl + params.url, {
        method: 'POST',
        body: params.data,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      })
        .then(res => res.json())
        .catch(err => {
          console.error(err);
        })
    },

    put: (params) => {
      return fetch(host + baseUrl + params.url, {
        method: 'PUT',
        body: params.data,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin'
      })
        .then(res => res.json())
        .catch(err => {
          console.error(err);
        })
    },

    postFile: (params) => {
      let formData = new FormData()
      formData.append("image", params.file)
      return fetch(host + baseUrl + params.url, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      })
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => {
          console.error(err);
          reject(err)
        })
    },
  }
}
