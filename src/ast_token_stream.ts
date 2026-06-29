import {
  EKinaLexerTokenKind,
  type IKinaLexerTokenDefinition,
} from "@kina-lang/lexer";

export class KinaASTTokenStream {
  private readonly tokens: IKinaLexerTokenDefinition[] = [];
  private cursorPosition: number = 0;
  private readonly fileName: string;

  constructor(tokens: IKinaLexerTokenDefinition[], fileName?: string) {
    this.tokens = tokens;
    this.fileName = fileName ?? "anonymous";
  }

  /**
   * Looks at the current cursor position, but does not move it
   * @returns token at current cursor position
   */
  public peek(): IKinaLexerTokenDefinition | null {
    const token = this.tokens[this.cursorPosition];
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
    if (currentToken.kind == EKinaLexerTokenKind.EOF) return true;

    return false;
  }

  /**
   * Returns the current token and moves the cursor unconditionaly
   * @returns null when at the end, token otherwise
   */
  public advance(): IKinaLexerTokenDefinition | null {
    if (this.isAtEnd()) return null;

    const token = this.peek()!;
    this.cursorPosition++;

    return token;
  }

  /**
   * Compares given kind with the current tokens kind. It returns it and moves the cursor when matching, null in other cases
   * @param kind Wanted kind
   * @returns token or null
   */
  public match(kind: EKinaLexerTokenKind): IKinaLexerTokenDefinition | null {
    const token = this.peek();
    if (!token) return null;
    if (token.kind != kind) return null;

    this.cursorPosition++;

    return token;
  }

  /**
   * Compares given kind with the current tokens kind. It returns it and moves the cursor when matching, throws in other cases
   * @param kind Wanted kind
   * @returns token
   * @throws when kind does not match
   */
  public expect(kind: EKinaLexerTokenKind): IKinaLexerTokenDefinition {
    const result = this.match(kind);
    if (!result) {
      const actualToken = this.peek();
      const actualKind = actualToken
        ? actualToken.kind
        : EKinaLexerTokenKind.EOF;
      const line = actualToken ? actualToken.line + 1 : "?";
      const col = actualToken ? actualToken.col + 1 : "?";

      throw new Error(
        `Syntax Error at ${this.fileName}:${line}:${col} -> Expected "${kind}", but got "${actualKind}"`,
      );
    }

    return result;
  }
}
