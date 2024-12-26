function isIncreasingOrDecreasing(report: number[]) {
  let foo = null;
  const dampener = false;
  for (let i = 1; i < report.length; i++) {
    const last = report[i - (dampener ? 2 : 1)];
    const curr = report[i];

    foo ??= last < curr;

    if (foo !== last < curr) {
      return false;
    }
  }

  return true;
}

function isAdjacentByOneToThree(report: number[]) {
  const dampener = false;
  for (let i = 1; i < report.length; i++) {
    const last = report[i - (dampener ? 2 : 1)];
    const curr = report[i];

    const diff = Math.abs(last - curr);

    if (diff < 1 || diff > 3) {
      return false;
    }
  }

  return true;
}

function generateVariants(report: number[]) {
  const arr: number[][] = []
  for (let i = 0; i < report.length; i++) {
    arr.push(report.slice(0, i).concat(report.slice(i + 1, report.length)))
  }

  return arr
}

export function day2b(data: string[]) {
  const reports = data.map(line => line.split(" ").map(Number))

  const unsafe = reports.filter(report => {
    return !isIncreasingOrDecreasing(report) || !isAdjacentByOneToThree(report)
  })

  const firstSafe = reports.length - unsafe.length;

  const altered = unsafe.map(report => generateVariants(report))

  const safe = altered.filter(variants => {
    return variants.some(report => isIncreasingOrDecreasing(report) && isAdjacentByOneToThree(report))
  })

  return firstSafe + safe.length
}
