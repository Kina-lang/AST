import { NodeKind, type NodeSpan } from "../../types/nodes";
import type { KinaTypeTokenKind } from "../../types/types";
import { BaseNode } from "./_base";

export class FunctionParameterNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _type: KinaTypeTokenKind;

  constructor(span: NodeSpan, name: string, type: KinaTypeTokenKind) {
    super(NodeKind.FunctionParameter, span);

    this._name = name;
    this._type = type;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): KinaTypeTokenKind {
    return this._type;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    type: KinaTypeTokenKind;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      type: this._type,
    };
  }
}
