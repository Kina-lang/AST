import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { TypeBaseNode } from "./_type";
import type { ExpressionBaseNode } from "./_expression";

export class VariableDeclarationStatementNode extends BaseNode {
  private readonly _name: string;
  private readonly _type: TypeBaseNode;
  private readonly _isMutable: boolean;
  private readonly _value: ExpressionBaseNode;

  constructor(
    span: NodeSpan,
    name: string,
    type: TypeBaseNode,
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

  public get type(): TypeBaseNode {
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
    type: ReturnType<TypeBaseNode["export"]>;
    isMutable: boolean;
    value: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      type: this._type.export(),
      isMutable: this._isMutable,
      value: this._value.export(),
    };
  }
}
