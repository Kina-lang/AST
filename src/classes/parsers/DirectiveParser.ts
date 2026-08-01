import { LexerTokenType } from "@kina-lang/lexer";
import type { DirectiveTreeNode, ExpressionTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export const ValidDirectiveTokens = [LexerTokenType.DirectiveInclude];

export class DirectiveParser implements Parser<DirectiveTreeNode> {
  parse(ctx: TreeContext): DirectiveTreeNode | null {
    const directiveToken = ctx.scanner.expect(...ValidDirectiveTokens);
    if (!directiveToken) return null;

    ctx.scanner.expect(LexerTokenType.LeftParen);

    const args: ExpressionTreeNode[] = [];
    while (
      !ctx.scanner.isAtEnd &&
      !ctx.scanner.check(LexerTokenType.RightParen)
    ) {
      const arg = Parsers.Expression.parse(ctx);
      if (arg) args.push(arg);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    ctx.scanner.expect(LexerTokenType.RightParen);

    return TreeNodes.createDirectiveNode(
      TreeNodes.tokenToIdentifierNode(directiveToken),
      args,
      TreeNodes.mergeSpans(
        directiveToken?.span ?? null,
        ...args.map((a) => a?.span ?? null),
      ),
    );
  }
}
