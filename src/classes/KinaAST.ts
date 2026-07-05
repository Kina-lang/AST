import type { BaseToken } from "@kina-lang/lexer";
import type { BaseParser } from "./parsers/_base";
import type { FileNode } from "./nodes/File";
import { Parsers } from "./parsers/_index";
import { KinaAssertionError } from "@kina-lang/utils";
import { TokenStream } from "./TokenStream";

export class KinaAST {
  /**
   * Array of all parsers that will be used to parse the input.
   * Must be ordered in order of priority, with the highest priority parser first.
   */
  public static readonly PARSERS: BaseParser[] = [
    Parsers.IncludeDirective,
    Parsers.Extern,
    Parsers.Function,
    Parsers.ReturnStatement,
    Parsers.VariableDeclarationStatement,
    Parsers.BasicBlock,
    Parsers.IfStatement,
    Parsers.ExpressionStatement, // MUST be last
  ];

  constructor() {}

  /**
   * Takes an array of tokens and returns the AST.
   * @param tokens
   * @returns
   */
  public build(tokens: BaseToken[]): FileNode {
    const tokenStream = new TokenStream(tokens);

    const parser = Parsers.File;
    if (!parser.canParse(tokenStream))
      throw new KinaAssertionError("Cannot parse tokens with any parser");

    return parser.parse(tokenStream)[0];
  }
}
