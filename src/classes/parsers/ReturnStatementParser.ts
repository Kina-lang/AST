import { SemicolonToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { ExpressionBaseNode } from "../nodes/_expression";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";
import { KinaAssertionError } from "@kina-lang/utils";
import { ReturnStatementNode } from "../nodes/ReturnStatement";

export class ReturnStatementParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordReturn) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expect(TokenKind.KeywordReturn);

    const value = this.parseExpression(tokenStream);

    let semicolonToken: SemicolonToken | null = null;
    if (!value) {
      // If there is no value, there should be semicolon
      // TODO: Add support for newlines as statement terminators
      semicolonToken = tokenStream.expect(
        TokenKind.Semicolon,
      ) as SemicolonToken;
    }

    const endToken = tokenStream.match(TokenKind.Semicolon);

    return [
      new ReturnStatementNode(
        {
          start: start.span!.start,
          end: (endToken ?? semicolonToken ?? value ?? start).span!.end,
        },
        value,
      ),
    ];
  }

  private parseExpression(tokenStream: TokenStream): ExpressionBaseNode | null {
    if (tokenStream.isAtEnd()) return null;
    if (!Parsers.Expression.canParse(tokenStream)) return null;

    return Parsers.Expression.parse(tokenStream)[0] ?? null;
  }
}
