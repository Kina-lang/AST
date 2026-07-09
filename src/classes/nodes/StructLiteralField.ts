import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { ExpressionBaseNode } from "./_expression";

export class StructLiteralFieldNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _value: ExpressionBaseNode;

  constructor(span: NodeSpan, name: string, value: ExpressionBaseNode) {
    super(NodeKind.StructLiteralField, span);

    this._name = name;
    this._value = value;
  }

  public get name(): string {
    return this._name;
  }

  public get value(): ExpressionBaseNode {
    return this._value;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    value: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      value: this._value.export(),
    };
  }
}
