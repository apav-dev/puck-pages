import { ComplexImageType, ImageType } from "@yext/pages-components";

export const getImageUrl = (
  imageObj:
    | { imageUrl: string }
    | { fieldId: string; value: ComplexImageType | ImageType }
) => {
  if ("imageUrl" in imageObj) {
    return imageObj.imageUrl;
  } else if (imageObj.value) {
    if ("image" in imageObj.value) {
      return imageObj.value.image.url;
    } else if ("url" in imageObj.value) {
      return imageObj.value.url;
    }
  }
  console.log("no image found");
  return "";
};
