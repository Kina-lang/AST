import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";

export class UnaryExpressionNode extends ExpressionBaseNode {
  protected readonly _operator: string;
  protected readonly _right: ExpressionBaseNode;

  constructor(span: NodeSpan, operator: string, right: ExpressionBaseNode) {
    super(NodeKind.UnaryExpression, span);

    this._operator = operator;
    this._right = right;
  }

  public get operator(): string {
    return this._operator;
  }

  public get right(): ExpressionBaseNode {
    return this._right;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    operator: string;
    right: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      operator: this._operator,
      right: this._right.export(),
    };
  }
}
