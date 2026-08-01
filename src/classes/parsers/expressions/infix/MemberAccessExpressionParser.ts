import { LexerTokenType } from "@kina-lang/lexer";
import type {
  ExpressionTreeNode,
  MemberAccessExpressionTreeNode,
} from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { InfixExpressionNodeParser } from "../ExpressionParser";
import { TreeNodes } from "../../../TreeNodes";

export class MemberAccessExpressionParser implements InfixExpressionNodeParser<MemberAccessExpressionTreeNode> {
  parse(
    ctx: TreeContext,
    left: ExpressionTreeNode | null,
  ): MemberAccessExpressionTreeNode | null {
    const dotToken = ctx.scanner.expect(LexerTokenType.Dot);
    if (!dotToken) return null;

    const propertyToken = ctx.scanner.expect(LexerTokenType.Identifier);
    if (!propertyToken) return null;

    const propertyNode = TreeNodes.tokenToIdentifierNode(propertyToken);

    return TreeNodes.createMemberAccessExpressionNode(
      left,
      propertyNode,
      TreeNodes.mergeSpans(left?.span ?? null, propertyNode?.span ?? null),
    );
  }
}
