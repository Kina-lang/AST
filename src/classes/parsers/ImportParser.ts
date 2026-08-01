import { LexerTokenType } from "@kina-lang/lexer";
import type { ImportMemberTreeNode, ImportTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";
import { TreeLiteralType } from "../../types/type";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";

export class ImportParser implements Parser<ImportTreeNode> {
  parse(ctx: TreeContext): ImportTreeNode | null {
    const importKeyword = ctx.scanner.expect(LexerTokenType.KeywordImport);
    if (!importKeyword) return null;

    ctx.scanner.expect(LexerTokenType.LeftBrace);

    let memberNodes: ImportMemberTreeNode[] = [];
    while (!ctx.scanner.isAtEnd) {
      const currentToken = ctx.scanner.peek();
      if (!currentToken || currentToken.type === LexerTokenType.RightBrace)
        break;

      const memberNode = Parsers.ImportMember.parse(ctx);
      if (!memberNode) break;

      memberNodes.push(memberNode);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    ctx.scanner.expect(LexerTokenType.RightBrace);

    ctx.scanner.expect(LexerTokenType.KeywordFrom);
    const sourceNode = Parsers.LiteralExpression.parse(ctx);
    if (sourceNode && sourceNode.literalType !== TreeLiteralType.String)
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        `Expected a string literal for the import source, but got ${sourceNode.literalType}`,
      );

    return TreeNodes.createImportNode(
      memberNodes,
      sourceNode,
      TreeNodes.mergeSpans(
        importKeyword?.span ?? null,
        sourceNode?.span ?? null,
      ),
    );
  }
}
