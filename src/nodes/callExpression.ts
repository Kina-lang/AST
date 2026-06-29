import type { IKinaLexerTokenKindType } from "@kina-lang/lexer";
import { EKinaASTNodeKind, type IKinaASTExpressionNode } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTCallExpressionNode extends KinaASTExpressionNode {
  protected readonly _callee: IKinaASTExpressionNode;
  protected readonly _arguments: IKinaASTExpressionNode[];

  constructor(callee: IKinaASTExpressionNode, args: IKinaASTExpressionNode[]) {
    super(EKinaASTNodeKind.ExpressionCall);

    this._callee = callee;
    this._arguments = args;
  }

  public get callee() {
    return this._callee;
  }

  public get arguments() {
    return this._arguments;
  }
}
