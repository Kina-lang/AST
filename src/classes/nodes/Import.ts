import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { IdentifierExpressionNode } from "./IdentifierExpression";
import type { LiteralExpressionNode } from "./LiteralExpression";

export class ImportNode extends BaseNode {
  private readonly _members: IdentifierExpressionNode[];
  private readonly _source: LiteralExpressionNode;
  private readonly _isExtern: boolean;

  constructor(
    span: NodeSpan,
    members: IdentifierExpressionNode[],
    source: LiteralExpressionNode,
    isExtern: boolean,
  ) {
    super(NodeKind.Import, span);

    this._members = members;
    this._source = source;
    this._isExtern = isExtern;
  }

  public get members(): IdentifierExpressionNode[] {
    return this._members;
  }

  public get source(): LiteralExpressionNode {
    return this._source;
  }

  public get isExtern(): boolean {
    return this._isExtern;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    members: ReturnType<IdentifierExpressionNode["export"]>[];
    source: ReturnType<LiteralExpressionNode["export"]>;
    isExtern: boolean;
  } {
    return {
      ...super.export(),
      members: this._members.map((member) => member.export()),
      source: this._source.export(),
      isExtern: this._isExtern,
    };
  }
}
