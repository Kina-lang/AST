import { KinaAssertionError } from "@kina-lang/utils";
import type { ExpressionBaseNode } from "../../nodes/_expression";
import type { TokenStream } from "../../TokenStream";
import { ExpressionBaseParser } from "./_base";
import { UnaryExpressionNode } from "../../nodes/UnaryExpression";
import { Parsers } from "../_index";
import {
  KINA_EXPRESSION_PRECEDENCE,
  KINA_PREFIX_OPERATORS,
} from "../../../utils/expression";

export class UnaryExpressionParser extends ExpressionBaseParser {
  constructor() {
    super();
  }

  public canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();

    if (currentToken === null) return false;
    return KINA_PREFIX_OPERATORS.has(currentToken.kind);
  }

  public override parseExpression(
    tokenStream: TokenStream,
  ): ExpressionBaseNode {
    const operatorToken = tokenStream.advance()!;
    const operator = KINA_PREFIX_OPERATORS.get(operatorToken.kind);

    if (!operator) {
      throw new KinaAssertionError(
        `UnaryExpressionParser expected a prefix operator, got: ${operatorToken.kind}`,
      );
    }

    const right = Parsers.Expression.parseExpression(
      tokenStream,
      KINA_EXPRESSION_PRECEDENCE.PREFIX,
    );

    return new UnaryExpressionNode(
      { start: operatorToken.span!.start, end: right.span!.end },
      operator,
      right,
    );
  }
}
