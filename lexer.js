const tokenTypes = {
  ADDITION: 'addition',
  SUBTRACTION: 'subtraction',
  EQUALS: 'equals',
  INTEGER: 'integer',
  VARIABLE: 'variable',
  MULTIPLICATION: 'multiplication',
  DIVISION: 'division',
  EXPONENTIAL: 'exponential',
}

const operators = {
  [tokenTypes.ADDITION]: '+',
  [tokenTypes.SUBTRACTION]: '-',
  [tokenTypes.MULTIPLICATION]: 'x',
  [tokenTypes.DIVISION]: '%',
  [tokenTypes.EXPONENTIAL]: '^',
  [tokenTypes.EQUALS]: '=',
}

tokenTypes.getOperatorSymbolFromTokenType = (tokenType) => operators[tokenType]

tokenTypes.getTokenTypeFromOperator = (operator) => {
  const tokenType = Object.keys(operators).find((key) => operators[key] === operator)
  return tokenTypes[Object.keys(tokenTypes).find((key) => tokenTypes[key] === tokenType)]
}

tokenTypes.getOperatorSymbols = () => Object.values(operators)

function lexer(input) {
  let index = 0
  let tokens = []

  while (index < input.length) {
    if (isNumber(input.charAt(index))) {
      const { number, newIndex } = readNumber(input, index)
      index = newIndex
      tokens.push(createLiteralToken(number))
    } else if (isVariable(input.charAt(index))) {
      tokens.push(createVariableToken(input.charAt(index)))
      index++
    } else if (isOperator(input.charAt(index))) {
      tokens.push(createOperatorToken(input.charAt(index)))
      index++
    } else {
      index++
    }
  }

  return tokensReader(tokens)
}

function isOperator(input) {
  return Object.values(operators).includes(input)
}

function isNumber(input) {
  return !isNaN(parseFloat(input))
}

function isVariable(input) {
  return input === '?'
}

function readNumber(input, index) {
  let number = ''

  while (isNumber(input.charAt(index)) || input.charAt(index) === '.') {
    number += input.charAt(index)
    index++
  }

  return { number, newIndex: index }
}

function createLiteralToken(literal) {
  return { type: tokenTypes.INTEGER, literal }
}

function createOperatorToken(symbol) {
  return { type: tokenTypes.getTokenTypeFromOperator(symbol) }
}

function createVariableToken() {
  return { type: tokenTypes.VARIABLE }
}

function tokensReader(tokens) {
  let index = 0

  return {
    consume: () => {
      const token = (index < tokens.length) ? tokens[index] : { type: 'EOF' }
      index++
      return token
    },
    lookAhead: (amount) => {
      return (index + amount < tokens.length) ? tokens[index + amount] : { type: 'EOF' }
    },
    dump: () => tokens
  }
}

module.exports = { lexer, tokenTypes }