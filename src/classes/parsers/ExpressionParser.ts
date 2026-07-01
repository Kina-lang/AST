import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import { KinaAssertionError } from "@kina-lang/utils";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";
import { KINA_LITERAL_TOKENS } from "../../utils/literal";
import {
  KINA_EXPRESSION_PRECEDENCE,
  KINA_INFIX_OPERATORS,
  KINA_INFIX_PRECEDENCE,
} from "../../utils/expression";
import type { ExpressionBaseNode } from "../nodes/_expression";
import { GroupExpressionNode } from "../nodes/GroupExpression";
import { IdentifierExpressionNode } from "../nodes/IdentifierExpression";
import type { BaseNode } from "../nodes/_base";

export class ExpressionParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    return this.canParsePrefix(tokenStream);
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const expression = this.parseExpression(tokenStream);

    return [expression];
  }

  /**
   * Checks if the current token can start a prefix expression
   * @param tokenStream
   */
  private canParsePrefix(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;

    if (KINA_LITERAL_TOKENS.has(currentToken.kind)) return true;
    if (currentToken.kind === TokenKind.Identifier) return true;
    if (currentToken.kind === TokenKind.ParentheseOpen) return true;

    return false;
  }

  /**
   * The main Pratt parsing loop. It parses a prefix expression, then repeatedly checks for infix operators and parses them.
   * This allows for correct operator precedence.
   * @param tokenStream
   * @param precedence
   * @returns
   */
  public parseExpression(
    tokenStream: TokenStream,
    precedence: number = KINA_EXPRESSION_PRECEDENCE.LOWEST,
  ): ExpressionBaseNode {
    let left = this.parsePrefix(tokenStream);

    while (precedence < this.getInfixPrecedence(tokenStream)) {
      left = this.parseInfix(tokenStream, left);
    }

    return left;
  }

  private parsePrefix(tokenStream: TokenStream): ExpressionBaseNode {
    if (tokenStream.isAtEnd())
      throw new KinaAssertionError(
        "Failed to parse expression: Unexpected end of input",
      );

    const currentToken = tokenStream.peek()!;

    // Literal expressions (integers, floats, strings, booleans)
    if (Parsers.LiteralExpression.canParse(tokenStream))
      return Parsers.LiteralExpression.parseExpression(tokenStream);

    // Identifier expressions (variable references)
    if (currentToken.kind === TokenKind.Identifier) {
      const identifierToken = tokenStream.expect(
        TokenKind.Identifier,
      ) as IdentifierToken;

      return new IdentifierExpressionNode(
        { start: identifierToken.span!.start, end: identifierToken.span!.end },
        identifierToken.value,
      );
    }

    // Grouped expressions
    if (currentToken.kind === TokenKind.ParentheseOpen) {
      const start = tokenStream.expect(TokenKind.ParentheseOpen);

      const expression = this.parseExpression(
        tokenStream,
        KINA_EXPRESSION_PRECEDENCE.LOWEST,
      );

      const end = tokenStream.expect(TokenKind.ParentheseClose);

      return new GroupExpressionNode(
        { start: start.span!.start, end: end.span!.end },
        expression,
      );
    }

    throw new KinaAssertionError(
      "Failed to parse expression: No parser could parse the next token",
    );
  }

  private parseInfix(
    tokenStream: TokenStream,
    left: ExpressionBaseNode,
  ): ExpressionBaseNode {
    if (tokenStream.isAtEnd())
      throw new KinaAssertionError(
        "Failed to parse expression: Unexpected end of input",
      );

    const token = tokenStream.peek()!;

    if (token.kind === TokenKind.Dot)
      return Parsers.MemberAccessExpression.parseExpression(tokenStream, left);

    if (token.kind === TokenKind.ParentheseOpen)
      return Parsers.CallExpression.parseExpression(tokenStream, left);

    const operatorString = KINA_INFIX_OPERATORS.get(token.kind);
    if (operatorString !== undefined)
      return Parsers.BinaryExpression.parseExpression(
        tokenStream,
        left,
        operatorString,
      );

    throw new KinaAssertionError(
      `Failed to parse expression: Unexpected infix token ${token.kind}`,
    );
  }

  private getInfixPrecedence(tokenStream: TokenStream): number {
    const token = tokenStream.peek();
    if (token === null) return KINA_EXPRESSION_PRECEDENCE.LOWEST;

    // Member access
    if (token.kind === TokenKind.Dot)
      return KINA_EXPRESSION_PRECEDENCE.MEMBER_ACCESS;

    // Function call
    if (token.kind === TokenKind.ParentheseOpen)
      return KINA_EXPRESSION_PRECEDENCE.CALL;

    const precedence = KINA_INFIX_PRECEDENCE.get(token.kind);
    if (precedence !== undefined) return precedence;

    return KINA_EXPRESSION_PRECEDENCE.LOWEST;
  }
}
