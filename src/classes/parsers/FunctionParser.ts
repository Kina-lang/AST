import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { KINA_TYPE_TOKENS } from "../../utils/type";
import type { FunctionParameterNode } from "../nodes/FunctionParameter";
import { Parsers } from "./_index";
import { FunctionNode } from "../nodes/Function";
import type { KinaTypeTokenKind } from "../../types/types";
import { BasicBlockNode } from "../nodes/BasicBlock";
import { KinaAssertionError } from "@kina-lang/utils";

export class FunctionParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordFunction) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const start = tokenStream.expect(TokenKind.KeywordFunction);
    const identifierToken = tokenStream.expect(
      TokenKind.Identifier,
    ) as IdentifierToken;

    tokenStream.expect(TokenKind.ParentheseOpen);

    const parameters = this.parseParameters(tokenStream);

    tokenStream.expect(TokenKind.ParentheseClose);
    tokenStream.expect(TokenKind.Colon);

    const typeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);

    const basicBlock = Parsers.BasicBlock.parse(
      tokenStream,
    )[0] as BasicBlockNode;
    if (basicBlock === null)
      throw new KinaAssertionError("Failed to parse function body");

    return [
      new FunctionNode(
        { start: start.span!.start, end: basicBlock.span!.end },
        identifierToken.value,
        parameters,
        typeToken.kind as KinaTypeTokenKind,
        basicBlock,
      ),
    ];
  }

  private parseParameters(tokenStream: TokenStream): FunctionParameterNode[] {
    const parameters: FunctionParameterNode[] = [];

    while (!tokenStream.isAtEnd()) {
      if (!Parsers.FunctionParameter.canParse(tokenStream)) break;

      const parameterNodes = Parsers.FunctionParameter.parse(tokenStream);
      parameters.push(...parameterNodes);

      const comma = tokenStream.match(TokenKind.Comma);
      if (comma === null) break;
    }

    return parameters;
  }
}
