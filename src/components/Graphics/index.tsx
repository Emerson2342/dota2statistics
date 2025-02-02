import React from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';

import { styles } from './styles';
import PieChart from 'react-native-pie-chart';

const { width } = Dimensions.get('window');

export function Graphics({ title, bar1, bar2, legenda1, legenda2 }: { title: string, bar1: number, bar2: number, legenda1: string, legenda2: string }) {
  const widthAndHeight = width * 0.10;
  const series = [bar1, bar2]
  const sliceColor = ['#00ffff', '#ff0000']

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>{title}</Text>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
        />
      </View>
      <View style={styles.content}>
        <Text style={{
          fontSize: width * 0.03,
          alignSelf: "center",
          color: "#00ffff",
          fontWeight: 'bold'
        }}>{legenda1}</Text>
        <Text style={{
          fontSize: width * 0.03,
          alignSelf: "center",
          fontWeight: 'bold',
          color: "#ff0000",
        }}>{legenda2}</Text>
      </View>
    </View>
  );
}