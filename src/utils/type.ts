import { TokenKind } from "@kina-lang/lexer";

export const KINA_TYPE_TOKENS = new Set([
  TokenKind.TypeVoid,
  TokenKind.TypeInt,
  TokenKind.TypeBool,
]);
