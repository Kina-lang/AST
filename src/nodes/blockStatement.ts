import { EKinaASTNodeKind, type IKinaASTStatementNode } from "../types/ast";
import { KinaASTNode } from "./_node";

export class KinaASTBlockStatementNode extends KinaASTNode {
  protected readonly _statements: IKinaASTStatementNode[];

  constructor(statements: IKinaASTStatementNode[]) {
    super(EKinaASTNodeKind.BlockStatement);

    this._statements = statements;
  }

  public get statements() {
    return this._statements;
  }
}
