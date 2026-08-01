import type { TreeContext } from "../TreeContext";
import { BasicBlockParser } from "./BasicBlockParser";
import { DirectiveParser } from "./DirectiveParser";
import { ExpressionParser } from "./expressions/ExpressionParser";
import { BinaryExpressionParser } from "./expressions/infix/BinaryExpressionParser";
import { CallExpressionParser } from "./expressions/infix/CallExpressionParser";
import { MemberAccessExpressionParser } from "./expressions/infix/MemberAccessExpressionParser";
import { GroupExpressionParser } from "./expressions/prefix/GroupExpressionParser";
import { IdentifierAccessExpressionParser } from "./expressions/prefix/IdentifierAccessExpressionParser";
import { LiteralExpressionParser } from "./expressions/prefix/LiteralExpressionParser";
import { StructLiteralExpressionParser } from "./expressions/prefix/StructLiteralExpression";
import { UnaryExpressionParser } from "./expressions/prefix/UnaryExpressionParser";
import { ExtendParser } from "./ExtendParser";
import { ExternParser } from "./ExternParser";
import { FunctionParameterParser } from "./FunctionParameterParser";
import { FunctionParser } from "./FunctionParser";
import { FunctionTypeAnnotationParser } from "./FunctionTypeAnnotationParser";
import { IfStatementParser } from "./IfStatementParser";
import { ImportMemberParser } from "./ImportMemberParser";
import { ImportParser } from "./ImportParser";
import { ExpressionStatementParser } from "./statements/ExpressionStatementParser";
import { ReturnStatementParser } from "./statements/ReturnStatementParser";
import { StructFieldParser } from "./StructFieldParser";
import { StructLiteralExpressionFieldParser } from "./StructLiteralExpressionFieldParser";
import { StructParser } from "./StructParser";
import { TypeAnnotationParser } from "./TypeAnnotationParser";
import { VariableDeclarationStatementParser } from "./VariableDeclarationStatementParser";

export interface Parser<T> {
  parse(ctx: TreeContext): T | null;
}

export const Parsers = {
  Function: new FunctionParser(),
  FunctionParameter: new FunctionParameterParser(),
  TypeAnnotation: new TypeAnnotationParser(),
  BasicBlock: new BasicBlockParser(),
  Import: new ImportParser(),
  ImportMember: new ImportMemberParser(),
  ReturnStatement: new ReturnStatementParser(),
  VariableDeclarationStatement: new VariableDeclarationStatementParser(),
  ExpressionStatement: new ExpressionStatementParser(),
  Expression: new ExpressionParser(),
  BinaryExpression: new BinaryExpressionParser(),
  IdentifierAccessExpression: new IdentifierAccessExpressionParser(),
  LiteralExpression: new LiteralExpressionParser(),
  IfStatement: new IfStatementParser(),
  MemberAccessExpression: new MemberAccessExpressionParser(),
  CallExpression: new CallExpressionParser(),
  UnaryExpression: new UnaryExpressionParser(),
  GroupExpression: new GroupExpressionParser(),
  StructField: new StructFieldParser(),
  Struct: new StructParser(),
  Directive: new DirectiveParser(),
  Extern: new ExternParser(),
  FunctionTypeAnnotation: new FunctionTypeAnnotationParser(),
  StructLiteralExpression: new StructLiteralExpressionParser(),
  StructLiteralExpressionField: new StructLiteralExpressionFieldParser(),
  Extend: new ExtendParser()
};
