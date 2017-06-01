// https://github.com/bitinn/node-fetch

const location = window.location
const host = `${location.protocol}//${location.hostname}${(location.port ? ':'+location.port: '')}/`

const parseJSONResponse = (res) => {
  if (!res.ok) {
    return new Promise((resovle, reject) => {
      let contentType = res.headers.get("content-type")
      if (contentType == "text/json" || contentType == "application/json") {
        return res.json().then(json => reject(json))
      } else {
        reject({ "message": res.statusText })
      }
    })
  } else {
    return res.json()
  }
}

export const jsonApiFor = (urlBuilder) => {
  const get = (path) => {
    return fetch(urlBuilder(path), {
      credentials: 'same-origin'
    })
      .then(parseJSONResponse)
  }

  const send = (params) => {
    return fetch(urlBuilder(params.path), {
      method: params.method,
      body: params.data,
      headers: params.headers || { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    })
      .then(parseJSONResponse)
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
