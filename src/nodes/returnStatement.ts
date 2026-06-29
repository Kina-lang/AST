import { EKinaASTNodeKind, type IKinaASTExpressionNode } from "../types/ast";
import { KinaASTNode } from "./_node";

export class KinaASTReturnStatementNode extends KinaASTNode {
  protected readonly _value: IKinaASTExpressionNode | null;

  constructor(value: IKinaASTExpressionNode | null) {
    super(EKinaASTNodeKind.ReturnStatement);

    this._value = value;
  }

  public get value() {
    return this._value;
  }
}
