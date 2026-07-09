import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import type { BaseNode } from "../nodes/_base";
import { StructNode } from "../nodes/Struct";
import type { StructFieldNode } from "../nodes/StructField";
import { Parsers } from "./_index";

export class StructParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordStruct) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expect(TokenKind.KeywordStruct);
    const identifierToken = tokenStream.expect(
      TokenKind.Identifier,
    ) as IdentifierToken;

    tokenStream.expect(TokenKind.BraceOpen);

    const fields = this.parseFields(tokenStream);

    const brace = tokenStream.expect(TokenKind.BraceClose);
    const end = tokenStream.match(TokenKind.Semicolon);

    return [
      new StructNode(
        { start: start.span!.start, end: end?.span!.end || brace.span!.end },
        identifierToken.value,
        fields,
      ),
    ];
  }

  private parseFields(tokenStream: TokenStream): StructFieldNode[] {
    const fields: StructFieldNode[] = [];

    while (!tokenStream.isAtEnd()) {
      if (!Parsers.StructField.canParse(tokenStream)) break;

      const fieldNodes = Parsers.StructField.parse(tokenStream);
      fields.push(...fieldNodes);

      const comma = tokenStream.match(TokenKind.Comma);
      if (comma === null) break;
    }

    return fields;
  }
}
