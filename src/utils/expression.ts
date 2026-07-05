import { TokenKind } from "@kina-lang/lexer";

/**
 * Precedence levels for the Pratt expression parser.
 * Higher values bind tighter.
 */
export const KINA_EXPRESSION_PRECEDENCE = {
  LOWEST: 0,
  ASSIGNMENT: 5, // =
  LOGICAL_OR: 6, // ||
  LOGICAL_AND: 7, // &&
  EQUALITY: 8, // == !=
  COMPARISON: 9, // < <= > >=
  SUM: 10, // + -
  PRODUCT: 20, // * /
  PREFIX: 25, // unary + -
  CALL: 30, // myFunction()
  MEMBER_ACCESS: 40, // object.property
};

/**
 * Maps infix operator token kinds to their precedence level.
 */
export const KINA_INFIX_PRECEDENCE = new Map<TokenKind, number>([
  [TokenKind.OperatorAssign, KINA_EXPRESSION_PRECEDENCE.ASSIGNMENT],
  [TokenKind.OperatorOr, KINA_EXPRESSION_PRECEDENCE.LOGICAL_OR],
  [TokenKind.OperatorAnd, KINA_EXPRESSION_PRECEDENCE.LOGICAL_AND],
  [TokenKind.OperatorEqual, KINA_EXPRESSION_PRECEDENCE.EQUALITY],
  [TokenKind.OperatorNotEqual, KINA_EXPRESSION_PRECEDENCE.EQUALITY],
  [TokenKind.OperatorLessThan, KINA_EXPRESSION_PRECEDENCE.COMPARISON],
  [TokenKind.OperatorLessThanOrEqual, KINA_EXPRESSION_PRECEDENCE.COMPARISON],
  [TokenKind.OperatorGreaterThan, KINA_EXPRESSION_PRECEDENCE.COMPARISON],
  [TokenKind.OperatorGreaterThanOrEqual, KINA_EXPRESSION_PRECEDENCE.COMPARISON],
  [TokenKind.OperatorPlus, KINA_EXPRESSION_PRECEDENCE.SUM],
  [TokenKind.OperatorMinus, KINA_EXPRESSION_PRECEDENCE.SUM],
  [TokenKind.OperatorMultiply, KINA_EXPRESSION_PRECEDENCE.PRODUCT],
  [TokenKind.OperatorDivide, KINA_EXPRESSION_PRECEDENCE.PRODUCT],
  [TokenKind.OperatorModulo, KINA_EXPRESSION_PRECEDENCE.PRODUCT],
]);

/**
 * Maps infix operator token kinds to their string representation.
 */
export const KINA_INFIX_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.OperatorAssign, "="],
  [TokenKind.OperatorOr, "||"],
  [TokenKind.OperatorAnd, "&&"],
  [TokenKind.OperatorEqual, "=="],
  [TokenKind.OperatorNotEqual, "!="],
  [TokenKind.OperatorLessThan, "<"],
  [TokenKind.OperatorLessThanOrEqual, "<="],
  [TokenKind.OperatorGreaterThan, ">"],
  [TokenKind.OperatorGreaterThanOrEqual, ">="],
  [TokenKind.OperatorPlus, "+"],
  [TokenKind.OperatorMinus, "-"],
  [TokenKind.OperatorMultiply, "*"],
  [TokenKind.OperatorDivide, "/"],
  [TokenKind.OperatorModulo, "%"],
]);

/**
 * Maps prefix operator token kinds to their string representation.
 */
export const KINA_PREFIX_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.OperatorPlus, "+"],
  [TokenKind.OperatorMinus, "-"],
  [TokenKind.OperatorNot, "!"],
]);

/**
 * Set of token kinds that act as right-associative infix operators.
 * Right-associative operators parse their right-hand side at the same precedence,
 * allowing chaining like `a = b = c` → `a = (b = c)`.
 */
export const KINA_RIGHT_ASSOCIATIVE_OPERATORS = new Set<TokenKind>([
  TokenKind.OperatorAssign,
]);
