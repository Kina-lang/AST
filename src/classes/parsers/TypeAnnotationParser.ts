import { Diagnostics, DiagnosticsErrorCode } from "@kina-lang/utils";
import type { TypeAnnotationTreeNode } from "../../types/tree";
import { TokensValidAsNamedTypeAnnotations } from "../config/types";
import type { TreeContext } from "../TreeContext";
import { TreeNodes } from "../TreeNodes";
import { Parsers, type Parser } from "./Parser";
import { LexerTokenType } from "@kina-lang/lexer";

export class TypeAnnotationParser implements Parser<TypeAnnotationTreeNode> {
  parse(ctx: TreeContext): TypeAnnotationTreeNode | null {
    // If we find a token that can be parsed as named type annotation,
    // parse it as such
    if (ctx.scanner.check(...TokensValidAsNamedTypeAnnotations)) {
      const identifier = ctx.scanner.expect(
        ...TokensValidAsNamedTypeAnnotations,
      );

      return TreeNodes.createNamedTypeAnnotationNode(
        TreeNodes.tokenToIdentifierNode(identifier)!,
        TreeNodes.mergeSpans(identifier?.span ?? null),
      );
    }

    // If we find an open parenthesis, parse it as a function type annotation
    if (ctx.scanner.check(LexerTokenType.LeftParen)) {
      return Parsers.FunctionTypeAnnotation.parse(ctx);
    }

    const nextToken = ctx.scanner.advance();
    Diagnostics.error(
      DiagnosticsErrorCode.SyntaxError,
      "Expected a type annotation",
      {
        file: ctx.compilerContext.relativeActiveFilePath ?? "<unknown>",
        span: [
          nextToken?.span?.startPosition.line ?? 0,
          nextToken?.span?.startPosition.column ?? 0,
          nextToken?.span?.endPosition.line ?? 0,
          nextToken?.span?.endPosition.column ?? 0,
        ],
      },
    );

    return null;
  }
}
