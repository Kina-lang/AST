import { LexerTokenType } from "@kina-lang/lexer";
import type {
  StructLiteralExpressionFieldTreeNode,
  StructLiteralExpressionTreeNode,
} from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { PrefixExpressionNodeParser } from "../ExpressionParser";
import { Parsers } from "../../Parser";
import { TreeNodes } from "../../../TreeNodes";

export class StructLiteralExpressionParser implements PrefixExpressionNodeParser<StructLiteralExpressionTreeNode> {
  parse(ctx: TreeContext): StructLiteralExpressionTreeNode | null {
    const startBrace = ctx.scanner.expect(LexerTokenType.LeftBrace);
    if (!startBrace) return null;

    const fieldNodes: StructLiteralExpressionFieldTreeNode[] = [];
    while (
      !ctx.scanner.isAtEnd &&
      !ctx.scanner.check(LexerTokenType.RightBrace)
    ) {
      const fieldNode = Parsers.StructLiteralExpressionField.parse(ctx);
      if (fieldNode) fieldNodes.push(fieldNode);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    const endBrace = ctx.scanner.expect(LexerTokenType.RightBrace);

    return TreeNodes.createStructLiteralExpressionNode(
      fieldNodes,
      TreeNodes.mergeSpans(startBrace?.span, endBrace?.span ?? null),
    );
  }
}
