import { LexerTokenType } from "@kina-lang/lexer";
import type {
  FunctionTypeAnnotationTreeNode,
  TreeContext,
  TypeAnnotationTreeNode,
} from "../..";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class FunctionTypeAnnotationParser implements Parser<FunctionTypeAnnotationTreeNode> {
  parse(ctx: TreeContext): FunctionTypeAnnotationTreeNode | null {
    const openParenToken = ctx.scanner.expect(LexerTokenType.LeftParen);
    if (!openParenToken) return null;

    const parameterTypeNodes: TypeAnnotationTreeNode[] = [];
    while (
      !ctx.scanner.isAtEnd &&
      !ctx.scanner.check(LexerTokenType.RightParen)
    ) {
      const parameterTypeNode = Parsers.TypeAnnotation.parse(ctx);
      if (!parameterTypeNode) return null;

      parameterTypeNodes.push(parameterTypeNode);

      if (!ctx.scanner.match(LexerTokenType.Comma)) break;
    }

    ctx.scanner.expect(LexerTokenType.RightParen);
    ctx.scanner.expect(LexerTokenType.MinusGreaterThan);

    const returnTypeNode = Parsers.TypeAnnotation.parse(ctx);

    return TreeNodes.createFunctionTypeAnnotationNode(
      parameterTypeNodes,
      returnTypeNode,
      TreeNodes.mergeSpans(
        openParenToken?.span ?? null,
        returnTypeNode?.span ?? null,
      ),
    );
  }
}
