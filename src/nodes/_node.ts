import type { EKinaASTNodeKind } from "../types/ast";

export class KinaASTNode {
  protected readonly _kind: EKinaASTNodeKind;

  protected constructor(kind: EKinaASTNodeKind) {
    this._kind = kind;
  }

  public get kind(): EKinaASTNodeKind {
    return this._kind;
  }
}
