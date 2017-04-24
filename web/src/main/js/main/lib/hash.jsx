export const parseHash = () => {
  let hash = window.location.hash;
  let hashObj = hash.split("&").slice(1);
  if (hashObj) {
    let data = {};
    let gidParam = hashObj[0];
    if (gidParam && gidParam.indexOf("=") > -1 ) {
      data.tag = gidParam.split("=")[1];
    }
    let pidParam = hashObj[1];
    if (pidParam && pidParam.indexOf("=") > -1) {
      data.imageId = pidParam.split("=")[1];
    }

    return data;
  }
};
