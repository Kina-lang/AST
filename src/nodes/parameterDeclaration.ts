import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { KinaASTNode } from "./_node";
import { EKinaASTNodeKind } from "../types/ast";

export class KinaASTParameterDeclarationNode extends KinaASTNode {
  protected readonly name: string;
  protected readonly type: IKinaLexerTokenKindType;

  constructor(name: string, type: IKinaLexerTokenKindType) {
    super(EKinaASTNodeKind.ParameterDeclaration);

    this.name = name;
    this.type = type;
  }
}
