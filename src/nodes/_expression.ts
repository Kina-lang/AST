import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { KinaASTNode } from "./_node";
import type { EKinaASTNodeKind } from "../types/ast";

export class KinaASTExpressionNode extends KinaASTNode {
  protected resolvedType?: IKinaLexerTokenKindType; // Will be set later by semantic analyzer

  protected constructor(kind: EKinaASTNodeKind) {
    super(kind);
  }
}
