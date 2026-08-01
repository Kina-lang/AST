import { LexerTokenType } from "@kina-lang/lexer";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";
import type { StructLiteralExpressionFieldTreeNode } from "../../types/tree";

export class StructLiteralExpressionFieldParser implements Parser<StructLiteralExpressionFieldTreeNode> {
  parse(ctx: TreeContext): StructLiteralExpressionFieldTreeNode | null {
    const identifierToken = ctx.scanner.expect(LexerTokenType.Identifier);
    if (!identifierToken) return null;

    ctx.scanner.expect(LexerTokenType.Colon);

    const expressionNode = Parsers.Expression.parse(ctx);
    if (!expressionNode) return null;

    return TreeNodes.createStructLiteralExpressionFieldNode(
      TreeNodes.tokenToIdentifierNode(identifierToken),
      expressionNode,
      TreeNodes.mergeSpans(
        identifierToken?.span ?? null,
        expressionNode?.span ?? null,
      ),
    );
  }
}
