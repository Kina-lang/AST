import { NodeKind, type NodeSpan } from "../../types/nodes";
import type { KinaTypeTokenKind } from "../../types/types";
import { BaseNode } from "./_base";
import type { ExpressionBaseNode } from "./_expression";

export class VariableDeclarationStatementNode extends BaseNode {
  private readonly _name: string;
  private readonly _type: KinaTypeTokenKind;
  private readonly _isMutable: boolean;
  private readonly _value: ExpressionBaseNode;

  constructor(
    span: NodeSpan,
    name: string,
    type: KinaTypeTokenKind,
    isMutable: boolean,
    value: ExpressionBaseNode,
  ) {
    super(NodeKind.VariableDeclarationStatement, span);

    this._name = name;
    this._type = type;
    this._isMutable = isMutable;
    this._value = value;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): KinaTypeTokenKind {
    return this._type;
  }

  public get isMutable(): boolean {
    return this._isMutable;
  }

  public get value(): ExpressionBaseNode {
    return this._value;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    type: KinaTypeTokenKind;
    isMutable: boolean;
    value: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      type: this._type,
      isMutable: this._isMutable,
      value: this._value.export(),
    };
  }
}
