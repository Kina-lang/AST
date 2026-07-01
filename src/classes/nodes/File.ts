import {
  NodeKind,
  type NodeSpan,
  type NodeSpanExport,
} from "../../types/nodes";
import { BaseNode } from "./_base";

export class FileNode extends BaseNode {
  protected readonly _nodes: BaseNode[];

  constructor(span: NodeSpan, nodes: BaseNode[]) {
    super(NodeKind.File, span);

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
