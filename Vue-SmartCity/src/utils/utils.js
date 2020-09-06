export function randomNum(Min, Max) {
  let Range = Max - Min;
  let Rand = Math.random();
  if (Math.round(Rand * Range) == 0) {
    return Min + 1;
  } else if (Math.round(Rand * Max) == Max) {
    return Max - 1;
  } else {
    let num = Min + Math.round(Rand * Range) - 1;
    return num;
  }
}

export function getRandomValue(min, max, weight) {
  return min + Math.round((max - min) * Math.pow(Math.random(), weight));
}

export function randomRgbColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}