import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTVariableAccessNode extends KinaASTExpressionNode {
  protected readonly _name: string;

  constructor(name: string) {
    super(EKinaASTNodeKind.VariableAccess);

    this._name = name;
  }

  public get name() {
    return this._name;
  }
}
