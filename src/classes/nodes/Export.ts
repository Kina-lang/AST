import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { FunctionNode } from "./Function";
import type { IdentifierExpressionNode } from "./IdentifierExpression";
import type { VariableDeclarationStatementNode } from "./VariableDeclarationStatementNode";
import type { StructNode } from "./Struct";

export class ExportNode extends BaseNode {
  private readonly _target:
    | FunctionNode
    | IdentifierExpressionNode
    | VariableDeclarationStatementNode
    | StructNode;

  constructor(
    span: NodeSpan,
    target:
      | FunctionNode
      | IdentifierExpressionNode
      | VariableDeclarationStatementNode
      | StructNode,
  ) {
    super(NodeKind.Export, span);

    this._target = target;
  }

  public get target():
    | FunctionNode
    | IdentifierExpressionNode
    | VariableDeclarationStatementNode
    | StructNode {
    return this._target;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    target:
      | ReturnType<FunctionNode["export"]>
      | ReturnType<IdentifierExpressionNode["export"]>
      | ReturnType<VariableDeclarationStatementNode["export"]>
      | ReturnType<StructNode["export"]>;
  } {
    return {
      ...super.export(),
      target: this._target.export(),
    };
  }
}
