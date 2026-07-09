import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { ExpressionBaseNode } from "../../nodes/_expression";
import type { TokenStream } from "../../TokenStream";
import { StructLiteralExpressionNode } from "../../nodes/StructLiteralExpression";
import { StructLiteralFieldNode } from "../../nodes/StructLiteralField";
import { Parsers } from "../_index";

export class StructLiteralExpressionParser {
  constructor() {}

  public canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.BraceOpen) return false;

    // Look ahead - { Identifier : ... is a struct literal
    // { without Identifier: is a basic block, or empty struct literal {}
    const secondToken = tokenStream.peekAhead(1);
    if (secondToken === null) return false;

    // Empty struct literal
    if (secondToken.kind === TokenKind.BraceClose) return true;

    // Check for { identifier : pattern
    if (secondToken.kind !== TokenKind.Identifier) return false;
    const thirdToken = tokenStream.peekAhead(2);

    if (thirdToken === null) return false;
    return thirdToken.kind === TokenKind.Colon;
  }

  public parseExpression(tokenStream: TokenStream): ExpressionBaseNode {
    const start = tokenStream.expect(TokenKind.BraceOpen);

    const fields: StructLiteralFieldNode[] = [];

    while (!tokenStream.isAtEnd()) {
      // Check for closing brace (handles empty struct literal and trailing comma)
      const closingBrace = tokenStream.peek();
      if (closingBrace !== null && closingBrace.kind === TokenKind.BraceClose)
        break;

      // Parse field: identifier : expression
      const identifierToken = tokenStream.expect(
        TokenKind.Identifier,
      ) as IdentifierToken;
      tokenStream.expect(TokenKind.Colon);

      const value = Parsers.Expression.parseExpression(tokenStream);

      fields.push(
        new StructLiteralFieldNode(
          { start: identifierToken.span!.start, end: value.span!.end },
          identifierToken.value,
          value,
        ),
      );

      // Try to match comma separator
      const comma = tokenStream.match(TokenKind.Comma);
      if (comma === null) break;
    }

    const end = tokenStream.expect(TokenKind.BraceClose);

    return new StructLiteralExpressionNode(
      { start: start.span!.start, end: end.span!.end },
      fields,
    );
  }
}
