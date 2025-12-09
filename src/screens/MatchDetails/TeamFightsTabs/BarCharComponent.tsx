import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";
import quickSand from "@src/Fonts/Quicksand_Bold.ttf";

function BarChartComp({
  formattedData,
  color,
}: {
  formattedData: { y: number }[];
  color: string;
}) {
  const [loading, setLoading] = useState(true);
  const font = useFont(quickSand, 9);
  const data = useMemo(() => {
    return formattedData.map((item, index) => ({
      x: index + 1,
      y: item.y,
    }));
  }, [formattedData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color} />
      </View>
    );

  return (
    <CartesianChart
      data={data}
      xKey="x"
      yKeys={["y"]}
      domainPadding={{ left: 15, right: 15, top: 30 }}
    >
      {({ points, chartBounds }) => (
        <Bar
          labels={{
            position: "top",
            font: font,
          }}
          //barWidth={15}
          chartBounds={chartBounds}
          points={points.y}
          roundedCorners={{
            topLeft: 9,
            topRight: 9,
          }}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, 400)}
            colors={[color, `${color}10`]}
          />
        </Bar>
      )}
    </CartesianChart>
  );
}

export const BarChartComponent = React.memo(BarChartComp);
BarChartComponent.displayName = "BarChartComponent";
