import { LexerTokenType } from "@kina-lang/lexer";
import type { VariableDeclarationStatementTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class VariableDeclarationStatementParser implements Parser<VariableDeclarationStatementTreeNode> {
  parse(ctx: TreeContext): VariableDeclarationStatementTreeNode | null {
    const keyword = ctx.scanner.expect(
      LexerTokenType.KeywordMutable,
      LexerTokenType.KeywordValue,
    );
    if (!keyword) return null;

    const modifiers = ctx.consumeModifiers();

    const nameToken = ctx.scanner.expect(LexerTokenType.Identifier);

    ctx.scanner.expect(LexerTokenType.Colon);
    const typeAnnotationNode = Parsers.TypeAnnotation.parse(ctx);

    ctx.scanner.expect(LexerTokenType.Equal);

    const initializerNode = Parsers.Expression.parse(ctx);

    ctx.scanner.match(LexerTokenType.Semicolon);

    return TreeNodes.createVariableDeclarationStatementNode(
      TreeNodes.tokenToIdentifierNode(nameToken),
      typeAnnotationNode,
      initializerNode,
      keyword.type === LexerTokenType.KeywordValue,
      modifiers,
      TreeNodes.mergeSpans(
        keyword?.span ?? null,
        nameToken?.span ?? null,
        typeAnnotationNode?.span ?? null,
        initializerNode?.span ?? null,
      ),
    );
  }
}
