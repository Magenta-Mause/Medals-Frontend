import { useCallback, useEffect, useState } from "react";
const emptyImage = "/emptyImage.png";

const useImageLoading = (imageUrls: string[]) => {
  const [imageUrl, setImageUrl] = useState<string>(emptyImage);
  const checkThenSetImageUrl = useCallback(
    (loadedImageUrl: string) => {
      const indexCurrent = imageUrls.findIndex((url) => url === imageUrl);
      const indexNew = imageUrls.findIndex((url) => url === loadedImageUrl);
      if (indexNew > indexCurrent) {
        setImageUrl(loadedImageUrl);
      }
    },
    [imageUrl, imageUrls],
  );

  useEffect(() => {
    imageUrls.forEach((imageUrl) => {
      const image = new Image();
      image.onload = () => {
        checkThenSetImageUrl(imageUrl);
      };
      image.src = imageUrl;
    });
  }, [imageUrls, checkThenSetImageUrl]);

  return imageUrl;
};

export default useImageLoading;
