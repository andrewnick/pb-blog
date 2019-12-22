const KM = 0.001;

export const distanceConvert = (value, newUnit) => {
  let newValue = value;

  switch (newUnit) {
    case "km":
      newValue = value * KM;
      newValue = newValue.toFixed(2);
      break;

    default:
      break;
  }

  return `${newValue} ${newUnit}`;
};
