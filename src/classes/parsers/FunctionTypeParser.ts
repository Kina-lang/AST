import { TokenKind } from "@kina-lang/lexer";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { FunctionTypeNode } from "../nodes/FunctionTypeNode";
import { Parsers } from "./_index";
import type { TypeBaseNode } from "../nodes/_type";
import { KINA_TYPE_TOKENS } from "../../utils/type";

function getTypeLength(tokenStream: TokenStream, startOffset: number): number {
  const currentToken = tokenStream.peekAhead(startOffset);
  if (currentToken === null) return -1;

  if (KINA_TYPE_TOKENS.has(currentToken.kind)) return 1;

  if (currentToken.kind === TokenKind.ParentheseOpen) {
    let offset = startOffset + 1; // skip '('

    while (true) {
      const nextToken = tokenStream.peekAhead(offset);
      if (nextToken === null) return -1;

      if (nextToken.kind === TokenKind.ParentheseClose) {
        offset++; // skip ')'
        break;
      }

      const paramLength = getTypeLength(tokenStream, offset);
      if (paramLength === -1) return -1;
      offset += paramLength;

      const separatorToken = tokenStream.peekAhead(offset);
      if (separatorToken === null) return -1;
      if (separatorToken.kind === TokenKind.ParentheseClose) {
        offset++; // skip ')'
        break;
      }

      if (separatorToken.kind === TokenKind.Comma)
        offset++; // skip ','
      else return -1;
    }

    const arrowToken = tokenStream.peekAhead(offset);
    if (arrowToken === null || arrowToken.kind !== TokenKind.OperatorArrow)
      return -1;

    offset++; // skip '->'

    const returnTypeLength = getTypeLength(tokenStream, offset);
    if (returnTypeLength === -1) return -1;

    offset += returnTypeLength;

    return offset - startOffset;
  }

  return -1;
}

export class FunctionTypeParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream, offs: number = 0): boolean {
    const currentToken = tokenStream.peekAhead(offs);
    if (currentToken === null || currentToken.kind !== TokenKind.ParentheseOpen)
      return false;

    const length = getTypeLength(tokenStream, offs);
    return length !== -1;
  }

  override parse(tokenStream: TokenStream): FunctionTypeNode[] {
    const start = tokenStream.expect(TokenKind.ParentheseOpen);

    const parameters = this.parseParameters(tokenStream);

    tokenStream.expect(TokenKind.ParentheseClose);
    tokenStream.expect(TokenKind.OperatorArrow);

    const returnType = Parsers.Type.parse(tokenStream)[0] as TypeBaseNode;

    return [
      new FunctionTypeNode(
        { start: start.span!.start, end: returnType.span!.end },
        parameters,
        returnType,
      ),
    ];
  }

  private parseParameters(tokenStream: TokenStream): TypeBaseNode[] {
    const parameters: TypeBaseNode[] = [];

    while (!tokenStream.isAtEnd()) {
      if (!Parsers.Type.canParse(tokenStream)) break;

      const typeNodes = Parsers.Type.parse(tokenStream);
      parameters.push(...typeNodes);

      const comma = tokenStream.match(TokenKind.Comma);
      if (comma === null) break;
    }

    return parameters;
  }
}
