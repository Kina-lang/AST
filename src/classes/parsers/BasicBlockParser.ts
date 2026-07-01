import { TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { BasicBlockNode } from "../nodes/BasicBlock";
import { Parsers } from "./_index";
import { KinaAST } from "../KinaAST";
import { KinaAssertionError } from "@kina-lang/utils";

export class BasicBlockParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.BraceOpen) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BasicBlockNode[] {
    const start = tokenStream.expect(TokenKind.BraceOpen);

    const nodes: BaseNode[] = [];

    while (!tokenStream.isAtEnd()) {
      const nextChar = tokenStream.peek();
      if (nextChar === null) break;
      if (nextChar.kind === TokenKind.BraceClose) break;

      const result = this.parseNext(tokenStream);
      if (result) nodes.push(...result);
    }

    const end = tokenStream.expect(TokenKind.BraceClose);
    const semicolon = tokenStream.match(TokenKind.Semicolon);

    return [
      new BasicBlockNode(
        { start: start.span!.start, end: (semicolon ?? end).span!.end },
        nodes,
      ),
    ];
  }

  private parseNext(tokenStream: TokenStream): BaseNode[] | null {
    if (tokenStream.isAtEnd()) return null;

    for (const parser of KinaAST.PARSERS) {
      if (parser.canParse(tokenStream)) return parser.parse(tokenStream);
    }

    throw new KinaAssertionError(
      "Failed to parse node: No parser could parse the next token",
    );
  }
}
