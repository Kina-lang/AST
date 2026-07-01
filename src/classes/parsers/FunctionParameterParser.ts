import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { FunctionParameterNode } from "../nodes/FunctionParameter";
import { KINA_TYPE_TOKENS } from "../../utils/type";
import type { KinaTypeTokenKind } from "../../types/types";

export class FunctionParameterParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.Identifier) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): FunctionParameterNode[] {
    const identifierToken = tokenStream.expect(
      TokenKind.Identifier,
    ) as IdentifierToken;

    tokenStream.expect(TokenKind.Colon);

    const typeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);

    return [
      new FunctionParameterNode(
        { start: identifierToken.span!.start, end: typeToken.span!.end },
        identifierToken.value,
        typeToken.kind as KinaTypeTokenKind,
      ),
    ];
  }
}
