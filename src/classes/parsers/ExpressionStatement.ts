import { TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { ExpressionBaseNode } from "../nodes/_expression";
import { ExpressionStatementNode } from "../nodes/ExpressionStatement";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";

export class ExpressionStatementParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    return Parsers.Expression.canParse(tokenStream);
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const expression = Parsers.Expression.parse(tokenStream);

    const semicolonToken = tokenStream.match(TokenKind.Semicolon);

    return [new ExpressionStatementNode(expression[0]! as ExpressionBaseNode)];
  }
}
