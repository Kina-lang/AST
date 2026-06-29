import type { IKinaLexerTokenKindLiteral } from "@kina-lang/lexer";
import { EKinaASTNodeKind } from "../types/ast";
import { KinaASTExpressionNode } from "./_expression";

export class KinaASTLiteralExpressionNode extends KinaASTExpressionNode {
  protected readonly _literalType: IKinaLexerTokenKindLiteral; // TODO: Add proper type
  protected readonly _value: string;

  constructor(literalType: IKinaLexerTokenKindLiteral, value: string) {
    super(EKinaASTNodeKind.LiteralStatement);

    this._literalType = literalType;
    this._value = value;
  }

  public get literalType() {
    return this._literalType
  }

  public get value() {
    return this._value
  }
}
