import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";

export class MemberAccessExpressionNode extends ExpressionBaseNode {
  protected readonly _object: ExpressionBaseNode;
  protected readonly _property: string;

  constructor(span: NodeSpan, object: ExpressionBaseNode, property: string) {
    super(NodeKind.MemberAccessExpression, span);

    this._object = object;
    this._property = property;
  }

  public get object(): ExpressionBaseNode {
    return this._object;
  }

  public get property(): string {
    return this._property;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    object: ReturnType<ExpressionBaseNode["export"]>;
    property: string;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      object: this._object.export(),
      property: this._property,
    };
  }
}
