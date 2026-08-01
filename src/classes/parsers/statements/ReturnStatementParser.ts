import { LexerTokenType } from "@kina-lang/lexer";
import type { TreeContext } from "../../TreeContext";
import { Parsers, type Parser } from "../Parser";
import { TreeNodes } from "../../TreeNodes";
import type {
  ReturnStatementTreeNode,
  ExpressionTreeNode,
} from "../../../types/tree";

export class ReturnStatementParser implements Parser<ReturnStatementTreeNode> {
  parse(ctx: TreeContext): ReturnStatementTreeNode | null {
    const retToken = ctx.scanner.expect(LexerTokenType.KeywordReturn);

    let expressionNode: ExpressionTreeNode | null = null;
    if (!ctx.scanner.check(LexerTokenType.Semicolon))
      expressionNode = Parsers.Expression.parse(ctx);

    ctx.scanner.match(LexerTokenType.Semicolon);

    return TreeNodes.createReturnStatementNode(
      expressionNode,
      TreeNodes.mergeSpans(
        retToken?.span ?? null,
        expressionNode?.span ?? null,
      ),
    );
  }
}
