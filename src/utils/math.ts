// Greatest Common Divisor
export function gcd(a: number, b: number) {
  if (b == 0) return a

  return gcd(b, a % b)
}

// Least Common Multiple
export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

export function mod(value: number) {
  const max = Math.ceil(Math.sqrt(value))

  const modulos = []
  for (let i = 0; i <= max; i++) {
    if (value % i === 0) {
      modulos.push(i)
      const j = Math.floor(value / i)
      if (j != i) {
        modulos.push(j)
      }
    }
  }

  modulos.sort((a, b) => a - b)

  return modulos
}

export function primes(n: number) {
  // Eratosthenes algorithm to find all primes under n
  const array = [], upperLimit = Math.sqrt(n), output = [];

  // Make an array from 2 to (n - 1)
  for (let i = 0; i < n; i++) {
    array.push(true);
  }

  // Remove multiples of primes starting from 2, 3, 5,...
  for (let i = 2; i <= upperLimit; i++) {
    if (array[i]) {
      for (let j = i * i; j < n; j += i) {
        array[j] = false;
      }
    }
  }

  // All array[i] set to true are primes
  for (let i = 2; i < n; i++) {
    if(array[i]) {
      output.push(i);
    }
  }

  return output;
};

export function is_prime(n: number) {
  if (n <= 1) return false; // 0 and 1 are not prime numbers
  if (n <= 3) return true; // 2 and 3 are prime numbers
  if (n % 2 === 0 || n % 3 === 0) return false; // Eliminate multiples of 2 and 3

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false; // Check for divisors
  }
  return true; // No divisors found, n is prime
}

export function extended_gcd(a: number, b: number) {
    let r_arr = [a, b]
    let s_arr = [1, 0]
    let t_arr = [0, 1]

    while (r_arr[1] !== 0) {
      const quotient = Math.floor(r_arr[0] / r_arr[1])
      r_arr = [r_arr[1], r_arr[0] - quotient * r_arr[1]]
      s_arr = [s_arr[1], s_arr[0] - quotient * s_arr[1]]
      t_arr = [t_arr[1], t_arr[0] - quotient * t_arr[1]]
    }

    return [s_arr[0], t_arr[0]]
}

export function create_matrix(size: number) {
  return [...Array(size).keys()].map(() => Array(size).fill(0))
}

// log10(x) gives you the y in equation 10 ** y = x
// so for example log10(6439) = ~3.808
// by adding 1 and flooring we get the number of digits in any number
export function num_digits(value: number) {
  return Math.floor(Math.log10(value) + 1)
}
