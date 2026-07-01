import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";

export class BinaryExpressionNode extends ExpressionBaseNode {
  protected readonly _operator: string;
  protected readonly _left: ExpressionBaseNode;
  protected readonly _right: ExpressionBaseNode;

  constructor(
    span: NodeSpan,
    operator: string,
    left: ExpressionBaseNode,
    right: ExpressionBaseNode,
  ) {
    super(NodeKind.BinaryExpression, span);

    this._operator = operator;
    this._left = left;
    this._right = right;
  }

  public get operator(): string {
    return this._operator;
  }

  public get left(): ExpressionBaseNode {
    return this._left;
  }

  public get right(): ExpressionBaseNode {
    return this._right;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    operator: string;
    left: ReturnType<ExpressionBaseNode["export"]>;
    right: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      operator: this._operator,
      left: this._left.export(),
      right: this._right.export(),
    };
  }
}
