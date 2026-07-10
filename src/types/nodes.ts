export enum NodeKind {
  File = "ast.File",

  IncludeDirective = "ast.IncludeDirective",

  Import = "ast.Import",
  Export = "ast.Export",

  Extern = "ast.Extern",
  Function = "ast.Function",
  FunctionParameter = "ast.FunctionParameter",
  Struct = "ast.Struct",
  StructField = "ast.StructField",

  ReturnStatement = "ast.ReturnStatement",
  ExpressionStatement = "ast.ExpressionStatement",
  VariableDeclarationStatement = "ast.VariableDeclarationStatement",
  IfStatement = "ast.IfStatement",

  LiteralExpression = "ast.LiteralExpression",
  IdentifierExpression = "ast.IdentifierExpression",
  BinaryExpression = "ast.BinaryExpression",
  GroupExpression = "ast.GroupExpression",
  MemberAccessExpression = "ast.MemberAccessExpression",
  CallExpression = "ast.CallExpression",
  UnaryExpression = "ast.UnaryExpression",
  StructLiteralExpression = "ast.StructLiteralExpression",
  StructLiteralField = "ast.StructLiteralField",

  BasicBlock = "ast.BasicBlock",

  PrimitiveTypeNode = "ast.PrimitiveTypeNode",
  UserDefinedTypeNode = "ast.UserDefinedTypeNode",
  FunctionTypeNode = "ast.FunctionTypeNode",
}

export interface NodeSpan {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}

export type NodeSpanExport = [[number, number], [number, number]];
