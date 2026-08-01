import { LexerTokenType } from "@kina-lang/lexer";
import type { ImportMemberTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import type { Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class ImportMemberParser implements Parser<ImportMemberTreeNode> {
  parse(ctx: TreeContext): ImportMemberTreeNode | null {
    const nameToken = ctx.scanner.expect(LexerTokenType.Identifier);
    if (!nameToken) return null;

    // Return node without alias if no "as" keyword is found
    if (!ctx.scanner.match(LexerTokenType.KeywordAs))
      return TreeNodes.createImportMemberNode(
        TreeNodes.tokenToIdentifierNode(nameToken),
        null,
        TreeNodes.mergeSpans(nameToken?.span ?? null),
      );

    const aliasToken = ctx.scanner.expect(LexerTokenType.Identifier);

    return TreeNodes.createImportMemberNode(
      TreeNodes.tokenToIdentifierNode(nameToken),
      TreeNodes.tokenToIdentifierNode(aliasToken),
      TreeNodes.mergeSpans(nameToken?.span ?? null, aliasToken?.span ?? null),
    );
  }
}
