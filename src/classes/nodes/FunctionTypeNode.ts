import { NodeKind, type NodeSpan } from "../../types/nodes";
import { TypeBaseNode } from "./_type";

export class FunctionTypeNode extends TypeBaseNode {
  private readonly _parameters: TypeBaseNode[];
  private readonly _returnType: TypeBaseNode;

  constructor(
    span: NodeSpan,
    parameters: TypeBaseNode[],
    returnType: TypeBaseNode,
  ) {
    super(NodeKind.FunctionTypeNode, span);

    this._parameters = parameters;
    this._returnType = returnType;
  }

  public get parameters(): TypeBaseNode[] {
    return this._parameters;
  }

  public get returnType(): TypeBaseNode {
    return this._returnType;
  }

  public override export(): ReturnType<TypeBaseNode["export"]> & {
    parameters: ReturnType<TypeBaseNode["export"]>[];
    returnType: ReturnType<TypeBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      parameters: this._parameters.map((p) => p.export()),
      returnType: this._returnType.export(),
    };
  }
}
