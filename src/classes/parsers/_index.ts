import { BasicBlockParser } from "./BasicBlockParser";
import { BinaryExpressionParser } from "./expressions/BinaryExpressionParser";
import { CallExpressionParser } from "./expressions/CallExpressionParser";
import { ExpressionParser } from "./ExpressionParser";
import { ExternParser } from "./ExternParser";
import { FileParser } from "./FileParser";
import { FunctionParameterParser } from "./FunctionParameterParser";
import { FunctionParser } from "./FunctionParser";
import { IncludeDirectiveParser } from "./IncludeDirectiveParser";
import { LiteralExpressionParser } from "./expressions/LiteralExpressionParser";
import { MemberAccessExpressionParser } from "./expressions/MemberAccessExpressionParser";
import { ReturnStatementParser } from "./ReturnStatementParser";
import { ExpressionStatementParser } from "./ExpressionStatement";
import { VariableDeclarationStatementParser } from "./VariableDeclarationStatement";
import { UnaryExpressionParser } from "./expressions/UnaryExpressionParser";
import { IfStatementParser } from "./IfStatementParser";

export const Parsers = {
  File: new FileParser(),
  IncludeDirective: new IncludeDirectiveParser(),
  Extern: new ExternParser(),
  Function: new FunctionParser(),
  FunctionParameter: new FunctionParameterParser(),
  BasicBlock: new BasicBlockParser(),
  Expression: new ExpressionParser(),
  LiteralExpression: new LiteralExpressionParser(),
  ReturnStatement: new ReturnStatementParser(),
  CallExpression: new CallExpressionParser(),
  MemberAccessExpression: new MemberAccessExpressionParser(),
  BinaryExpression: new BinaryExpressionParser(),
  UnaryExpression: new UnaryExpressionParser(),
  ExpressionStatement: new ExpressionStatementParser(),
  VariableDeclarationStatement: new VariableDeclarationStatementParser(),
  IfStatement: new IfStatementParser(),
};
