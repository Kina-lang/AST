import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { KinaASTNode } from "./_node";
import type { EKinaASTNodeKind } from "../types/ast";

export class KinaASTExpressionNode extends KinaASTNode {
  protected _resolvedType?: IKinaLexerTokenKindType; // Will be set later by semantic analyzer

  protected constructor(kind: EKinaASTNodeKind) {
    super(kind);
  }

  public get resolvedType() {
    return this._resolvedType;
  }

  public setResolvedType(type: IKinaLexerTokenKindType) {
    this._resolvedType = type;
  }
}
