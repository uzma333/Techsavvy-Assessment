export const formatValue = (value, type) => {
  if (type === 'currency') return `₹${value.toFixed(2)}`;
  if (type === 'percentage') return `${(value * 100).toFixed(2)}%`;
  return value.toLocaleString();
};

export const getColorClass = (metric, value, type) => {
  const darkToLight = ['CPC', 'CPM', 'CPO', 'ACOS', 'CPA'];
  const lightToDark = !darkToLight.includes(metric);

  const intensity = Math.min(255, Math.floor((value / 1000000) * 255)); // normalize scale
  const color = lightToDark ? 255 - intensity : intensity;

  return `bg-[rgb(255,${color},${color})]`;
};


export const getRGBColor = (metric, value, type) => {
  const darkToLight = ['CPC', 'CPM', 'CPO', 'ACOS', 'CPA'];
  const lightToDark = !darkToLight.includes(metric);

  const maxValue = type === 'currency' ? 100 : type === 'number' ? 10000000 : 1;
  const normalized = Math.min(1, value / maxValue);

  const red = lightToDark ? 255 : 255 - Math.round(normalized * 255);
  const green = lightToDark ? 255 - Math.round(normalized * 255) : 255;
  const blue = 255;

  return `rgb(${red}, ${green}, ${blue})`;
};