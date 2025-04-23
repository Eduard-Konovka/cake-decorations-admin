export function getSum(...args) {
  if (args.some(arg => typeof arg !== 'number')) {
    return 'Invalid input';
  }

  const maxBitness = args.reduce((max, num) => {
    const bitness = (num.toString().split('.')[1] || '').length;
    return Math.max(max, bitness);
  }, 0);

  const degreeAdjustment = 10 ** maxBitness;
  const degreeSum = args.reduce((acc, num) => acc + num * degreeAdjustment, 0);

  return degreeSum / degreeAdjustment;
}
