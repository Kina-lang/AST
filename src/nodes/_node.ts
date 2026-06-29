import type { EKinaASTNodeKind } from "../types/ast";

export class KinaASTNode {
  protected readonly kind: EKinaASTNodeKind;

  protected constructor(kind: EKinaASTNodeKind) {
    this.kind = kind;
  }
}
