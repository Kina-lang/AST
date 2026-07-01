import type { TokenKind } from "@kina-lang/lexer";

export type KinaLiteralTokenKind =
  | TokenKind.LiteralBoolean
  | TokenKind.LiteralInteger
  | TokenKind.LiteralFloat
  | TokenKind.LiteralString;
