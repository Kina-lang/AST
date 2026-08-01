import { LexerTokenType } from "@kina-lang/lexer";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";
import type { ExtendTreeNode } from "../../types/tree";
import { TokensValidAsNamedTypeAnnotations } from "../config/types";

export class ExtendParser implements Parser<ExtendTreeNode> {
  parse(ctx: TreeContext): ExtendTreeNode | null {
    const extendToken = ctx.scanner.expect(LexerTokenType.KeywordExtend);
    if (!extendToken) return null;

    // Allow for types, as they can also be extended
    const nameNode = ctx.scanner.expect(
      LexerTokenType.Identifier,
      ...TokensValidAsNamedTypeAnnotations,
    );
    const structExpressionNode = Parsers.StructLiteralExpression.parse(ctx);

    return TreeNodes.createExtendNode(
      TreeNodes.tokenToIdentifierNode(nameNode),
      structExpressionNode,
      TreeNodes.mergeSpans(
        extendToken?.span ?? null,
        nameNode?.span ?? null,
        structExpressionNode?.span ?? null,
      ),
    );
  }
}
