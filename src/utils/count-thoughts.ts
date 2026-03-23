export const countThoughts = (
  numThinking: number,
  minProportion: number | null = null,
  minTotal: number | null = null,
  maxProportion: number | null = null,
  maxTotal: number | null = null,
) => {
  if (minProportion) {
    return {
      passed: numThinking > Math.floor(park.guests / minProportion),
      required: Math.floor(park.guests / minProportion),
      actual: numThinking,
    };
  }
  if (minTotal) {
    return {
      passed: numThinking > minTotal,
      required: minTotal,
      actual: numThinking,
    };
  }
  if (maxProportion) {
    return {
      passed: numThinking < Math.floor(park.guests / maxProportion),
      required: Math.floor(park.guests / maxProportion),
      actual: numThinking,
    };
  }
  if (maxTotal) {
    return {
      passed: numThinking < maxTotal,
      required: maxTotal,
      actual: numThinking,
    };
  }
  return { passed: true, required: 0 };
};
