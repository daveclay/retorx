// https://github.com/bitinn/node-fetch

const location = window.location
const host = `${location.protocol}//${location.hostname}${(location.port ? ':'+location.port: '')}/`

const API = (baseUrl) => {
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

    postFile: (params) => {
    },
  }
}

export const jsonApiFor = (baseUrl) => {
  let api = API(baseUrl)
  return {
    get: (url) => {
      return api.get(url)
        .then((response) => {
          return response
        })
    },

    post: (params) => {
      return api.post(params)
        .then((response) => {
          return response
        })
    },
    postFile: (params) => {
    },
  }
}
