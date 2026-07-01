export enum NodeKind {
  File = "ast.File",

  IncludeDirective = "ast.IncludeDirective",

  Extern = "ast.Extern",
  Function = "ast.Function",
  FunctionParameter = "ast.FunctionParameter",

  ReturnStatement = "ast.ReturnStatement",

  LiteralExpression = "ast.LiteralExpression",

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
