import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTNode } from "./_node";

export class KinaASTExpressionStatementNode extends KinaASTNode {
  protected readonly expression: KinaASTNode; // TODO: Fix type

  constructor(expression: KinaASTNode) {
    super(EKinaASTNodeKind.ExpressionStatement);

    this.expression = expression;
  }
}
