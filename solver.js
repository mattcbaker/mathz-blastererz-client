const { lexer } = require('./lexer')
const { infixParser } = require('./infix-parser')
const evaluator = require('./infix-evaluator')
const reducer = require('./infix-reducer')
const reversePolishEvaluator = require('./reverse-polish-evaluator')

const notations = {
  INFIX: 'Infix',
  REVERSE_POLISH: 'Reverse Polish',
}

async function solver(expression) {
  if (expression.notation === notations.INFIX) {
    return await solveInfixExpression(expression)
  } else {
    return await solveReversePolishExpression(expression)
  }
}

async function solveInfixExpression(expression) {
  const tokens = lexer(expression.literal)
  const parsed = infixParser(tokens)
  const evaluated = await evaluator(parsed)
  return await reducer(evaluated)
}

async function solveReversePolishExpression(expression) {
  const tokens = lexer(expression.literal)
  return await reversePolishEvaluator(tokens)
}

module.exports = { solver, notations }