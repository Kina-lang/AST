import { LiteralStringToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { IncludeDirectiveNode } from "../nodes/IncludeDirective";
import { getStringLiteralValue } from "../../utils/literal";

export class IncludeDirectiveParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const nextChar = tokenStream.peek();
    if (nextChar === null) return false;
    if (nextChar.kind !== TokenKind.DirectiveInclude) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expect(TokenKind.DirectiveInclude); // Consume the @include token
    tokenStream.expect(TokenKind.ParentheseOpen);

    const identifierToken = tokenStream.expect(
      TokenKind.LiteralString,
    ) as LiteralStringToken;

    const end = tokenStream.expect(TokenKind.ParentheseClose);
    const semicolon = tokenStream.match(TokenKind.Semicolon); // Optional semicolon

    return [
      new IncludeDirectiveNode(
        {
          start: start.span!.start,
          end: (semicolon ?? end).span!.end,
        },
        getStringLiteralValue(identifierToken.value),
      ),
    ];
  }
}
