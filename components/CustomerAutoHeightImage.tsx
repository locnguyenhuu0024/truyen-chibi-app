import React from "react";
import AutoHeightImage, {
  AutoHeightImageProps,
} from "react-native-auto-height-image";

interface CustomAutoHeightImageProps extends AutoHeightImageProps {
  // Add any additional props here if needed
}

const CustomAutoHeightImage: React.FC<CustomAutoHeightImageProps> = ({
  width,
  source,
  onLoadStart,
  onLoadEnd,
  onError,
  ...props
}) => {
  return (
    <AutoHeightImage
      width={width}
      source={source}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onError={onError}
      {...props}
    />
  );
};

export default CustomAutoHeightImage;
