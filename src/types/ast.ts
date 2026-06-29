import type {
  EKinaLexerTokenKind,
  IKinaLexerTokenKindType,
} from "@kina-lang/lexer";
import type { KinaASTFunctionDeclarationNode } from "../nodes/functionDeclaration";
import type { KinaASTBlockStatementNode } from "../nodes/blockStatement";
import type { KinaASTExpressionStatementNode } from "../nodes/expressionStatement";
import type { KinaASTLiteralExpressionNode } from "../nodes/literalExpression";
import type { KinaASTReturnStatementNode } from "../nodes/returnStatement";
import type { KinaASTVariableAccessNode } from "../nodes/variableAccess";
import type { KinaASTCallExpressionNode } from "../nodes/callExpression";
import type { KinaASTMemberAccessNode } from "../nodes/memberAccess";

/*export type IKinaASTNode =
  | IKinaASTFunctionDeclaration
  | IKinaASTParameterDeclaration
  | IKinaASTBlockStatement
  | IKinaASTReturnStatement
  | IKinaASTExpression
  | IKinaASTLiteral
  | IKinaASTVariableAccess;*/

export enum EKinaASTNodeKind {
  FunctionDeclaration = "kina.function.declaration",
  ParameterDeclaration = "kina.parameter.declaration",
  BlockStatement = "kina.statement.block",
  ExpressionStatement = "kina.statement.expression",
  LiteralStatement = "kina.statement.literal",
  ReturnStatement = "kina.statement.return",
  ExpressionCall = "kina.expression.call",
  /*Expression = "kina.expression",
  Literal = "kina.literal",*/
  VariableAccess = "kina.variable.access",
  MemberAccess = "kina.member.access",
}

export type IKinaASTStatementNode =
  | KinaASTFunctionDeclarationNode
  | KinaASTBlockStatementNode
  | KinaASTExpressionStatementNode
  | KinaASTReturnStatementNode;

export type IKinaASTExpressionNode =
  | KinaASTLiteralExpressionNode
  | KinaASTVariableAccessNode
  | KinaASTCallExpressionNode
  | KinaASTMemberAccessNode;

/*export enum EKinaASTExpressionOperator {
  Add = "kina.operator.add",
  Subtract = "kina.operator.subtract",
  Multiply = "kina.operator.multiply",
  Divide = "kina.operator.divide",
  Set = "kina.operator.set",

  Equals = "kina.operator.equals",
  GreaterThan = "kina.operator.gt",
  LowerThan = "kina.operator.lt",
}*/

/*export interface IKinaASTParameterDeclaration {
  kind: EKinaASTNodeKind.ParameterDeclaration;
  name: string;
  type: IKinaLexerTokenKindType;
}

export interface IKinaASTFunctionDeclaration {
  kind: EKinaASTNodeKind.FunctionDeclaration;
  name: string;
  parameters: IKinaASTParameterDeclaration[];
  returnType: IKinaLexerTokenKindType;
  body: IKinaASTBlockStatement;
}

export interface IKinaASTBlockStatement {
  kind: EKinaASTNodeKind.BlockStatement;
  statements: IKinaASTNode[];
}

export type IKinaASTValue =
  | IKinaASTExpression
  | IKinaASTLiteral
  | IKinaASTVariableAccess;

export interface IKinaASTReturnStatement {
  kind: EKinaASTNodeKind.ReturnStatement;
  value: IKinaASTValue;
}

export interface IKinaASTVariableAccess {
  kind: EKinaASTNodeKind.VariableAccess;
  name: string;
  resolvedType: IKinaLexerTokenKindType;
}

export interface IKinaASTLiteral {
  kind: EKinaASTNodeKind.Literal;
  value: string;
  resolvedType: IKinaLexerTokenKindType;
}

export interface IKinaASTExpression {
  kind: EKinaASTNodeKind.Expression;
  operator: EKinaASTExpressionOperator;
  left: IKinaASTValue;
  right: IKinaASTValue;
}
*/
