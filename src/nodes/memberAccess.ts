import { EKinaASTNodeKind, type IKinaASTExpressionNode } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTMemberAccessNode extends KinaASTExpressionNode {
  protected readonly object: IKinaASTExpressionNode;
  protected readonly property: string;

  constructor(object: IKinaASTExpressionNode, property:string) {
    super(EKinaASTNodeKind.MemberAccess)

    this.object = object;
    this.property = property
  }
}
