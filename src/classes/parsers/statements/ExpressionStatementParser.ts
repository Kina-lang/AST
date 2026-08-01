import { LexerTokenType } from "@kina-lang/lexer";
import type { ExpressionStatementTreeNode } from "../../../types/tree";
import type { TreeContext } from "../../TreeContext";
import { Parsers, type Parser } from "../Parser";
import { TreeNodes } from "../../TreeNodes";

export class ExpressionStatementParser implements Parser<ExpressionStatementTreeNode> {
  parse(ctx: TreeContext): ExpressionStatementTreeNode | null {
    const expressionNode = Parsers.Expression.parse(ctx);
    if (!expressionNode) return null;

    ctx.scanner.match(LexerTokenType.Semicolon);

    return TreeNodes.createExpressionStatementNode(
      expressionNode,
      TreeNodes.mergeSpans(expressionNode?.span ?? null),
    );
  }
}
