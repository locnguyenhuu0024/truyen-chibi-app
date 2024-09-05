import React from "react";
import { View, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const CustomCarousel = ({
  data = [...new Array(6).keys()],
  viewCount = 5,
  mode = "horizontal-stack",
  snapDirection = "left",
  pagingEnabled = true,
  snapEnabled = true,
  loop = true,
  autoPlay = false,
  autoPlayReverse = false,
  carouselWidth = 300,
  carouselHeight = 210,
  carouseMaxHeight = 210,
  carouseMaxWidth = 300,
  carouseMinHeight = 210,
  containerStyle = {},
  // @ts-ignore
  renderItem, // renderItem được truyền từ bên ngoài
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Carousel
        style={styles.carousel}
        width={carouselWidth}
        height={carouselHeight}
        maxHeight={carouseMaxHeight}
        maxWidth={carouseMaxWidth}
        minHeight={carouseMinHeight}
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        // @ts-ignore
        mode={mode}
        loop={loop}
        autoPlay={autoPlay}
        autoPlayReverse={autoPlayReverse}
        data={data}
        modeConfig={{
          // @ts-ignore
          snapDirection,
          stackInterval: mode === "vertical-stack" ? 8 : 18,
        }}
        customConfig={() => ({ type: "positive", viewCount })}
        renderItem={renderItem} // Sử dụng renderItem được truyền vào
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    width: "100%",
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomCarousel;
