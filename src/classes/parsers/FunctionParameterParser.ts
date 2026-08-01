import { LexerTokenType } from "@kina-lang/lexer";
import type { TreeContext } from "../TreeContext";
import { Parsers, type Parser } from "./Parser";
import { TreeNodes } from "../TreeNodes";
import type { FunctionParameterTreeNode } from "../../types/tree";

export class FunctionParameterParser implements Parser<FunctionParameterTreeNode> {
  parse(ctx: TreeContext): FunctionParameterTreeNode | null {
    const identifier = ctx.scanner.expect(LexerTokenType.Identifier);
    ctx.scanner.expect(LexerTokenType.Colon);

    const typeAnnotation = Parsers.TypeAnnotation.parse(ctx);

    return TreeNodes.createFunctionParameterNode(
      TreeNodes.tokenToIdentifierNode(identifier),
      typeAnnotation,
      TreeNodes.mergeSpans(
        identifier?.span ?? null,
        typeAnnotation?.span ?? null,
      ),
    );
  }
}
