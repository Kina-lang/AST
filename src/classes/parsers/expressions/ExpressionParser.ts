import { LexerTokenType, type LexerToken } from "@kina-lang/lexer";
import type { ExpressionTreeNode } from "../../../types/tree";
import type { TreeContext } from "../../TreeContext";
import { Parsers, type Parser } from "../Parser";
import { BinaryOperators } from "./infix/BinaryExpressionParser";
import { LiteralTokenTypes } from "./prefix/LiteralExpressionParser";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import { UnaryOperators } from "./prefix/UnaryExpressionParser";

// Higher means greater priority
export const ExpressionPrecedence = {
  Lowest: 0,
  Assignment: 5, // =
  LogicalOr: 6, // ||
  LogicalAnd: 7, // &&
  Equality: 8, // == !=
  Comparison: 9, // < <= > >=
  Sum: 10, // + -
  Product: 20, // * /
  Prefix: 25, // unary + -
  Call: 30, // myFunction()
  MemberAccess: 40, // object.property
};

export class ExpressionParser implements Parser<ExpressionTreeNode> {
  parse(ctx: TreeContext): ExpressionTreeNode | null {
    return this.parseExpression(ctx, ExpressionPrecedence.Lowest);
  }

  parseExpression(
    ctx: TreeContext,
    precedence: number,
  ): ExpressionTreeNode | null {
    // Get left side of the expression
    let leftExpression = this.parsePrefix(ctx);
    // TODO: Throw diagnostic error
    if (!leftExpression) return null;

    // Until we reach semicolon or the next token precedence is greater
    while (
      ctx.scanner.peek() &&
      ctx.scanner.peek()!.type !== LexerTokenType.Semicolon &&
      precedence < this.getPrecedence(ctx.scanner.peek())
    ) {
      // Check if the next token is an infix operator
      if (!this.hasInfix(ctx.scanner.peek()!)) return leftExpression;

      leftExpression = this.parseInfix(ctx, leftExpression);
    }

    return leftExpression;
  }

  private parsePrefix(ctx: TreeContext): ExpressionTreeNode | null {
    const token = ctx.scanner.peek();
    if (!token) return null;

    if (LiteralTokenTypes.includes(token.type))
      return Parsers.LiteralExpression.parse(ctx);

    if (UnaryOperators.includes(token.type))
      return Parsers.UnaryExpression.parse(ctx);

    switch (token.type) {
      case LexerTokenType.LeftParen:
        return Parsers.GroupExpression.parse(ctx);
      case LexerTokenType.Identifier:
        return Parsers.IdentifierAccessExpression.parse(ctx);
      case LexerTokenType.LeftBrace:
        return Parsers.StructLiteralExpression.parse(ctx);
      default:
        return null;
    }
  }

  private parseInfix(
    ctx: TreeContext,
    left: ExpressionTreeNode | null,
  ): ExpressionTreeNode | null {
    const token = ctx.scanner.peek();
    if (!token) return null;

    if (BinaryOperators.includes(token.type))
      return Parsers.BinaryExpression.parse(ctx, left);

    switch (token.type) {
      case LexerTokenType.Dot:
        return Parsers.MemberAccessExpression.parse(ctx, left);
      case LexerTokenType.LeftParen:
        return Parsers.CallExpression.parse(ctx, left);
      default:
        Diagnostics.error(
          DiagnosticsErrorCode.SyntaxError,
          `Unexpected token type '${token.type}' in expression`,
          {
            file: ctx.compilerContext.relativeActiveFilePath ?? "<unknown>",
            span: [
              token?.span?.startPosition.line ?? 0,
              token?.span?.startPosition.column ?? 0,
              token?.span?.endPosition.line ?? 0,
              token?.span?.endPosition.column ?? 0,
            ],
          },
        );
        ctx.scanner.advance();

        return null;
    }
  }

  public getPrecedence(token: LexerToken | null): number {
    if (!token) return ExpressionPrecedence.Lowest;

    switch (token.type) {
      case LexerTokenType.Equal:
        return ExpressionPrecedence.Assignment;
      case LexerTokenType.PipePipe:
        return ExpressionPrecedence.LogicalOr;
      case LexerTokenType.AmpAmp:
        return ExpressionPrecedence.LogicalAnd;
      case LexerTokenType.EqualEqual:
      case LexerTokenType.ExclamationEqual:
        return ExpressionPrecedence.Equality;
      case LexerTokenType.LessThan:
      case LexerTokenType.LessThanEqual:
      case LexerTokenType.GreaterThan:
      case LexerTokenType.GreaterThanEqual:
        return ExpressionPrecedence.Comparison;
      case LexerTokenType.Plus:
      case LexerTokenType.Minus:
        return ExpressionPrecedence.Sum;
      case LexerTokenType.Asterisk:
      case LexerTokenType.Slash:
      case LexerTokenType.Percent:
        return ExpressionPrecedence.Product;
      case LexerTokenType.LeftParen:
        return ExpressionPrecedence.Call;
      case LexerTokenType.Dot:
        return ExpressionPrecedence.MemberAccess;
      default:
        return ExpressionPrecedence.Lowest;
    }
  }

  private hasInfix(token: LexerToken | null): boolean {
    // If precendence is not lowest, then it is an infix operator
    return this.getPrecedence(token) > ExpressionPrecedence.Lowest;
  }
}

export interface InfixExpressionNodeParser<T> {
  parse(ctx: TreeContext, left: ExpressionTreeNode | null): T | null;
}

export interface PrefixExpressionNodeParser<T> {
  parse(ctx: TreeContext): T | null;
}
