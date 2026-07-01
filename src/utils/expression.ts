import { TokenKind } from "@kina-lang/lexer";

/**
 * Precedence levels for the Pratt expression parser.
 * Higher values bind tighter.
 */
export const KINA_EXPRESSION_PRECEDENCE = {
  LOWEST: 0,
  ASSIGNMENT: 5, // =
  SUM: 10, // + -
  PRODUCT: 20, // * /
  CALL: 30, // myFunction()
  MEMBER_ACCESS: 40, // object.property
};

/**
 * Maps infix operator token kinds to their precedence level.
 */
export const KINA_INFIX_PRECEDENCE = new Map<TokenKind, number>([
  [TokenKind.OperatorAssign, KINA_EXPRESSION_PRECEDENCE.ASSIGNMENT],
]);

/**
 * Maps infix operator token kinds to their string representation.
 */
export const KINA_INFIX_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.OperatorAssign, "="],
]);

/**
 * Set of token kinds that act as right-associative infix operators.
 * Right-associative operators parse their right-hand side at the same precedence,
 * allowing chaining like `a = b = c` → `a = (b = c)`.
 */
export const KINA_RIGHT_ASSOCIATIVE_OPERATORS = new Set<TokenKind>([
  TokenKind.OperatorAssign,
]);
