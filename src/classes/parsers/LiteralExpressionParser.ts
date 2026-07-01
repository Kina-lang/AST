import { KinaAssertionError } from "@kina-lang/utils";
import { NodeKind, type NodeSpan } from "../../types/nodes";
import {
  getStringLiteralValue,
  KINA_LITERAL_TOKENS,
} from "../../utils/literal";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import {
  LiteralBooleanToken,
  LiteralStringToken,
  TokenKind,
} from "@kina-lang/lexer";
import { LiteralExpressionNode } from "../nodes/LiteralExpression";
import type { KinaLiteralTokenKind } from "../../types/literals";

export class LiteralExpressionParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (!KINA_LITERAL_TOKENS.has(currentToken.kind)) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const literalToken = tokenStream.expectAny([...KINA_LITERAL_TOKENS]);
    if (literalToken === null)
      throw new KinaAssertionError("Failed to parse literal expression");

    let value: string;
    if (literalToken.kind == TokenKind.LiteralString)
      value = getStringLiteralValue((literalToken as LiteralStringToken).value);
    else value = (literalToken as LiteralBooleanToken).value;

    return [
      new LiteralExpressionNode(
        { start: literalToken.span!.start, end: literalToken.span!.end },
        literalToken.kind as KinaLiteralTokenKind,
        value,
      ),
    ];
  }
}
