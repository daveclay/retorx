// https://github.com/bitinn/node-fetch

const location = window.location
const host = `${location.protocol}//${location.hostname}${(location.port ? ':'+location.port: '')}/`

export const jsonApiFor = (baseUrl) => {
  const get = (url) => {
    return fetch(host + baseUrl + url, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .catch(err => {
        console.error(err);
      })
  }

  const send = (params) => {
    return fetch(host + baseUrl + params.url, {
      method: params.method,
      body: params.data,
      headers: params.headers || { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .catch(err => {
        console.error(err);
      })
  }

  const post = (params) => {
    return send(Object.assign({}, params, { method: "POST" }))
  }

  const put = (params) => {
    return send(Object.assign({}, params, { method: "PUT" }))
  }

  return {
    get: get,
    send: send,
    post: post,
    put: put
  }
}
