import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { EKinaASTNodeKind, type IKinaASTExpressionNode } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTCallExpressionNode extends KinaASTExpressionNode {
  protected readonly callee: IKinaASTExpressionNode;
  protected readonly arguments: IKinaASTExpressionNode[];

  constructor(callee: IKinaASTExpressionNode, args: IKinaASTExpressionNode[]) {
    super(EKinaASTNodeKind.ExpressionCall);

    this.callee = callee;
    this.arguments = args;
  }
}
