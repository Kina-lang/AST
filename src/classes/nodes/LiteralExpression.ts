import type { KinaLiteralTokenKind } from "../../types/literals";
import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";

export class LiteralExpressionNode extends ExpressionBaseNode {
  protected readonly _literalType: KinaLiteralTokenKind;
  protected readonly _value: string;

  constructor(
    span: NodeSpan,
    literalType: KinaLiteralTokenKind,
    value: string,
  ) {
    super(NodeKind.LiteralExpression, span);

    this._literalType = literalType;
    this._value = value;
  }

  public get literalType(): KinaLiteralTokenKind {
    return this._literalType;
  }

  public get value(): string {
    return this._value;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    literalType: KinaLiteralTokenKind;
    value: string;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      literalType: this._literalType,
      value: this._value,
    };
  }
}
