import { TokenKind, type BaseToken } from "@kina-lang/lexer";

export class TokenStream {
  private readonly _tokens: BaseToken[] = [];
  private _cursorPosition: number = 0;

  constructor(tokens: BaseToken[]) {
    this._tokens = tokens;
  }

  /**
   * Looks at the current cursor position, but does not move it
   * @returns token at current cursor position
   */
  public peek(): BaseToken | null {
    const token = this._tokens[this._cursorPosition];
    if (!token) return null;

    return token;
  }

  /**
   * Checks if the cursor is at the end (no token / EOF)
   * @returns boolean
   */
  public isAtEnd(): boolean {
    const currentToken = this.peek();
    if (!currentToken) return true;
    if (currentToken.kind == TokenKind.EOF) return true;

    return false;
  }

  /**
   * Returns the current token and moves the cursor unconditionaly
   * @returns null when at the end, token otherwise
   */
  public advance(): BaseToken | null {
    if (this.isAtEnd()) return null;

    const token = this.peek()!;
    this._cursorPosition++;

    return token;
  }

  /**
   * Compares given kind with the current tokens kind. It returns it and moves the cursor when matching, null in other cases
   * @param kind Wanted kind
   * @returns token or null
   */
  public match(kind: TokenKind): BaseToken | null {
    const token = this.peek();
    if (!token) return null;
    if (token.kind != kind) return null;

    this._cursorPosition++;

    return token;
  }

  /**
   * Compares given kinds with the current tokens kind. It returns it and moves the cursor when matching, null in other cases
   * @param kinds Wanted kinds
   * @returns token or null
   */
  public matchAny(kinds: TokenKind[]): BaseToken | null {
    const token = this.peek();
    if (!token) return null;
    if (!kinds.includes(token.kind)) return null;

    this._cursorPosition++;

    return token;
  }

  /**
   * Compares given kind with the current tokens kind. It returns it and moves the cursor when matching, throws in other cases
   * @param kind Wanted kind
   * @returns token
   * @throws when kind does not match
   */
  public expect(kind: TokenKind): BaseToken {
    const result = this.match(kind);
    if (!result) {
      const actualToken = this.peek();
      const actualKind = actualToken ? actualToken.kind : TokenKind.EOF;

      throw new Error(
        "Syntax Error -> Expected " + kind + ", but got " + actualKind,
      );
    }

    return result;
  }

  public expectAny(kinds: TokenKind[]): BaseToken {
    const result = this.matchAny(kinds);
    if (!result) {
      const actualToken = this.peek();
      const actualKind = actualToken ? actualToken.kind : TokenKind.EOF;

      throw new Error(
        "Syntax Error -> Expected one of " +
          kinds.join(", ") +
          ", but got " +
          actualKind,
      );
    }

    return result;
  }
}
