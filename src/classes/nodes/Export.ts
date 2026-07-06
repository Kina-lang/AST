import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { FunctionNode } from "./Function";
import type { IdentifierExpressionNode } from "./IdentifierExpression";

export class ExportNode extends BaseNode {
  private readonly _target: FunctionNode | IdentifierExpressionNode;

  constructor(span: NodeSpan, target: FunctionNode | IdentifierExpressionNode) {
    super(NodeKind.Export, span);

    this._target = target;
  }

  public get target(): FunctionNode | IdentifierExpressionNode {
    return this._target;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    target:
      | ReturnType<FunctionNode["export"]>
      | ReturnType<IdentifierExpressionNode["export"]>;
  } {
    return {
      ...super.export(),
      target: this._target.export(),
    };
  }
}
