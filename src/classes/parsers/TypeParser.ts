import { KinaAssertionError } from "@kina-lang/utils";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { PrimitiveTypeNode } from "../nodes/PrimitiveTypeNode";
import { KINA_TYPE_TOKENS } from "../../utils/type";
import type { TypeBaseNode } from "../nodes/_type";

export class TypeParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (KINA_TYPE_TOKENS.has(currentToken.kind)) return true;

    return false;
  }

  override parse(tokenStream: TokenStream): TypeBaseNode[] {
    const currentToken = tokenStream.peek();
    if (currentToken === null)
      throw new KinaAssertionError(
        "Unexpected end of token stream when parsing type",
      );

    if (!KINA_TYPE_TOKENS.has(currentToken.kind))
      throw new KinaAssertionError(
        `Unexpected token when parsing type: ${currentToken.kind}`,
      );

    const typeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);

    return [new PrimitiveTypeNode(typeToken.span!, typeToken.kind as any)];
  }
}
