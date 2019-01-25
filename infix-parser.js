const { tokenTypes } = require('./lexer')

const prefixOperations = {
  [tokenTypes.INTEGER]: parsePrefixLiteral,
  [tokenTypes.ADDITION]: parsePrefixOperator,
  [tokenTypes.SUBTRACTION]: parsePrefixOperator,
  [tokenTypes.VARIABLE]: parsePrefixVariable,
}

const infixOperations = {
  [tokenTypes.ADDITION]: parseInfixOperator,
  [tokenTypes.EQUALS]: parseInfixOperator,
  [tokenTypes.SUBTRACTION]: parseInfixOperator,
  [tokenTypes.MULTIPLICATION]: parseInfixOperator,
  [tokenTypes.DIVISION]: parseInfixOperator,
  [tokenTypes.EXPONENTIAL]: parseInfixOperator,
  [tokenTypes.VARIABLE]: parseInfixOperator,
}

const precedences = {
  [tokenTypes.EQUALS]: 2,
  [tokenTypes.ADDITION]: 3,
  [tokenTypes.VARIABLE]: 3,
  [tokenTypes.SUBTRACTION]: 3,
  [tokenTypes.MULTIPLICATION]: 4,
  [tokenTypes.DIVISION]: 4,
  [tokenTypes.EXPONENTIAL]: 5,
  PREFIX: 6,
}

const operatorTypes = {
  INFIX: 'infix',
  PREFIX: 'prefix'
}

function parseExpression(tokens, precedence = 0) {
  const token = tokens.consume()

  const nullDenotation = prefixOperations[token.type]

  if (nullDenotation === undefined) {
    throw new Error(`can't find the parser for ${JSON.stringify(token)}`)
  }

  let leftExpression = nullDenotation(tokens, token)

  while (precedence < getPrecedence(tokens)) {
    const nextToken = tokens.consume()

    const leftDenotation = infixOperations[nextToken.type]
    leftExpression = leftDenotation(tokens, leftExpression, nextToken)
  }

  return leftExpression
}

function getPrecedence(tokens) {
  const precedence = precedences[tokens.lookAhead(0).type]

  return (precedence === undefined) ? 0 : precedence
}

function parsePrefixLiteral(_, token) {
  return { type: tokenTypes.INTEGER, value: token.literal }
}

function parsePrefixVariable() {
  return { type: tokenTypes.VARIABLE }
}

function parsePrefixOperator(tokens, token) {
  return { type: operatorTypes.PREFIX, operator: token.type, operand: parseExpression(tokens, precedences.PREFIX) }
}

function parseInfixOperator(tokens, leftExpression, token) {
  const precedence = precedences[token.type]
  return { type: operatorTypes.INFIX, operator: token.type, leftExpression, rightExpression: parseExpression(tokens, precedence) }
}

module.exports = { infixParser: parseExpression, operatorTypes }