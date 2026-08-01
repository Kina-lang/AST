import type { CompilerContext } from "@kina-lang/compiler";
import { TreeContext } from "./TreeContext";
import { LexerTokenType, type LexerToken } from "@kina-lang/lexer";
import type { FileTreeNode, TreeNode } from "../types/tree";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import { Parsers } from "./parsers/Parser";
import { TreeNodes } from "./TreeNodes";
import { TreeModifier } from "../types/modifier";

export const ModifierMap = {
  [LexerTokenType.KeywordExport]: TreeModifier.Export,
};

export class TreeBuilder {
  private _context: TreeContext;

  constructor(compilerContext: CompilerContext, tokens: LexerToken[]) {
    this._context = new TreeContext(compilerContext, tokens);
  }

  public build() {
    return this.parseFile();
  }

  private parseFile(): FileTreeNode | null {
    let nodes: TreeNode[] = [];

    while (!this._context.scanner.isAtEnd) {
      const node = this.parseNext();

      if (node) nodes.push(node);
    }

    return TreeNodes.createFileNode(
      nodes,
      TreeNodes.mergeSpans(
        nodes[0]?.span ?? TreeNodes.zeroSpan,
        nodes[nodes.length - 1]?.span ?? TreeNodes.zeroSpan,
      ),
    );
  }

  private parseNext(): TreeNode | null {
    const token = this._context.scanner.peek();
    if (!token)
      Diagnostics.throwInternal("Unexpected end of file while parsing");

    // If we find a modifier
    if (token.type in ModifierMap) {
      const modifier = ModifierMap[token.type as keyof typeof ModifierMap]!;

      this._context.addModifier(modifier);
      this._context.scanner.advance();

      return null;
    }

    const node = this.parseFileNode();

    // If we have an unconsumed modifier, report a diagnostic error and clear the modifiers
    if (this._context.currentModifiers.length > 0) {
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        `Unconsumed modifier(s) '${this._context.currentModifiers.join(", ")}' found`,
        {
          file:
            this._context.compilerContext.relativeActiveFilePath ?? "<unknown>",
          span: [
            token?.span?.startPosition.line ?? 0,
            token?.span?.startPosition.column ?? 0,
            token?.span?.endPosition.line ?? 0,
            token?.span?.endPosition.column ?? 0,
          ],
        },
      );

      this._context.clearModifiers();
    }

    return node;
  }

  private parseFileNode() {
    const token = this._context.scanner.peek();
    if (!token)
      Diagnostics.throwInternal("Unexpected end of file while parsing");

    switch (token.type) {
      case LexerTokenType.KeywordFunction:
        return Parsers.Function.parse(this._context);
      case LexerTokenType.KeywordImport:
        return Parsers.Import.parse(this._context);
      case LexerTokenType.KeywordMutable:
      case LexerTokenType.KeywordValue:
        return Parsers.VariableDeclarationStatement.parse(this._context);
      case LexerTokenType.KeywordStruct:
        return Parsers.Struct.parse(this._context);
      case LexerTokenType.DirectiveInclude:
        return Parsers.Directive.parse(this._context);
      case LexerTokenType.KeywordExtern:
        return Parsers.Extern.parse(this._context);
      case LexerTokenType.KeywordExtend:
        return Parsers.Extend.parse(this._context);
      case LexerTokenType.Semicolon:
      case LexerTokenType.EOF:
      case LexerTokenType.Comment:
      case LexerTokenType.MultilineComment:
        this._context.scanner.advance();
        return null;
      default:
        // If nothing could parse the token, report a diagnostic error and consume the token to avoid an infinite loop
        this._context.scanner.advance();

        Diagnostics.error(
          DiagnosticsErrorCode.SyntaxError,
          `Unexpected token type '${token.type}' in file`,
          {
            file:
              this._context.compilerContext.relativeActiveFilePath ??
              "<unknown>",
            span: [
              token?.span?.startPosition.line ?? 0,
              token?.span?.startPosition.column ?? 0,
              token?.span?.endPosition.line ?? 0,
              token?.span?.endPosition.column ?? 0,
            ],
          },
        );

        return null;
    }
  }
}
