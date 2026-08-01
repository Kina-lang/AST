import { LexerTokenType } from "@kina-lang/lexer";
import type { StructFieldTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class StructFieldParser implements Parser<StructFieldTreeNode> {
  parse(ctx: TreeContext): StructFieldTreeNode | null {
    const nameNode = ctx.scanner.expect(LexerTokenType.Identifier);
    if (!nameNode) return null;

    ctx.scanner.expect(LexerTokenType.Colon);
    const typeAnnotationNode = Parsers.TypeAnnotation.parse(ctx);

    return TreeNodes.createStructFieldNode(
      TreeNodes.tokenToIdentifierNode(nameNode),
      typeAnnotationNode,
      TreeNodes.mergeSpans(
        nameNode?.span ?? null,
        typeAnnotationNode?.span ?? null,
      ),
    );
  }
}
