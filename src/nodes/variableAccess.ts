import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTVariableAccessNode extends KinaASTExpressionNode {
  protected readonly name: string;

  constructor(name: string) {
    super(EKinaASTNodeKind.VariableAccess);

    this.name = name;
  }
}
