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
      // Handling ComplexImageType
      return imageObj.value.image.url;
    } else if ("url" in imageObj.value) {
      // Handling ImageType
      return imageObj.value.url;
    }
  }
  return "";
};
