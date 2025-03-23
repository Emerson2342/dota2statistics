import React from "react";
import {
  Dimensions,
  processColor,
  ProcessedColorValue,
  View,
} from "react-native";
import { BarChart, BarData } from "react-native-charts-wrapper";

export function BarCarComponent({
  formattedData,
  color,
}: {
  formattedData: any;
  color: ProcessedColorValue | null | undefined;
}) {
  const damageBarHeight = Dimensions.get("window").height * 0.05;

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
        durationY: 3000,
        easingY: "EaseInOutQuart",
      }}
      legend={{ enabled: false }}
      viewPortOffsets={{ left: 0, top: 0, right: 0, bottom: 0 }}
    />
  );
}
