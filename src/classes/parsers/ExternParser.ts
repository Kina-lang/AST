import { LexerTokenType } from "@kina-lang/lexer";
import type { ExternTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class ExternParser implements Parser<ExternTreeNode> {
  parse(ctx: TreeContext): ExternTreeNode | null {
    const externToken = ctx.scanner.expect(LexerTokenType.KeywordExtern);
    if (!externToken) return null;

    const nameNode = ctx.scanner.expect(LexerTokenType.Identifier);

    ctx.scanner.expect(LexerTokenType.LeftParen);
    const argumentNodes = [];

    while (
      !ctx.scanner.isAtEnd &&
      !ctx.scanner.check(LexerTokenType.RightParen)
    ) {
      const typeAnnotationNode = Parsers.TypeAnnotation.parse(ctx);
      if (typeAnnotationNode) argumentNodes.push(typeAnnotationNode);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    ctx.scanner.expect(LexerTokenType.RightParen);

    ctx.scanner.expect(LexerTokenType.Colon);
    const typeAnnotationNode = Parsers.TypeAnnotation.parse(ctx);

    return TreeNodes.createExternNode(
      TreeNodes.tokenToIdentifierNode(nameNode),
      argumentNodes,
      typeAnnotationNode,
      TreeNodes.mergeSpans(
        externToken?.span ?? null,
        nameNode?.span ?? null,
        ...argumentNodes.map((a) => a?.span ?? null),
        typeAnnotationNode?.span ?? null,
      ),
    );
  }
}
