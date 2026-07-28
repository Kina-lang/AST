import { TokenKind } from "@kina-lang/lexer";
import { Diagnostics } from "@kina-lang/utils";

export function getStringLiteralValue(literal: string): string {
  const startChar = literal[0];
  const endChar = literal[literal.length - 1];
  if (startChar != "'" && startChar != '"')
    Diagnostics.throwInternal("Invalid string literal");
  if (endChar != startChar)
    Diagnostics.throwInternal("Invalid string literal");

  return unescapeStringLiteral(literal.slice(1, -1), startChar);
}

export function unescapeStringLiteral(
  literal: string,
  startChar: string,
): string {
  if (startChar == '"') return literal.replace(/\\"/g, '"');
  if (startChar == "'") return literal.replace(/\\'/g, "'");

  Diagnostics.throwInternal("Invalid string literal");
}

export const KINA_LITERAL_TOKENS = new Set([
  TokenKind.LiteralString,
  TokenKind.LiteralInteger,
  TokenKind.LiteralFloat,
  TokenKind.LiteralBoolean,
]);
