import { TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";
import { IfStatementNode } from "../nodes/IfStatement";
import type { BasicBlockNode } from "../nodes/BasicBlock";

export class IfStatementParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordIf) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expect(TokenKind.KeywordIf);

    tokenStream.expect(TokenKind.ParentheseOpen);
    const condition = Parsers.Expression.parse(tokenStream)[0]!;
    tokenStream.expect(TokenKind.ParentheseClose);

    const thenBlock =
      tokenStream.peek()?.kind == TokenKind.BraceOpen
        ? Parsers.BasicBlock.parse(tokenStream)[0]!
        : Parsers.BasicBlock.parseSingleStatement(tokenStream)[0]!;

    let elseBlock: BasicBlockNode | null = null;

    if (tokenStream.match(TokenKind.KeywordElse)) {
      elseBlock =
        tokenStream.peek()?.kind == TokenKind.BraceOpen
          ? Parsers.BasicBlock.parse(tokenStream)[0]!
          : Parsers.BasicBlock.parseSingleStatement(tokenStream)[0]!;
    }

    const end = elseBlock ? elseBlock.span!.end : thenBlock.span!.end;

    return [
      new IfStatementNode(
        { start: start.span!.start, end },
        condition,
        thenBlock,
        elseBlock,
      ),
    ];
  }
}
