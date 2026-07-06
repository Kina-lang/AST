import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";
import { ExternNode } from "../nodes/Extern";
import type { TypeBaseNode } from "../nodes/_type";

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

    const returnTypeNode = Parsers.Type.parse(tokenStream)[0] as TypeBaseNode;

    const end = returnTypeNode;
    const semicolon = tokenStream.match(TokenKind.Semicolon);

    return [
      new ExternNode(
        { start: start.span!.start, end: (semicolon ?? end).span!.end },
        nameToken.value,
        parameterTypes,
        returnTypeNode,
      ),
    ];
  }

  private parseParameterTypes(tokenStream: TokenStream): TypeBaseNode[] {
    const nextToken = tokenStream.peek();
    if (nextToken === null) return [];
    if (nextToken.kind === TokenKind.ParentheseClose) return [];

    const parameterTypes: TypeBaseNode[] = [];

    while (!tokenStream.isAtEnd()) {
      const currentToken = tokenStream.peek();
      if (currentToken === null) break;
      if (currentToken.kind === TokenKind.ParentheseClose) break;

      const typeNode = Parsers.Type.parse(tokenStream)[0] as TypeBaseNode;
      parameterTypes.push(typeNode);

      const comma = tokenStream.match(TokenKind.Comma);
      if (comma === null) break;
    }

    return parameterTypes;
  }
}
