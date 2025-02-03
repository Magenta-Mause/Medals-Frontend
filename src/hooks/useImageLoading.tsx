import { useCallback, useEffect, useState } from "react";
import emptyImage from "@assets/emptyImage.png";

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
    [imageUrl],
  );

  useEffect(() => {
    imageUrls.forEach((imageUrl) => {
      const image = new Image();
      image.onload = () => {
        checkThenSetImageUrl(imageUrl);
      };
      image.src = imageUrl;
    });
  }, imageUrls);

  return imageUrl;
};

export default useImageLoading;
