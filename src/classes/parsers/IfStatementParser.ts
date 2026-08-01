import { LexerTokenType } from "@kina-lang/lexer";
import type { IfStatementTreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class IfStatementParser implements Parser<IfStatementTreeNode> {
  parse(ctx: TreeContext): IfStatementTreeNode | null {
    const ifKeyword = ctx.scanner.expect(LexerTokenType.KeywordIf);
    if (!ifKeyword) return null;

    ctx.scanner.expect(LexerTokenType.LeftParen);
    const conditionNode = Parsers.Expression.parse(ctx);
    ctx.scanner.expect(LexerTokenType.RightParen);

    const thenBlockNode = Parsers.BasicBlock.parse(ctx, true);

    let elseBlockNode = null;
    if (ctx.scanner.check(LexerTokenType.KeywordElse)) {
      ctx.scanner.advance();
      elseBlockNode = Parsers.BasicBlock.parse(ctx, true);
    }

    return TreeNodes.createIfStatementNode(
      conditionNode,
      thenBlockNode,
      elseBlockNode,
      TreeNodes.mergeSpans(
        ifKeyword?.span ?? null,
        conditionNode?.span ?? null,
        thenBlockNode?.span ?? null,
        elseBlockNode?.span ?? null,
      ),
    );
  }
}
