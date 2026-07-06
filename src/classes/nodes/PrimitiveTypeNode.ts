import { NodeKind, type NodeSpan } from "../../types/nodes";
import type { KinaTypeTokenKind } from "../../types/types";
import { TypeBaseNode } from "./_type";

export class PrimitiveTypeNode extends TypeBaseNode {
  private readonly _primitiveKind: KinaTypeTokenKind;

  constructor(span: NodeSpan, primitiveKind: KinaTypeTokenKind) {
    super(NodeKind.PrimitiveTypeNode, span);

    this._primitiveKind = primitiveKind;
  }

  public get primitiveKind(): KinaTypeTokenKind {
    return this._primitiveKind;
  }

  public override export(): ReturnType<TypeBaseNode["export"]> & {
    primitiveKind: KinaTypeTokenKind;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      primitiveKind: this._primitiveKind,
    };
  }
}
