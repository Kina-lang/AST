import { KinaAssertionError } from "@kina-lang/utils";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";

export class ExpressionParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    return Parsers.LiteralExpression.canParse(tokenStream);
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    if (Parsers.LiteralExpression.canParse(tokenStream))
      return Parsers.LiteralExpression.parse(tokenStream);

    throw new KinaAssertionError(
      "Failed to parse expression: No parser could parse the next token",
    );
  }
}
