import { TokenKind } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";
import { BaseParser } from "./_base";
import { IdentifierExpressionNode } from "../nodes/IdentifierExpression";
import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import { Parsers } from "./_index";
import { NodeKind } from "../../types/nodes";
import {
  ExportNode,
  type FunctionNode,
  type VariableDeclarationStatementNode,
  type StructNode,
} from "../..";

export class ExportParser extends BaseParser {
  constructor() {
    super();
  }

  override canParse(tokenStream: TokenStream): boolean {
    const currentToken = tokenStream.peek();
    if (currentToken === null) return false;
    if (currentToken.kind !== TokenKind.KeywordExport) return false;

    return true;
  }

  override parse(tokenStream: TokenStream): BaseNode[] {
    const startToken = tokenStream.expect(TokenKind.KeywordExport);

    const target = Parsers.File.parseNext(tokenStream);
    if (!target || target.length !== 1) {
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        "Expected target after 'export' keyword",
        tokenStream.getDiagnosticsLocation(tokenStream.peek()),
      );

      return [];
    }

    if (
      target[0]!.kind !== NodeKind.Function &&
      target[0]!.kind !== NodeKind.IdentifierExpression &&
      target[0]!.kind !== NodeKind.VariableDeclarationStatement &&
      target[0]!.kind !== NodeKind.Struct
    ) {
      Diagnostics.error(
        DiagnosticsErrorCode.SyntaxError,
        "Expected function, identifier, variable declaration, or struct after 'export' keyword",
        tokenStream.getDiagnosticsLocation(tokenStream.peek()),
      );

      return [];
    }

    return [
      new ExportNode(
        {
          start: startToken?.span?.start ?? { line: 0, column: 0 },
          end: target[0]!.span!.end,
        },
        target[0] as
          | FunctionNode
          | IdentifierExpressionNode
          | VariableDeclarationStatementNode
          | StructNode,
      ),
    ];
  }
}
