import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { StructFieldNode } from "./StructField";

export class StructNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _fields: StructFieldNode[];

  constructor(span: NodeSpan, name: string, fields: StructFieldNode[]) {
    super(NodeKind.Struct, span);

    this._name = name;
    this._fields = fields;
  }

  public get name(): string {
    return this._name;
  }

  public get fields(): StructFieldNode[] {
    return this._fields;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    fields: ReturnType<StructFieldNode["export"]>[];
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      fields: this._fields.map((field) => field.export()),
    };
  }
}
