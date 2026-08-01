import { LexerTokenType } from "@kina-lang/lexer";
import type { GroupExpressionTreeNode } from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { PrefixExpressionNodeParser } from "../ExpressionParser";
import { Parsers } from "../../Parser";
import { TreeNodes } from "../../../TreeNodes";

export class GroupExpressionParser implements PrefixExpressionNodeParser<GroupExpressionTreeNode> {
  parse(ctx: TreeContext): GroupExpressionTreeNode | null {
    const openParenToken = ctx.scanner.expect(LexerTokenType.LeftParen)
    if (!openParenToken) return null;

    const expression = Parsers.Expression.parse(ctx);

    const closeParenToken = ctx.scanner.expect(LexerTokenType.RightParen);

    return TreeNodes.createGroupExpressionNode(
      expression,
      TreeNodes.mergeSpans(
        openParenToken?.span ?? null,
        expression?.span ?? null,
        closeParenToken?.span ?? null,
      )
    )
  }
}