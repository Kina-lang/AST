import { randomBytes } from "crypto";
import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";

export class BasicBlockNode extends BaseNode {
  private readonly _name: string;
  private readonly _nodes: BaseNode[];

  constructor(span: NodeSpan, nodes: BaseNode[]) {
    super(NodeKind.BasicBlock, span);

    this._nodes = nodes;

    // Generate a random name for the basic block
    // this is used by the semantic checker and IR builder to
    // obtain the correct scope
    this._name = `bb_${randomBytes(8).toString("hex")}`;
  }

  public get nodes(): BaseNode[] {
    return this._nodes;
  }

  public get name(): string {
    return this._name;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    name: string;
    nodes: ReturnType<BaseNode["export"]>[];
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      name: this._name,
      nodes: this._nodes.map((node) => node.export()),
    };
  }
}
