import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { KINA_TYPE_TOKENS } from "../../utils/type";
import { Parsers } from "./_index";
import { KinaAssertionError } from "@kina-lang/utils";
import { VariableDeclarationStatementNode } from "../nodes/VariableDeclarationStatementNode";
import type { KinaTypeTokenKind } from "../../types/types";

export class VariableDeclarationStatementParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (
      currentToken.kind !== TokenKind.KeywordMutable &&
      currentToken.kind !== TokenKind.KeywordVariable
    )
      return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expectAny([
      TokenKind.KeywordMutable,
      TokenKind.KeywordVariable,
    ]);

    const identifierToken = tokenStream.expect(
      TokenKind.Identifier,
    ) as IdentifierToken;
    tokenStream.expect(TokenKind.Colon);

    const typeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);
    tokenStream.expect(TokenKind.OperatorAssign);

    const expression = Parsers.Expression.parse(tokenStream);
    if (expression.length === 0)
      throw new KinaAssertionError(
        "Failed to parse expression in variable declaration statement",
      );

    const semicolonToken = tokenStream.match(TokenKind.Semicolon);

    return [
      new VariableDeclarationStatementNode(
        {
          start: start.span!.start,
          end: (semicolonToken ?? expression[0]!).span!.end,
        },
        identifierToken.value,
        typeToken.kind as KinaTypeTokenKind,
        start.kind === TokenKind.KeywordMutable,
        expression[0]!,
      ),
    ];
  }
}
