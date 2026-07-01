import type { ExpressionBaseNode } from "../../nodes/_expression";
import type { TokenStream } from "../../TokenStream";

export abstract class ExpressionBaseParser {
  constructor() {}

  public abstract parseExpression(
    tokenStream: TokenStream,
    left: ExpressionBaseNode,
  ): ExpressionBaseNode;
}
