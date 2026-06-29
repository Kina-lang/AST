import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTLiteralExpressionNode extends KinaASTExpressionNode {
  protected readonly literalType: any; // TODO: Add proper type
  protected readonly value: string;

  constructor(literalType: any, value: string) {
    super(EKinaASTNodeKind.LiteralStatement);

    this.literalType = literalType;
    this.value = value;
  }
}
