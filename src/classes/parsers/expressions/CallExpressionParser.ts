import { TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../../nodes/_base";
import type { TokenStream } from "../../TokenStream";
import { BaseParser } from "../_base";
import { Parsers } from "../_index";
import { KinaAssertionError } from "@kina-lang/utils";
import type { ExpressionBaseNode } from "../../nodes/_expression";
import { KINA_EXPRESSION_PRECEDENCE } from "../../../utils/expression";
import { CallExpressionNode } from "../../nodes/CallExpression";
import { ExpressionBaseParser } from "./_base";

export class CallExpressionParser extends ExpressionBaseParser {
  constructor() {
    super();
  }

  public parseExpression(
    tokenStream: TokenStream,
    callee: ExpressionBaseNode,
  ): ExpressionBaseNode {
    tokenStream.expect(TokenKind.ParentheseOpen);

    const args: ExpressionBaseNode[] = [];

    if (
      !tokenStream.isAtEnd() &&
      tokenStream.peek()!.kind !== TokenKind.ParentheseClose
    ) {
      args.push(
        Parsers.Expression.parseExpression(
          tokenStream,
          KINA_EXPRESSION_PRECEDENCE.LOWEST,
        ),
      );

      while (tokenStream.match(TokenKind.Comma)) {
        args.push(
          Parsers.Expression.parseExpression(
            tokenStream,
            KINA_EXPRESSION_PRECEDENCE.LOWEST,
          ),
        );
      }
    }

    const end = tokenStream.expect(TokenKind.ParentheseClose);

    return new CallExpressionNode(
      { start: callee.span!.start, end: end.span!.end },
      callee,
      args,
    );
  }
}
