import { useThemeStore } from "@src/store/theme";
import { View, Dimensions } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  G,
  Path,
  Rect,
} from "react-native-svg";

const { width } = Dimensions.get("window");

export function WaveTrendings() {
  const colorTheme = useThemeStore((state) => state.colorTheme);

  return (
    <View
      style={{
        position: "absolute",
      }}
    >
      <Svg
        id="visual"
        width="540"
        height="960"
        viewBox="0 0 540 960"
        preserveAspectRatio="none"
      >
        <G>
          <G transform="translate(100 700)">
            <Path
              d="M0 -132.6L114.8 -66.3L114.8 66.3L0 132.6L-114.8 66.3L-114.8 -66.3Z"
              fill={colorTheme.semilight}
            />
          </G>
          <G transform="translate(442 286)">
            <Path
              d="M0 -99L85.7 -49.5L85.7 49.5L0 99L-85.7 49.5L-85.7 -49.5Z"
              fill={colorTheme.semilight}
            />
          </G>
          <G transform="translate(22 34)">
            <Path
              d="M0 -80L69.3 -40L69.3 40L0 80L-69.3 40L-69.3 -40Z"
              fill={colorTheme.semilight}
            />
          </G>
        </G>
      </Svg>
    </View>
  );
}

export function WaveProfile() {
  const colorTheme = useThemeStore((state) => state.colorTheme);

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
      }}
    >
      <Svg
        id="visual"
        width="540"
        height="960"
        viewBox="0 0 540 960"
        preserveAspectRatio="none"
      >
        <G>
          <G transform="translate(375 51)">
            <Path
              d="M0 -132.6L114.8 -66.3L114.8 66.3L0 132.6L-114.8 66.3L-114.8 -66.3Z"
              fill={colorTheme.semilight}
            ></Path>
          </G>
          <G transform="translate(409 405)">
            <Path
              d="M0 -109L94.4 -54.5L94.4 54.5L0 109L-94.4 54.5L-94.4 -54.5Z"
              fill={colorTheme.semilight}
            ></Path>
          </G>
          <G transform="translate(11 580)">
            <Path
              d="M0 -126L109.1 -63L109.1 63L0 126L-109.1 63L-109.1 -63Z"
              fill={colorTheme.semilight}
            ></Path>
          </G>
        </G>
      </Svg>
    </View>
  );
}
