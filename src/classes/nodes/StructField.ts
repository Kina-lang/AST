import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { TypeBaseNode } from "./_type";

export class StructFieldNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _type: TypeBaseNode;

  constructor(span: NodeSpan, name: string, type: TypeBaseNode) {
    super(NodeKind.StructField, span);

    this._name = name;
    this._type = type;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): TypeBaseNode {
    return this._type;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    type: ReturnType<TypeBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      type: this._type.export(),
    };
  }
}
