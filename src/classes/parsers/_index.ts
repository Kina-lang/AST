import { BasicBlockParser } from "./BasicBlockParser";
import { ExpressionParser } from "./ExpressionParser";
import { ExternParser } from "./ExternParser";
import { FileParser } from "./FileParser";
import { FunctionParameterParser } from "./FunctionParameterParser";
import { FunctionParser } from "./FunctionParser";
import { IncludeDirectiveParser } from "./IncludeDirectiveParser";
import { LiteralExpressionParser } from "./LiteralExpressionParser";
import { ReturnStatementParser } from "./ReturnStatementParser";

export const Parsers = {
  File: new FileParser(),
  IncludeDirective: new IncludeDirectiveParser(),
  Extern: new ExternParser(),
  Function: new FunctionParser(),
  FunctionParameter: new FunctionParameterParser(),
  BasicBlock: new BasicBlockParser(),
  Expression: new ExpressionParser(),
  LiteralExpression: new LiteralExpressionParser(),
  ReturnStatement: new ReturnStatementParser()
};
