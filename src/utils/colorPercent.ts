export const colorPercent = (percent: number): string => {
  if (percent >= 0 && percent < 20) return "#ff4d4d";
  if (percent >= 20 && percent < 35) return "#ff7934";
  if (percent >= 35 && percent < 50) return "#ffae1a";
  if (percent >= 50 && percent < 75) return "#66cc66";
  if (percent >= 75) return "green";
  return "gray";
};
