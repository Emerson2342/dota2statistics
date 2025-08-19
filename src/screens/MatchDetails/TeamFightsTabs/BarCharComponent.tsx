import React, { useRef } from "react";
import {
  Dimensions,
  processColor,
  ProcessedColorValue,
  View,
} from "react-native";
import { BarChart } from "react-native-charts-wrapper";

function BarChartComp({
  formattedData,
  color,
}: {
  formattedData: any;
  color: ProcessedColorValue | null | undefined;
}) {
  const damageBarHeight = Dimensions.get("window").height * 0.05;
  //   const hasAnimated = useRef(false);
  //   const animationConfig = !hasAnimated.current
  //   ? { durationX: 3500, durationY: 3500, easingX: "EaseInOutQuart", easingY: "EaseInOutQuart" }
  //   : { durationX: 0, durationY: 0 };

  // hasAnimated.current = true;

  const state = {
    data: {
      dataSets: [
        {
          values: formattedData,
          label: "Zero line dataset",
          config: {
            color: color,
          },
        },
      ],
    },
    xAxis: {
      enabled: false,
    },
    yAxis: {
      left: {
        drawLabels: false,
        drawAxisLine: false,
        drawGridLines: false,

        zeroLine: {
          enabled: true,
        },
      },
      right: {
        enabled: false,
      },
    },
  };

  return (
    <BarChart
      style={{
        height: damageBarHeight,
      }}
      data={state.data}
      yAxis={state.yAxis}
      xAxis={state.xAxis}
      doubleTapToZoomEnabled={false}
      chartDescription={{ text: "" }}
      animation={{
        durationX: 3500,
        durationY: 3500,
        easingX: "EaseInOutQuart",
        easingY: "EaseInOutQuart",
      }}
      legend={{ enabled: false }}
      viewPortOffsets={{ left: 0, top: 0, right: 0, bottom: 0 }}
    />
  );
}

export const BarChartComponent = React.memo(BarChartComp);
BarChartComponent.displayName = "BarChartComponent";
