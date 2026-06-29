import { EKinaASTNodeKind, type IKinaASTExpressionNode } from "../types/ast";
import { KinaASTNode } from "./_node";

export class KinaASTReturnStatementNode extends KinaASTNode {
  protected readonly value: IKinaASTExpressionNode | null;

  constructor(value: IKinaASTExpressionNode | null) {
    super(EKinaASTNodeKind.ReturnStatement);

    this.value = value;
  }
}
