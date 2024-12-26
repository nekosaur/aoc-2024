function isIncreasingOrDecreasing(report: number[]) {
  let foo = null;
  for (let i = 1; i < report.length; i++) {
    const last = report[i - 1];
    const curr = report[i];

    foo ??= last < curr;

    if (foo !== last < curr) {
      return false;
    }
  }

  return true;
}

function isAdjacentByOneToThree(report: number[]) {
  for (let i = 1; i < report.length; i++) {
    const last = report[i - 1];
    const curr = report[i];

    const diff = Math.abs(last - curr);

    if (diff < 1 || diff > 3) {
      return false;
    }
  }

  return true;
}

export function day2a(data: string[]) {
  const reports = data.map(line => line.split(" ").map(Number))

  const safe = reports.filter(report => {
    return isIncreasingOrDecreasing(report) && isAdjacentByOneToThree(report)
  })

  return safe.length;
}
