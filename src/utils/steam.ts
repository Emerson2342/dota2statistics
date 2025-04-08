export const toSteam32 = (id: string | number): string => {
  const steamId = BigInt(id);
  const offset = 76561197960265728n;

  if (steamId >= offset) {
    return (steamId - offset).toString();
  }
  return steamId.toString();
};
