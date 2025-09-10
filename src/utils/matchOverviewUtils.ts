import { View } from "react-native";

export const formatDuration = (durationInMinutes: number): string => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export const formatStartTime = (startTime: number): string => {
  const date = new Date(startTime * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export const overviewBar = (k: number, d: number, a: number) => {
  const fullValue = k + d + a || 1;
  const killsPercent = (k * 100) / fullValue;
  const deathsPercent = (d * 100) / fullValue;
  const assisPercent = (a * 100) / fullValue;
  return {
    killsWidth: `${killsPercent}%`,
    deathsWidth: `${deathsPercent}%`,
    assisWidth: `${assisPercent}%`,
  };
};
