import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;


export const getHeroPosition = (lane: number, index: number) => {
    const isRadiant = index < 5;


    if (lane === 1) {
        return isRadiant
            ? {
                bottom: width * 0.1, right: width * 0.1
            }
            : { bottom: width * 0.25, right: width * 0.05 };
    }
    if (lane === 2) {
        return isRadiant ? {
            top: width * 0.47,
            left: width * 0.33,
        } : {
            top: width * 0.37,
            left: width * 0.4,
        };
    }

    return isRadiant
        ? { top: width * 0.25, left: width * 0.03 }
        : { top: width * 0.07, left: width * 0.1 };
};
