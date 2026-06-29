import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { KinaASTNode } from "./_node";
import { EKinaASTNodeKind } from "../types/ast";

export class KinaASTParameterDeclarationNode extends KinaASTNode {
  protected readonly _name: string;
  protected readonly _type: IKinaLexerTokenKindType;

  constructor(name: string, type: IKinaLexerTokenKindType) {
    super(EKinaASTNodeKind.ParameterDeclaration);

    this._name = name;
    this._type = type;
  }

  public get name() {
    return this._name;
  }

  public get type() {
    return this._type;
  }
}
