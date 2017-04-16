// https://github.com/bitinn/node-fetch

const location = window.location
const host = `${location.protocol}//${location.hostname}${(location.port ? ':'+location.port: '')}/`

export const jsonApiFor = (baseUrl) => {
  return {
    get: (url) => {
      return fetch(host + baseUrl + url)
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
