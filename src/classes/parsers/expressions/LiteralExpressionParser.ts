import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import {
  getStringLiteralValue,
  KINA_LITERAL_TOKENS,
} from "../../../utils/literal";
import type { TokenStream } from "../../TokenStream";
import {
  LiteralBooleanToken,
  LiteralStringToken,
  TokenKind,
} from "@kina-lang/lexer";
import { LiteralExpressionNode } from "../../nodes/LiteralExpression";
import type { KinaLiteralTokenKind } from "../../../types/literals";
import { ExpressionBaseParser } from "./_base";
import type { ExpressionBaseNode } from "../../nodes/_expression";

export class LiteralExpressionParser extends ExpressionBaseParser {
  constructor() {
    super();
  }

  public canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (!KINA_LITERAL_TOKENS.has(currentToken.kind)) return false;

    return true;
  }

  override parseExpression(tokenStream: TokenStream): ExpressionBaseNode {
    const literalToken = tokenStream.expectAny([...KINA_LITERAL_TOKENS]);
    if (literalToken === null) {
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        "Failed to parse literal expression",
        tokenStream.getDiagnosticsLocation(tokenStream.peek()),
      );

      return null as any;
    }

    let value: string;
    if (literalToken?.kind == TokenKind.LiteralString)
      value = getStringLiteralValue((literalToken as LiteralStringToken).value);
    else value = (literalToken as LiteralBooleanToken)?.value ?? "";

    return new LiteralExpressionNode(
      {
        start: literalToken?.span?.start ?? { line: 0, column: 0 },
        end: literalToken?.span?.end ?? { line: 0, column: 0 },
      },
      (literalToken?.kind ?? TokenKind.LiteralString) as KinaLiteralTokenKind,
      value,
    );
  }
}
