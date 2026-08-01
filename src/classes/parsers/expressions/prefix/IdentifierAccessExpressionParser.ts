import { LexerTokenType } from "@kina-lang/lexer";
import type { IdentifierAccessExpressionTreeNode } from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { PrefixExpressionNodeParser } from "../ExpressionParser";
import { TreeNodes } from "../../../TreeNodes";

export class IdentifierAccessExpressionParser implements PrefixExpressionNodeParser<IdentifierAccessExpressionTreeNode> {
  parse(ctx: TreeContext): IdentifierAccessExpressionTreeNode | null {
    const identifierToken = ctx.scanner.expect(LexerTokenType.Identifier);
    if (!identifierToken) return null;

    return TreeNodes.createIdentifierAccessExpressionNode(
      TreeNodes.tokenToIdentifierNode(identifierToken),
      identifierToken.span,
    );
  }
}
