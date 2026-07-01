import {
  NodeKind,
  type NodeSpan,
  type NodeSpanExport,
} from "../../types/nodes";
import type { KinaTypeTokenKind } from "../../types/types";
import { BaseNode } from "./_base";

export class ExternNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _parameterTypes: KinaTypeTokenKind[];
  protected readonly _returnType: KinaTypeTokenKind;

  constructor(
    span: NodeSpan,
    name: string,
    parameterTypes: KinaTypeTokenKind[],
    returnType: KinaTypeTokenKind,
  ) {
    super(NodeKind.Extern, span);

    this._name = name;
    this._parameterTypes = parameterTypes;
    this._returnType = returnType;
  }

  public get name(): string {
    return this._name;
  }

  public get parameterTypes(): KinaTypeTokenKind[] {
    return this._parameterTypes;
  }

  public get returnType(): KinaTypeTokenKind {
    return this._returnType;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    parameterTypes: KinaTypeTokenKind[];
    returnType: KinaTypeTokenKind;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      parameterTypes: this._parameterTypes,
      returnType: this._returnType,
    };
  }
}
