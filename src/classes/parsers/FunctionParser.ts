import { LexerTokenType } from "@kina-lang/lexer";
import type {
  FunctionParameterTreeNode,
  FunctionTreeNode,
} from "../../types/tree";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";

export class FunctionParser implements Parser<FunctionTreeNode> {
  public parse(ctx: TreeContext): FunctionTreeNode | null {
    const funcKeyword = ctx.scanner.expect(LexerTokenType.KeywordFunction);
    const identifier = ctx.scanner.expect(LexerTokenType.Identifier);

    const modifiers = ctx.consumeModifiers();

    const parameters: FunctionParameterTreeNode[] = [];
    ctx.scanner.expect(LexerTokenType.LeftParen);

    // Parse parameters
    while (!ctx.scanner.isAtEnd) {
      if (ctx.scanner.check(LexerTokenType.RightParen)) break;

      const parameter = Parsers.FunctionParameter.parse(ctx);
      if (parameter) parameters.push(parameter);

      if (ctx.scanner.check(LexerTokenType.RightParen)) break;

      ctx.scanner.expect(LexerTokenType.Comma);
    }

    ctx.scanner.expect(LexerTokenType.RightParen);
    ctx.scanner.expect(LexerTokenType.Colon);

    const typeAnnotation = Parsers.TypeAnnotation.parse(ctx);

    const body = Parsers.BasicBlock.parse(ctx);

    return TreeNodes.createFunctionNode(
      TreeNodes.tokenToIdentifierNode(identifier),
      parameters,
      typeAnnotation,
      body,
      modifiers,
      TreeNodes.mergeSpans(
        funcKeyword?.span ?? null,
        identifier?.span ?? null,
        ...parameters.map((p) => p.span ?? null),
        typeAnnotation?.span ?? null,
        body?.span ?? null,
      ),
    );
  }
}
