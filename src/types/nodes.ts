export enum NodeKind {
  File = "ast.File",

  IncludeDirective = "ast.IncludeDirective",

  Extern = "ast.Extern",
  Function = "ast.Function",
  FunctionParameter = "ast.FunctionParameter",

  ReturnStatement = "ast.ReturnStatement",
  ExpressionStatement = "ast.ExpressionStatement",
  VariableDeclarationStatement = "ast.VariableDeclarationStatement",

  LiteralExpression = "ast.LiteralExpression",
  IdentifierExpression = "ast.IdentifierExpression",
  BinaryExpression = "ast.BinaryExpression",
  GroupExpression = "ast.GroupExpression",
  MemberAccessExpression = "ast.MemberAccessExpression",
  CallExpression = "ast.CallExpression",

  BasicBlock = "ast.BasicBlock",
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
