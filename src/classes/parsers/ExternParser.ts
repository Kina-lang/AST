import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import type { KinaTypeTokenKind } from "../../types/types";
import { KINA_TYPE_TOKENS } from "../../utils/type";
import { ExternNode } from "../nodes/Extern";

export class ExternParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordExtern) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expect(TokenKind.KeywordExtern);

    const nameToken = tokenStream.expect(
      TokenKind.Identifier,
    ) as IdentifierToken;

    tokenStream.expect(TokenKind.ParentheseOpen);
    const parameterTypes = this.parseParameterTypes(tokenStream);
    tokenStream.expect(TokenKind.ParentheseClose);

    tokenStream.expect(TokenKind.Colon);

    const returnTypeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);

    const end = returnTypeToken;
    const semicolon = tokenStream.match(TokenKind.Semicolon);

    return [
      new ExternNode(
        { start: start.span!.start, end: (semicolon ?? end).span!.end },
        nameToken.value,
        parameterTypes,
        returnTypeToken.kind as KinaTypeTokenKind,
      ),
    ];
  }

  private parseParameterTypes(tokenStream: TokenStream): KinaTypeTokenKind[] {
    const nextToken = tokenStream.peek();
    if (nextToken === null) return [];
    if (nextToken.kind === TokenKind.ParentheseClose) return [];

    const parameterTypes: KinaTypeTokenKind[] = [];

    while (!tokenStream.isAtEnd()) {
      const currentToken = tokenStream.peek();
      if (currentToken === null) break;
      if (currentToken.kind === TokenKind.ParentheseClose) break;

      const typeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);
      parameterTypes.push(typeToken.kind as KinaTypeTokenKind);

      const comma = tokenStream.match(TokenKind.Comma);
      if (comma === null) break;
    }

    return parameterTypes;
  }
}
