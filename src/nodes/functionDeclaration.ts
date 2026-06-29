import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTNode } from "./_node";
import type { KinaASTParameterDeclarationNode } from "./parameterDeclaration";
import type { KinaASTBlockStatementNode } from "./blockStatement";

export class KinaASTFunctionDeclarationNode extends KinaASTNode {
  protected readonly _name: string;
  protected readonly _parameters: KinaASTParameterDeclarationNode[];
  protected readonly _returnType: IKinaLexerTokenKindType;
  protected readonly _body: KinaASTBlockStatementNode;

  constructor(
    name: string,
    parameters: KinaASTParameterDeclarationNode[],
    returnType: IKinaLexerTokenKindType,
    body: KinaASTBlockStatementNode,
  ) {
    super(EKinaASTNodeKind.FunctionDeclaration);

    this._name = name;
    this._parameters = parameters;
    this._returnType = returnType;
    this._body = body;
  }

  public get name() {
    return this._name;
  }

  public get parameters() {
    return this._parameters;
  }

  public get returnType() {
    return this._returnType;
  }

  public get body() {
    return this._body;
  }
}
