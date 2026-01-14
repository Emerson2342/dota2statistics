import { Dimensions } from "react-native";

const width =
  Dimensions.get("window").width > 600 ? 600 : Dimensions.get("window").width;

export const getHeroPosition = (
  lane: number,
  index: number,
  sameLaneIndex: number
) => {
  const isRadiant = index < 5;
  const gap = width * 0.1;
  const offset = sameLaneIndex * gap;

  if (lane === 1) {
    return isRadiant
      ? {
          bottom: width * 0.1,
          right: width * 0.1 + offset,
        }
      : { bottom: width * 0.07 + offset, right: width * 0.05 };
  }
  if (lane === 2) {
    return isRadiant
      ? {
          top: width * 0.47,
          left: width * 0.33,
        }
      : {
          top: width * 0.37,
          left: width * 0.4,
        };
  }

  return isRadiant
    ? { top: width * 0.25 + offset, left: width * 0.03 }
    : { top: width * 0.07, left: -(width * 0.1) + offset };
};
