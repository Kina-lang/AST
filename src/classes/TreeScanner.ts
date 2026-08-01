import type { LexerToken, LexerTokenType } from "@kina-lang/lexer";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import type { TreeContext } from "./TreeContext";

export class TreeScanner {
  private readonly _tokens: LexerToken[];
  private readonly _context: TreeContext;
  private _currentIndex: number = 0;

  constructor(treeContext: TreeContext, tokens: LexerToken[]) {
    this._tokens = tokens;
    this._context = treeContext;
  }

  public get isAtEnd(): boolean {
    return this._currentIndex >= this._tokens.length;
  }

  public peek(offset: number = 0): LexerToken | null {
    if (this.isAtEnd) return null;

    return this._tokens[this._currentIndex + offset] ?? null;
  }

  public advance(): LexerToken | null {
    if (this.isAtEnd) return null;

    const token = this._tokens[this._currentIndex] ?? null;
    this._currentIndex++;

    return token;
  }

  public expect(...types: LexerTokenType[]): LexerToken | null {
    const nextToken = this.peek();
    if (!nextToken || !types.includes(nextToken.type)) {
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        `Expected token of type '${types.join("' or '")}' but found '${nextToken?.type ?? "end of input"}'`,
        {
          file:
            this._context.compilerContext.relativeActiveFilePath ?? "<unknown>",
          span: [
            nextToken?.span?.startPosition.line ?? 0,
            nextToken?.span?.startPosition.column ?? 0,
            nextToken?.span?.endPosition.line ?? 0,
            nextToken?.span?.endPosition.column ?? 0,
          ],
        },
      );

      return null;
    }

    this.advance();
    return nextToken;
  }

  public check(...types: LexerTokenType[]): boolean {
    const nextToken = this.peek();
    if (!nextToken) return false;

    if (types.includes(nextToken.type)) return true;

    return false;
  }

  public match(...types: LexerTokenType[]): LexerToken | null {
    const nextToken = this.peek();
    if (!nextToken) return null;

    if (types.includes(nextToken.type)) {
      this.advance();
      return nextToken;
    }

    return null;
  }
}
