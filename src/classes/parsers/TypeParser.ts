import { IdentifierToken, TokenKind } from "@kina-lang/lexer";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { PrimitiveTypeNode } from "../nodes/PrimitiveTypeNode";
import { KINA_TYPE_TOKENS } from "../../utils/type";
import type { TypeBaseNode } from "../nodes/_type";
import { UserDefinedTypeNode } from "../nodes/UserDefinedTypeNode";
import { IdentifierExpressionNode } from "../nodes/IdentifierExpression";
import { Parsers } from "./_index";

export class TypeParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (KINA_TYPE_TOKENS.has(currentToken.kind)) return true;
    if (Parsers.FunctionType.canParse(tokenStream)) return true;

    return false;
  }

  public canParseOffset(tokenStream: TokenStream, offset: number): boolean {
    const currentToken = tokenStream.peekAhead(offset);
    if (currentToken === null) return false;
    if (KINA_TYPE_TOKENS.has(currentToken.kind)) return true;
    if (Parsers.FunctionType.canParse(tokenStream, offset)) return true;

    return false;
  }

  override parse(tokenStream: TokenStream): TypeBaseNode[] {
    const currentToken = tokenStream.peek();
    if (currentToken === null)
      Diagnostics.throwInternal(
        "Unexpected end of token stream when parsing type",
      );

    if (Parsers.FunctionType.canParse(tokenStream))
      return Parsers.FunctionType.parse(tokenStream) as TypeBaseNode[];

    if (!KINA_TYPE_TOKENS.has(currentToken.kind)) {
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        `Unexpected token when parsing type: ${currentToken.kind}`,
        tokenStream.getDiagnosticsLocation(currentToken),
      );
      return [];
    }

    const typeToken = tokenStream.expectAny([...KINA_TYPE_TOKENS]);
    if (!typeToken) return [];

    const defaultSpan = {
      start: { line: 0, column: 0 },
      end: { line: 0, column: 0 },
    };
    const span = typeToken?.span ?? defaultSpan;

    return [
      typeToken.kind == TokenKind.Identifier
        ? new UserDefinedTypeNode(
            span,
            new IdentifierExpressionNode(
              { start: span.start, end: span.end },
              (typeToken as IdentifierToken)?.value ?? "",
            ),
          )
        : new PrimitiveTypeNode(span, typeToken.kind as any),
    ];
  }
}
