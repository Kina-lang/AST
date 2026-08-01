import { LexerTokenType } from "@kina-lang/lexer";
import type { StructTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class StructParser implements Parser<StructTreeNode> {
  parse(ctx: TreeContext): StructTreeNode | null {
    const structToken = ctx.scanner.expect(LexerTokenType.KeywordStruct);
    if (!structToken) return null;

    const modifiers = ctx.consumeModifiers();

    const nameNode = ctx.scanner.expect(LexerTokenType.Identifier);

    ctx.scanner.expect(LexerTokenType.LeftBrace);

    const fieldNodes = [];
    while (
      !ctx.scanner.isAtEnd &&
      !ctx.scanner.check(LexerTokenType.RightBrace)
    ) {
      const fieldNode = Parsers.StructField.parse(ctx);
      if (fieldNode) fieldNodes.push(fieldNode);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    ctx.scanner.expect(LexerTokenType.RightBrace);

    return TreeNodes.createStructNode(
      TreeNodes.tokenToIdentifierNode(nameNode),
      fieldNodes,
      modifiers,
      TreeNodes.mergeSpans(
        structToken?.span ?? null,
        nameNode?.span ?? null,
        ...fieldNodes.map((f) => f.span ?? null),
      ),
    );
  }
}
