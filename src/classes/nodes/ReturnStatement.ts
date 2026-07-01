import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { ExpressionBaseNode } from "./_expression";

export class ReturnStatementNode extends BaseNode {
  protected readonly _value: ExpressionBaseNode | null;

  constructor(span: NodeSpan, value: ExpressionBaseNode | null) {
    super(NodeKind.ReturnStatement, span);
    this._value = value;
  }

  public get value(): ExpressionBaseNode | null {
    return this._value;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    value: ReturnType<ExpressionBaseNode["export"]> | null;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      value: this._value?.export() ?? null,
    };
  }
}
