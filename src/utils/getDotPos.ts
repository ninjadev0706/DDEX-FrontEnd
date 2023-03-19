export const getDotPos = (index, carouselLength) => {
  return index >= carouselLength * 2
    ? index - carouselLength * 2
    : index - carouselLength < 0
    ? index
    : index - carouselLength
}
