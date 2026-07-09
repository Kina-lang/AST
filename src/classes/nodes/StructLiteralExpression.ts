import { NodeKind, type NodeSpan } from "../../types/nodes";
import { ExpressionBaseNode } from "./_expression";
import type { StructLiteralFieldNode } from "./StructLiteralField";

export class StructLiteralExpressionNode extends ExpressionBaseNode {
  protected readonly _fields: StructLiteralFieldNode[];

  constructor(span: NodeSpan, fields: StructLiteralFieldNode[]) {
    super(NodeKind.StructLiteralExpression, span);

    this._fields = fields;
  }

  public get fields(): StructLiteralFieldNode[] {
    return this._fields;
  }

  public override export(): ReturnType<ExpressionBaseNode["export"]> & {
    fields: ReturnType<StructLiteralFieldNode["export"]>[];
  } {
    const baseExport = super.export();
    return {
      ...baseExport,
      fields: this._fields.map((field) => field.export()),
    };
  }
}
