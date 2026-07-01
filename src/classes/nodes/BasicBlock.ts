import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";

export class BasicBlockNode extends BaseNode {
  private readonly _nodes: BaseNode[];

  constructor(span: NodeSpan, nodes: BaseNode[]) {
    super(NodeKind.BasicBlock, span);

    this._nodes = nodes;
  }

  public get nodes(): BaseNode[] {
    return this._nodes;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    nodes: ReturnType<BaseNode["export"]>[];
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      nodes: this._nodes.map((node) => node.export()),
    };
  }
}
