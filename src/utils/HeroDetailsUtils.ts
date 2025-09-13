export const manaCoust = (mc?: string | string[]) => {
  if (Array.isArray(mc)) {
    return mc.join(", ");
  }
  return mc ?? "";
};

export const coolDownTime = (cd?: string | string[]) => {
  if (Array.isArray(cd)) {
    return cd.join(", ");
  }
  return cd ?? "";
};
