import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTNode } from "./_node";
import type { KinaASTLiteralExpressionNode } from "./literalExpression";

export class KinaASTIncludeDirectiveNode extends KinaASTNode {
  protected readonly _argument: KinaASTLiteralExpressionNode;

  constructor(argument: KinaASTLiteralExpressionNode) {
    super(EKinaASTNodeKind.IncludeDirective);

    this._argument = argument;
  }

  public get argument() {
    return this._argument;
  }
}
