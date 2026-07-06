import {
  NodeKind,
  type NodeSpan,
  type NodeSpanExport,
} from "../../types/nodes";
import { BaseNode } from "./_base";
import type { TypeBaseNode } from "./_type";

export class ExternNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _parameterTypes: TypeBaseNode[];
  protected readonly _returnType: TypeBaseNode;

  constructor(
    span: NodeSpan,
    name: string,
    parameterTypes: TypeBaseNode[],
    returnType: TypeBaseNode,
  ) {
    super(NodeKind.Extern, span);

    this._name = name;
    this._parameterTypes = parameterTypes;
    this._returnType = returnType;
  }

  public get name(): string {
    return this._name;
  }

  public get parameterTypes(): TypeBaseNode[] {
    return this._parameterTypes;
  }

  public get returnType(): TypeBaseNode {
    return this._returnType;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    parameterTypes: ReturnType<TypeBaseNode["export"]>[];
    returnType: ReturnType<TypeBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      parameterTypes: this._parameterTypes.map((type) => type.export()),
      returnType: this._returnType.export(),
    };
  }
}
