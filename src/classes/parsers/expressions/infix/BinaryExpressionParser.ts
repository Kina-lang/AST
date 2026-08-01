import { LexerTokenType } from "@kina-lang/lexer";
import type {
  BinaryExpressionTreeNode,
  ExpressionTreeNode,
} from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { InfixExpressionNodeParser } from "../ExpressionParser";
import { Parsers } from "../../Parser";
import { TreeNodes } from "../../../TreeNodes";

export const BinaryOperators = [
  LexerTokenType.Plus,
  LexerTokenType.Minus,
  LexerTokenType.Asterisk,
  LexerTokenType.Slash,
  LexerTokenType.Percent,
  LexerTokenType.Equal,
  LexerTokenType.EqualEqual,
  LexerTokenType.ExclamationEqual,
  LexerTokenType.LessThan,
  LexerTokenType.LessThanEqual,
  LexerTokenType.GreaterThan,
  LexerTokenType.GreaterThanEqual,
  LexerTokenType.AmpAmp,
  LexerTokenType.PipePipe,
];

export class BinaryExpressionParser implements InfixExpressionNodeParser<BinaryExpressionTreeNode> {
  parse(
    ctx: TreeContext,
    left: ExpressionTreeNode | null,
  ): BinaryExpressionTreeNode | null {
    const operatorToken = ctx.scanner.expect(...BinaryOperators);
    if (!operatorToken) return null;

    const operatorPrecedence = Parsers.Expression.getPrecedence(operatorToken);

    const rightExpression = Parsers.Expression.parseExpression(
      ctx,
      operatorPrecedence,
    );

    return TreeNodes.createBinaryExpressionNode(
      left,
      operatorToken.type,
      rightExpression,
      TreeNodes.mergeSpans(left?.span ?? null, rightExpression?.span ?? null),
    );
  }
}
