import { KinaAssertionError } from "@kina-lang/utils";
import type { BaseNode } from "../nodes/_base";
import { FileNode } from "../nodes/File";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { KinaAST } from "../KinaAST";

export class FileParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    return true;
  }

  override parse(tokenStream: TokenStream): [FileNode] {
    const nodes: BaseNode[] = [];

    while (!tokenStream.isAtEnd()) {
      const result = this.parseNext(tokenStream);

      if (result) nodes.push(...result);
      else throw new KinaAssertionError("Failed to parse node");
    }

    return [
      new FileNode(
        {
          start: { line: 0, column: 0 },
          end: { line: 0, column: 0 },
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

    throw new KinaAssertionError(
      "Failed to parse node: No parser could parse the next token",
    );
  }
}
