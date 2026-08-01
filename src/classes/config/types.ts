import { LexerTokenType } from "@kina-lang/lexer";

export const TokensValidAsNamedTypeAnnotations = [
  LexerTokenType.Identifier,
  LexerTokenType.KeywordFloat,
  LexerTokenType.KeywordInt,
  LexerTokenType.KeywordString,
  LexerTokenType.KeywordBoolean,
  LexerTokenType.KeywordPointer,
  LexerTokenType.KeywordVoid,
];
