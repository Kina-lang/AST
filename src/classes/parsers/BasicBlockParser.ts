import { LexerTokenType } from "@kina-lang/lexer";
import type { BasicBlockTreeNode, TreeNode } from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";

export class BasicBlockParser implements Parser<BasicBlockTreeNode> {
  parse(
    ctx: TreeContext,
    allowWithoutBraces: boolean = false,
  ): BasicBlockTreeNode | null {
    // If we allow without braces and there is not a brace, parse the next
    // statement as a single node basic block
    if (allowWithoutBraces && !ctx.scanner.check(LexerTokenType.LeftBrace)) {
      const node = this.parseNext(ctx);
      if (!node) return null;

      return TreeNodes.createBasicBlock(
        [node],
        TreeNodes.mergeSpans(node?.span ?? null),
      );
    }

    const start = ctx.scanner.expect(LexerTokenType.LeftBrace);

    const nodes: TreeNode[] = [];
    while (!ctx.scanner.isAtEnd) {
      const next = ctx.scanner.peek();
      if (next && next.type === LexerTokenType.RightBrace) break;

      const node = this.parseNext(ctx);
      if (node) nodes.push(node);
    }

    const end = ctx.scanner.expect(LexerTokenType.RightBrace);

    return TreeNodes.createBasicBlock(
      nodes,
      TreeNodes.mergeSpans(
        start?.span ?? null,
        ...nodes.map((n) => n?.span ?? null),
        end?.span ?? null,
      ),
    );
  }

  parseNext(ctx: TreeContext): TreeNode | null {
    const token = ctx.scanner.peek();
    if (!token) return null;

    switch (token.type) {
      case LexerTokenType.KeywordReturn:
        return Parsers.ReturnStatement.parse(ctx);
      case LexerTokenType.KeywordMutable:
      case LexerTokenType.KeywordValue:
        return Parsers.VariableDeclarationStatement.parse(ctx);
      case LexerTokenType.KeywordIf:
        return Parsers.IfStatement.parse(ctx);
      case LexerTokenType.Semicolon:
      case LexerTokenType.Comment:
      case LexerTokenType.MultilineComment:
        ctx.scanner.advance();
        return null;
      case LexerTokenType.EOF:
      default:
        // If nothing could parse the token, try to parse it as an expression statement
        const expressionStatementNode = Parsers.ExpressionStatement.parse(ctx);
        if (expressionStatementNode) return expressionStatementNode;

        // If nothing could parse the token, throw a diagnostic error
        // and consume the token to avoid an infinite loop
        ctx.scanner.advance();

        Diagnostics.error(
          DiagnosticsErrorCode.SyntaxError,
          `Unexpected token type '${token.type}' in basic block`,
          {
            file: ctx.compilerContext.relativeActiveFilePath ?? "<unknown>",
            span: [
              token.span.startPosition.line,
              token.span.startPosition.column,
              token.span.endPosition.line,
              token.span.endPosition.column,
            ],
          },
        );
        return null;
    }
  }
}
