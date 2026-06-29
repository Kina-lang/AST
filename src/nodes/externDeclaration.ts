import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTNode } from "./_node";
import type { KinaASTParameterDeclarationNode } from "./parameterDeclaration";

export class KinaASTExternDeclarationNode extends KinaASTNode {
  protected readonly _name: string;
  protected readonly _parameterTypes: IKinaLexerTokenKindType[];
  protected readonly _returnType: IKinaLexerTokenKindType;

  constructor(
    name: string,
    parameterTypes: IKinaLexerTokenKindType[],
    returnType: IKinaLexerTokenKindType,
  ) {
    super(EKinaASTNodeKind.ExternDeclaration);

    this._name = name;
    this._parameterTypes = parameterTypes;
    this._returnType = returnType;
  }

  public get name() {
    return this._name;
  }

  public get parameters() {
    return this._parameterTypes;
  }

  public get returnType() {
    return this._returnType;
  }
}
