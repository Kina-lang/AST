import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { TypeBaseNode } from "./_type";
import type { BasicBlockNode } from "./BasicBlock";
import type { FunctionParameterNode } from "./FunctionParameter";

export class FunctionNode extends BaseNode {
  protected readonly _name: string;
  protected readonly _parameters: FunctionParameterNode[];
  protected readonly _returnType: TypeBaseNode;
  protected readonly _body: BasicBlockNode;

  constructor(
    span: NodeSpan,
    name: string,
    parameters: FunctionParameterNode[],
    returnType: TypeBaseNode,
    body: BasicBlockNode,
  ) {
    super(NodeKind.Function, span);

    this._name = name;
    this._parameters = parameters;
    this._returnType = returnType;
    this._body = body;
  }

  public get name(): string {
    return this._name;
  }

  public get parameters(): FunctionParameterNode[] {
    return this._parameters;
  }

  public get returnType(): TypeBaseNode {
    return this._returnType;
  }

  public get body(): BasicBlockNode {
    return this._body;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    parameters: ReturnType<FunctionParameterNode["export"]>[];
    returnType: ReturnType<TypeBaseNode["export"]>;
    body: ReturnType<BasicBlockNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      parameters: this._parameters.map((param) => param.export()),
      returnType: this._returnType.export(),
      body: this._body.export(),
    };
  }
}
