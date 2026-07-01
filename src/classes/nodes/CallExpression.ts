import { NodeKind, type NodeSpan } from "../../types/nodes";
import type { BaseNode } from "./_base";
import { ExpressionBaseNode } from "./_expression";

export class CallExpressionNode extends ExpressionBaseNode {
  protected readonly _callee: ExpressionBaseNode;
  protected readonly _arguments: ExpressionBaseNode[];

  constructor(
    span: NodeSpan,
    callee: ExpressionBaseNode,
    args: ExpressionBaseNode[],
  ) {
    super(NodeKind.CallExpression, span);

    this._callee = callee;
    this._arguments = args;
  }

  public get callee(): ExpressionBaseNode {
    return this._callee;
  }

  public get arguments(): ExpressionBaseNode[] {
    return this._arguments;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    callee: ReturnType<ExpressionBaseNode["export"]>;
    arguments: ReturnType<ExpressionBaseNode["export"]>[];
  } {
    const baseExport = super.export();

    return {
      ...baseExport,
      callee: this._callee.export(),
      arguments: this._arguments.map((arg) => arg.export()),
    };
  }
}
