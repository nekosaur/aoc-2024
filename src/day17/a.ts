type Computer = {
  registers: [bigint, bigint, bigint],
  instructions: number[]
}

const A = 0
const B = 1
const C = 2

const ADV = 0
const BXL = 1
const BST = 2
const JNZ = 3
const BXC = 4
const OUT = 5
const BDV = 6
const CDV = 7

function computer(data: string[]): Computer {
  const a = BigInt(data.shift().match(/(\d+)/)[1])
  const b = BigInt(data.shift().match(/(\d+)/)[1])
  const c = BigInt(data.shift().match(/(\d+)/)[1])

  data.shift()

  const instructions = [...data.shift().match(/(\d+)/g)].map(Number)

  return {
    registers: [a, b, c],
    instructions,
  }
}

function combo(computer: Computer, operand: number): bigint {
  if (operand <= 3) return BigInt(operand)
  if (operand <= 6) return computer.registers[operand - 4]
  throw new Error(`operand ${operand} is reserved`)
}

function bst(computer: Computer, pointer: number) {
  const operand = computer.instructions[++pointer]
  const value = combo(computer, operand)

  computer.registers[B] = value % BigInt(8)

  return ++pointer
}

function out(computer: Computer, pointer: number, output: number[]) {
  const operand = computer.instructions[++pointer]
  const value = combo(computer, operand)

  output.push(Number(value % BigInt(8)))

  return ++pointer
}

function adv(computer: Computer, pointer: number) {
  const operand = computer.instructions[++pointer]
  const value = combo(computer, operand)

  const numerator = computer.registers[A]
  const denominator = BigInt(2)**value

  computer.registers[A] = numerator / denominator

  return ++pointer
}

function jnz(computer: Computer, pointer: number) {
  const operand = computer.instructions[++pointer]

  if (computer.registers[A] !== BigInt(0)) {
    return operand
  }

  return ++pointer
}

function bxl(computer: Computer, pointer: number) {
  const operand = computer.instructions[++pointer]

  const left = computer.registers[B]
  const right = BigInt(operand)

  computer.registers[B] = left ^ right

  return ++pointer
}

function bxc(computer: Computer, pointer: number) {
  const left = computer.registers[B]
  const right = computer.registers[C]

  computer.registers[B] = left ^ right

  return pointer + 2
}

function bdv(computer: Computer, pointer: number) {
  const operand = computer.instructions[++pointer]
  const value = combo(computer, operand)

  const numerator = computer.registers[A]
  const denominator = BigInt(2)**value

  computer.registers[B] = numerator / denominator

  return ++pointer
}

function cdv(computer: Computer, pointer: number) {
  const operand = computer.instructions[++pointer]
  const value = combo(computer, operand)

  const numerator = computer.registers[A]
  const denominator = BigInt(2)**value

  computer.registers[C] = numerator / denominator

  return ++pointer
}

export function run(computer: Computer) {
  let pointer = 0
  const output = []

  while (pointer < computer.instructions.length) {
    switch (computer.instructions[pointer]) {
      case BST: {
        pointer = bst(computer, pointer)
        break
      }
      case OUT: {
        pointer = out(computer, pointer, output)
        break
      }
      case ADV: {
        pointer = adv(computer, pointer)
        break
      }
      case JNZ: {
        pointer = jnz(computer, pointer)
        break
      }
      case BXL: {
        pointer = bxl(computer, pointer)
        break
      }
      case BXC: {
        pointer = bxc(computer, pointer)
        break
      }
      case BDV: {
        pointer = bdv(computer, pointer)
        break
      }
      case CDV: {
        pointer = cdv(computer, pointer)
        break
      }
      default: {
        throw new Error("not implemented")
      }
    }
  }

  return output
}

export function day17a(data: string[]) {
  const c = computer(data)

  const output = run(c)

  return output.join(',');
}
