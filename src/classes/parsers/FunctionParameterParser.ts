import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { FunctionParameterNode } from "../nodes/FunctionParameter";
import { Parsers } from "./_index";
import type { TypeBaseNode } from "../nodes/_type";

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

    const typeNode = Parsers.Type.parse(tokenStream)[0] as TypeBaseNode;

    return [
      new FunctionParameterNode(
        { start: identifierToken.span!.start, end: typeNode.span!.end },
        identifierToken.value,
        typeNode,
      ),
    ];
  }
}
