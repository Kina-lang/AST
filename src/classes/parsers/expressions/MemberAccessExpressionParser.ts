import { KinaAssertionError } from "@kina-lang/utils";
import type { TokenStream } from "../../TokenStream";
import { BaseParser } from "../_base";
import type { BaseNode } from "../../nodes/_base";
import type { ExpressionBaseNode } from "../../nodes/_expression";
import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import { MemberAccessExpressionNode } from "../../nodes/MemberAccessExpression";
import { ExpressionBaseParser } from "./_base";

export class MemberAccessExpressionParser extends ExpressionBaseParser {
  constructor() {
    super();
  }

  public parseExpression(tokenStream: TokenStream, object: ExpressionBaseNode) {
    tokenStream.expect(TokenKind.Dot);

    const propertyToken = tokenStream.expect(
      TokenKind.Identifier,
    ) as IdentifierToken;

    return new MemberAccessExpressionNode(
      { start: object.span!.start, end: propertyToken.span!.end },
      object,
      propertyToken.value,
    );
  }
}
