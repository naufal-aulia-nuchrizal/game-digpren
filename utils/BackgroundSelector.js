export function getRandomCityBackgroundPath() {
  const total = 20;
  const random = Math.floor(Math.random() * total) + 1;
  return `assets/backgrounds/City${random}.png`;
}
