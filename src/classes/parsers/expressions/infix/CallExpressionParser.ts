import { LexerTokenType } from "@kina-lang/lexer";
import type {
  CallExpressionTreeNode,
  ExpressionTreeNode,
} from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { InfixExpressionNodeParser } from "../ExpressionParser";
import { TreeNodes } from "../../../TreeNodes";
import { Parsers } from "../../Parser";

export class CallExpressionParser implements InfixExpressionNodeParser<CallExpressionTreeNode> {
  parse(
    ctx: TreeContext,
    left: ExpressionTreeNode | null,
  ): CallExpressionTreeNode | null {
    const openParenToken = ctx.scanner.expect(LexerTokenType.LeftParen);
    if (!openParenToken) return null;

    const argumentNodes: ExpressionTreeNode[] = [];
    while (!ctx.scanner.check(LexerTokenType.RightParen)) {
      const argumentNode = Parsers.Expression.parse(ctx);
      if (!argumentNode) continue;

      argumentNodes.push(argumentNode);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    const closeParenToken = ctx.scanner.expect(LexerTokenType.RightParen);

    return TreeNodes.createCallExpressionNode(
      left,
      argumentNodes,
      TreeNodes.mergeSpans(
        left?.span ?? null,
        openParenToken?.span ?? null,
        closeParenToken?.span ?? null,
      ),
    );
  }
}
