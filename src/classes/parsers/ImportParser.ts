import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { IdentifierExpressionNode } from "../nodes/IdentifierExpression";
import { KinaAssertionError } from "@kina-lang/utils";
import { ImportNode } from "../nodes/Import";
import { LiteralExpressionNode } from "../nodes/LiteralExpression";
import { Parsers } from "./_index";

export class ImportParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordImport) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const startToken = tokenStream.expect(TokenKind.KeywordImport);

    const braceOpen = tokenStream.match(TokenKind.BraceOpen);
    //if (braceOpen) {
    const members = this.parseImportMembers(tokenStream);
    tokenStream.expect(TokenKind.BraceClose);
    /*} else {
      tokenStream.expect(TokenKind.Identifier);
    }*/

    tokenStream.expect(TokenKind.KeywordFrom);

    const extern = tokenStream.match(TokenKind.KeywordExtern) !== null;
    const sourceLiteral = Parsers.Expression.parseExpression(
      tokenStream,
    ) as LiteralExpressionNode;

    const endToken = tokenStream.match(TokenKind.Semicolon);

    return [
      new ImportNode(
        {
          start: startToken.span!.start,
          end: (endToken ?? sourceLiteral).span!.end,
        },
        members,
        sourceLiteral,
        extern,
      ),
    ];
  }

  private parseImportMembers(
    tokenStream: TokenStream,
  ): IdentifierExpressionNode[] {
    const members: IdentifierExpressionNode[] = [];

    while (!tokenStream.isAtEnd()) {
      const currentToken = tokenStream.peek();
      if (currentToken === null) break;
      if (currentToken.kind === TokenKind.BraceClose) break;

      const member = tokenStream.expect(
        TokenKind.Identifier,
      ) as IdentifierToken;
      if (!member)
        throw new KinaAssertionError("Expected identifier in import statement");

      members.push(new IdentifierExpressionNode(member.span!, member.value));

      if (!tokenStream.match(TokenKind.Comma)) break;
    }

    return members;
  }
}
