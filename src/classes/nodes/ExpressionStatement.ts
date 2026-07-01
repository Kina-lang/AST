import { NodeKind } from "../../types/nodes";
import { BaseNode } from "./_base";
import type { ExpressionBaseNode } from "./_expression";

export class ExpressionStatementNode extends BaseNode {
  protected readonly _expression: ExpressionBaseNode;

  constructor(expression: ExpressionBaseNode) {
    super(NodeKind.ExpressionStatement, expression.span);
    this._expression = expression;
  }

  public get expression(): ExpressionBaseNode {
    return this._expression;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    expression: ReturnType<ExpressionBaseNode["export"]>;
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      expression: this._expression.export(),
    };
  }
}
