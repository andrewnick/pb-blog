const KM = 0.001;
const KPH = 3.6;

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

export const speedConvert = (value, newUnit) => {
  let newValue = value;

  switch (newUnit) {
    case "km/h":
      newValue = value * KPH;
      newValue = newValue.toFixed(1);
      break;

    default:
      break;
  }

  return `${newValue} ${newUnit}`;
};
