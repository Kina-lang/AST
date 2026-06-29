import { EKinaASTNodeKind, type IKinaASTStatementNode } from "../types/ast";
import { KinaASTNode } from "./_node";

export class KinaASTBlockStatementNode extends KinaASTNode {
  protected readonly statements: IKinaASTStatementNode[];

  constructor(statements: IKinaASTStatementNode[]) {
    super(EKinaASTNodeKind.BlockStatement);

    this.statements = statements;
  }
}
