import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";

export class TypeBaseNode extends BaseNode {
  constructor(kind: NodeKind, span: NodeSpan) {
    super(kind, span);
  }
}
