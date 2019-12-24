export const swapLatLng = ll => {
  const newLL = ll.map(coord => {
    return [coord[1], coord[0]];
  });
  return newLL;
};

export const centreLatLng = stream => {
  const lat = stream.map(latlng => latlng[0]);
  const lng = stream.map(latlng => latlng[1]);

  const maxLng = lng.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  const maxLat = lat.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  const minLng = lng.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  const minLat = lat.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  const centreLat = (maxLat - minLat) / 2 + minLat;
  const centreLng = (maxLng - minLng) / 2 + minLng;

  return { lat: centreLat, lng: centreLng };
};

export const latLngArray = latlng => {
  return { lat: latlng.map(ll => ll[0]), lng: latlng.map(ll => ll[1]) };
};

export const maxLatLng = (lat, lng) => {
  const maxLng = lng.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  const maxLat = lat.reduce((accumulator, currentValue) => {
    return accumulator > currentValue ? accumulator : currentValue;
  });

  return { lat: maxLat, lng: maxLng };
};

export const minLatLng = (lat, lng) => {
  const minLng = lng.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  const minLat = lat.reduce((accumulator, currentValue) => {
    return accumulator < currentValue ? accumulator : currentValue;
  });

  return { lat: minLat, lng: minLng };
};
