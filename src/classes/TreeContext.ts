import { CompilerContext } from "@kina-lang/compiler";
import { TreeScanner } from "./TreeScanner";
import type { LexerToken } from "@kina-lang/lexer";
import type { TreeModifier } from "../types/modifier";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";

export class TreeContext {
  private readonly _compilerContext: CompilerContext;
  private readonly _scanner: TreeScanner;
  private readonly _currentModifiers: Set<TreeModifier> = new Set();

  constructor(compilerContext: CompilerContext, tokens: LexerToken[]) {
    this._compilerContext = compilerContext;
    this._scanner = new TreeScanner(this, tokens);
  }

  public get compilerContext(): CompilerContext {
    return this._compilerContext;
  }

  public get scanner(): TreeScanner {
    return this._scanner;
  }

  public get currentModifiers(): TreeModifier[] {
    return Array.from(this._currentModifiers);
  }

  public addModifier(modifier: TreeModifier): void {
    if (this._currentModifiers.has(modifier)) {
      const token = this._scanner.peek();

      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        `Duplicate modifier '${modifier}' found`,
        {
          file: this._compilerContext.relativeActiveFilePath ?? "<unknown>",
          span: [
            token?.span?.startPosition.line ?? 0,
            token?.span?.startPosition.column ?? 0,
            token?.span?.endPosition.line ?? 0,
            token?.span?.endPosition.column ?? 0,
          ],
        },
      );

      return;
    }

    this._currentModifiers.add(modifier);
  }

  public clearModifiers(): void {
    this._currentModifiers.clear();
  }

  public consumeModifiers(): TreeModifier[] {
    const modifiers = this.currentModifiers;
    this.clearModifiers();

    return modifiers;
  }
}
