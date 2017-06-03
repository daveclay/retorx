const getParameterByName = (name) => {
  let url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");

  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const parseParams = () => {
  let tag = getParameterByName("gid")
  let imageId = getParameterByName("pid")

  if (tag || imageId) {
    return {
      tag: tag,
      imageId: imageId
    }
  }
}

const parseHash = () => {
  let hash = window.location.hash;
  let hashObj = hash.split("&").slice(1);
  if (hashObj) {
    let tag = parseGidFromHash(hashObj)
    let imageId = parsePidFromHash(hashObj)

    if (tag || imageId) {
      return {
        tag: tag,
        imageId: imageId
      }
    }
  }
};

const parseGidFromHash = (hashObj) => {
  let gidParam = hashObj[0];
  if (gidParam && gidParam.indexOf("=") > -1 ) {
    return gidParam.split("=")[1];
  }
}

const parsePidFromHash = (hashObj) => {
  let pidParam = hashObj[1];
  if (pidParam && pidParam.indexOf("=") > -1) {
   return pidParam.split("=")[1];
  }
}

export const parseRequest = () => {
  return parseHash() || parseParams()
}

