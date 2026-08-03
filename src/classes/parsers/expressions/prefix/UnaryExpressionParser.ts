import { LexerTokenType } from "@kina-lang/lexer";
import type { UnaryExpressionTreeNode } from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import {
  ExpressionPrecedence,
  type InfixExpressionNodeParser,
} from "../ExpressionParser";
import { Parsers } from "../../Parser";
import { TreeNodes } from "../../../TreeNodes";

export const UnaryOperators = [
  LexerTokenType.Plus,
  LexerTokenType.Minus,
  LexerTokenType.Exclamation,
];

export class UnaryExpressionParser implements InfixExpressionNodeParser<UnaryExpressionTreeNode> {
  parse(ctx: TreeContext): UnaryExpressionTreeNode | null {
    const operatorToken = ctx.scanner.expect(...UnaryOperators);
    if (!operatorToken) return null;

    const rightExpression = Parsers.Expression.parseExpression(
      ctx,
      ExpressionPrecedence.Prefix,
    );

    return TreeNodes.createUnaryExpressionNode(
      operatorToken.type,
      rightExpression,
      TreeNodes.mergeSpans(operatorToken.span, rightExpression?.span ?? null),
    );
  }
}
