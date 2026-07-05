import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { ExpressionBaseNode } from "./_expression";
import type { BasicBlockNode } from "./BasicBlock";

export class IfStatementNode extends BaseNode {
  protected readonly _condition: ExpressionBaseNode;
  protected readonly _thenBlock: BasicBlockNode;
  protected readonly _elseBlock: BasicBlockNode | null;

  constructor(
    span: NodeSpan,
    condition: ExpressionBaseNode,
    thenBlock: BasicBlockNode,
    elseBlock: BasicBlockNode | null = null,
  ) {
    super(NodeKind.IfStatement, span);

    this._condition = condition;
    this._thenBlock = thenBlock;
    this._elseBlock = elseBlock;
  }

  public get condition(): ExpressionBaseNode {
    return this._condition;
  }

  public get thenBlock(): BasicBlockNode {
    return this._thenBlock;
  }

  public get elseBlock(): BasicBlockNode | null {
    return this._elseBlock;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    condition: ReturnType<ExpressionBaseNode["export"]>;
    thenBlock: ReturnType<BasicBlockNode["export"]>;
    elseBlock: ReturnType<BasicBlockNode["export"]> | null;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      condition: this._condition.export(),
      thenBlock: this._thenBlock.export(),
      elseBlock: this._elseBlock?.export() || null,
    };
  }
}
