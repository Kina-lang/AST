import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { Parsers } from "./_index";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import { VariableDeclarationStatementNode } from "../nodes/VariableDeclarationStatementNode";
import type { TypeBaseNode } from "../nodes/_type";

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

    let typeNode: TypeBaseNode | undefined = undefined;
    if (tokenStream.expect(TokenKind.Colon)) {
      const types = Parsers.Type.parse(tokenStream);

      if (types.length > 0) typeNode = types[0];
    } else if (Parsers.Type.canParse(tokenStream)) {
      const types = Parsers.Type.parse(tokenStream);

      if (types.length > 0) typeNode = types[0];
    }

    tokenStream.expect(TokenKind.OperatorAssign);

    const expression = Parsers.Expression.parse(tokenStream);
    if (!expression || expression.length === 0)
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        "Failed to parse expression in variable declaration statement",
        tokenStream.getDiagnosticsLocation(tokenStream.peek()),
      );

    const semicolonToken = tokenStream.match(TokenKind.Semicolon);

    return [
      new VariableDeclarationStatementNode(
        {
          start: start?.span?.start ?? { line: 0, column: 0 },
          end: (semicolonToken ?? expression?.[0] ?? identifierToken ?? start)
            ?.span?.end ?? { line: 0, column: 0 },
        },
        identifierToken?.value ?? "",
        typeNode,
        start?.kind === TokenKind.KeywordMutable,
        expression?.[0],
      ),
    ];
  }
}
