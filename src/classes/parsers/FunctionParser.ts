import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import type { FunctionParameterNode } from "../nodes/FunctionParameter";
import { Parsers } from "./_index";
import { FunctionNode } from "../nodes/Function";
import type { TypeBaseNode } from "../nodes/_type";
import { BasicBlockNode } from "../nodes/BasicBlock";

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

    let typeNode: TypeBaseNode | undefined = undefined;
    if (tokenStream.expect(TokenKind.Colon)) {
      const typeNodes = Parsers.Type.parse(tokenStream);

      if (typeNodes.length > 0) typeNode = typeNodes[0] as TypeBaseNode;
    } else if (Parsers.Type.canParse(tokenStream)) {
      const typeNodes = Parsers.Type.parse(tokenStream);

      if (typeNodes.length > 0) typeNode = typeNodes[0] as TypeBaseNode;
    }

    const basicBlockNodes = Parsers.BasicBlock.canParse(tokenStream)
      ? Parsers.BasicBlock.parse(tokenStream)
      : [];
    const basicBlock = basicBlockNodes[0] as BasicBlockNode;

    return [
      new FunctionNode(
        {
          start: start?.span?.start ?? { line: 0, column: 0 },
          end: basicBlock?.span?.end ?? { line: 0, column: 0 },
        },
        identifierToken?.value ?? "",
        parameters,
        typeNode,
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
