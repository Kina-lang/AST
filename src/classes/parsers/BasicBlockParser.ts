import { TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { BasicBlockNode } from "../nodes/BasicBlock";
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

  public parseSingleStatement(tokenStream: TokenStream): BasicBlockNode[] {
    const nodes: BaseNode[] = [];

    while (!tokenStream.isAtEnd()) {
      const nextChar = tokenStream.peek();
      if (nextChar === null) break;
      if (nextChar.kind === TokenKind.Semicolon) {
        tokenStream.advance();
        break;
      }

      const result = this.parseNext(tokenStream);
      if (result) nodes.push(...result);
      break; // Only parse a single statement
    }

    return [
      new BasicBlockNode(
        {
          start: nodes[0]!.span!.start ?? tokenStream.peek()!.span!.start ?? 0,
          end:
            nodes[nodes.length - 1]!.span!.end ??
            tokenStream.peek()!.span!.end ??
            0,
        },
        nodes,
      ),
    ];
  }

  private parseNext(tokenStream: TokenStream): BaseNode[] | null {
    if (tokenStream.isAtEnd()) return null;

    for (const parser of KinaAST.PARSERS) {
      if (parser.canParse(tokenStream)) return parser.parse(tokenStream);
    }

    const nextToken = tokenStream.peek();
    throw new KinaAssertionError(
      `Failed to parse node: No parser could parse the next token (kind: ${nextToken?.kind}, value: ${nextToken?.reconstruct()})`,
    );
  }
}
