import moment from "moment"

import { baseImageContentServicePath } from "../../main/constants/constants"

export const transformImage = (image) => {
  image.set("findImageFileByName", (imageFileName) => {
    return this.imageFiles.find(imageFile => {
      return imageFile.name == imageFileName;
    });
  })
    .set("image")

  let imageFiles = image.imageFiles;
  imageFiles.forEach(imageFile => {
    imageFile.src = `${baseImageContentServicePath}image/${imageFile.name}/${image.name}.png`
  });

  let milliseconds = image.date;
  let date = moment(milliseconds);
  image.dateText = date.format("mmm yyyy");

  return image
};


export const transformImages = (images) => {
  return images.map(image => {
    return transformImage(image);
  })
}

