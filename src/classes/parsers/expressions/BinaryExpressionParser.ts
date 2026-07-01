import { KinaAssertionError } from "@kina-lang/utils";
import type { TokenStream } from "../../TokenStream";
import { BaseParser } from "../_base";
import type { BaseNode } from "../../nodes/_base";
import type { ExpressionBaseNode } from "../../nodes/_expression";
import {
  KINA_INFIX_PRECEDENCE,
  KINA_RIGHT_ASSOCIATIVE_OPERATORS,
} from "../../../utils/expression";
import { Parsers } from "../_index";
import { BinaryExpressionNode } from "../../nodes/BinaryExpression";
import { ExpressionBaseParser } from "./_base";

export class BinaryExpressionParser extends ExpressionBaseParser {
  constructor() {
    super();
  }

  public parseExpression(
    tokenStream: TokenStream,
    left: BaseNode,
    operator?: string,
  ): ExpressionBaseNode {
    if (!operator)
      throw new KinaAssertionError(
        "BinaryExpressionParser parseExpression requires an operator to be provided.",
      );

    const operatorToken = tokenStream.advance()!;
    const precedence = KINA_INFIX_PRECEDENCE.get(operatorToken.kind)!;

    const rightPrecedence = KINA_RIGHT_ASSOCIATIVE_OPERATORS.has(
      operatorToken.kind,
    )
      ? precedence - 1
      : precedence;

    const right = Parsers.Expression.parseExpression(
      tokenStream,
      rightPrecedence,
    );

    return new BinaryExpressionNode(
      { start: left.span!.start, end: right.span!.end },
      operator,
      left as ExpressionBaseNode,
      right,
    );
  }
}
