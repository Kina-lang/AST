import { TokenKind } from "@kina-lang/lexer";
import { KinaAssertionError } from "@kina-lang/utils";

export function getStringLiteralValue(literal: string): string {
  const startChar = literal[0];
  const endChar = literal[literal.length - 1];
  if (startChar != "'" && startChar != '"')
    throw new KinaAssertionError("Invalid string literal");
  if (endChar != startChar)
    throw new KinaAssertionError("Invalid string literal");

  return unescapeStringLiteral(literal.slice(1, -1), startChar);
}

export function unescapeStringLiteral(
  literal: string,
  startChar: string,
): string {
  if (startChar == '"') return literal.replace(/\\"/g, '"');
  if (startChar == "'") return literal.replace(/\\'/g, "'");

  throw new KinaAssertionError("Invalid string literal");
}

export const KINA_LITERAL_TOKENS = new Set([
  TokenKind.LiteralString,
  TokenKind.LiteralInteger,
  TokenKind.LiteralFloat,
  TokenKind.LiteralBoolean,
]);
