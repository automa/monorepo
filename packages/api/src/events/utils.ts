export const chunkArray = <T>(array: T[], chunkSize: number): T[][] =>
  Array(Math.ceil(array.length / chunkSize))
    .fill(0)
    .map((_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));
