import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";

export class IdentifierExpressionNode extends ExpressionBaseNode {
  protected readonly _name: string;

  constructor(span: NodeSpan, name: string) {
    super(NodeKind.IdentifierExpression, span);

    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    name: string;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
    };
  }
}
