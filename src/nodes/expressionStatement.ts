import { EKinaASTNodeKind } from "../types/ast";
import type { KinaASTExpressionNode } from "./_expression";
import { KinaASTNode } from "./_node";

export class KinaASTExpressionStatementNode extends KinaASTNode {
  protected readonly _expression: KinaASTExpressionNode; // TODO: Fix type

  constructor(expression: KinaASTExpressionNode) {
    super(EKinaASTNodeKind.ExpressionStatement);

    this._expression = expression;
  }

  public get expression() {
    return this._expression;
  }
}
