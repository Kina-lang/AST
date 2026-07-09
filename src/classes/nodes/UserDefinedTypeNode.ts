import { NodeKind, type NodeSpan } from "../../types/nodes";
import { TypeBaseNode } from "./_type";
import type { IdentifierExpressionNode } from "./IdentifierExpression";

export class UserDefinedTypeNode extends TypeBaseNode {
  private readonly _identifier: IdentifierExpressionNode;

  constructor(span: NodeSpan, identifier: IdentifierExpressionNode) {
    super(NodeKind.UserDefinedTypeNode, span);

    this._identifier = identifier;
  }

  public get identifier(): IdentifierExpressionNode {
    return this._identifier;
  }

  public override export(): ReturnType<TypeBaseNode["export"]> & {
    identifier: ReturnType<IdentifierExpressionNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      identifier: this._identifier.export(),
    };
  }
}
