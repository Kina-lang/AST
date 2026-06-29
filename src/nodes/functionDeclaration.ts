import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTNode } from "./_node";
import type { KinaASTParameterDeclarationNode } from "./parameterDeclaration";
import type { KinaASTBlockStatementNode } from "./blockStatement";

export class KinaASTFunctionDeclarationNode extends KinaASTNode {
  protected readonly name: string;
  protected readonly parameters: KinaASTParameterDeclarationNode[];
  protected readonly returnType: IKinaLexerTokenKindType;
  protected readonly body: KinaASTBlockStatementNode;

  constructor(
    name: string,
    parameters: KinaASTParameterDeclarationNode[],
    returnType: IKinaLexerTokenKindType,
    body: KinaASTBlockStatementNode,
  ) {
    super(EKinaASTNodeKind.FunctionDeclaration);

    this.name = name;
    this.parameters = parameters;
    this.returnType = returnType;
    this.body = body;
  }
}
