import type { TokenKind } from "@kina-lang/lexer";

export type KinaTypeTokenKind =
  | TokenKind.TypeVoid
  | TokenKind.TypeInt
  | TokenKind.TypeBool;
