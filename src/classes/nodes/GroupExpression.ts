import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";

export class GroupExpressionNode extends ExpressionBaseNode {
  protected readonly _expression: ExpressionBaseNode;

  constructor(span: NodeSpan, expression: ExpressionBaseNode) {
    super(NodeKind.GroupExpression, span);

    this._expression = expression;
  }

  public get expression(): ExpressionBaseNode {
    return this._expression;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    expression: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      expression: this._expression.export(),
    };
  }
}
