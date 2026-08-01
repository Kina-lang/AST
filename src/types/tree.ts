import type { LexerTokenType } from "@kina-lang/lexer";
import type { TreeSpan } from "./span";
import type { TreeLiteralType } from "./type";
import type { TreeModifier } from "./modifier";

export type Tree = FileTreeNode;

export enum TreeNodeType {
  File = "FILE",
  Function = "FUNCTION",
  FunctionParameter = "FUNCTION_PARAMETER",
  Import = "IMPORT",
  ImportMember = "IMPORT_MEMBER",
  NamedTypeAnnotation = "NAMED_TYPE_ANNOTATION",
  BasicBlock = "BASIC_BLOCK",
  VariableDeclarationStatement = "VARIABLE_DECLARATION_STATEMENT",
  Identifier = "IDENTIFIER",
  ReturnStatement = "RETURN_STATEMENT",
  IfStatement = "IF_STATEMENT",
  ExpressionStatement = "EXPRESSION_STATEMENT",
  IdentifierAccessExpression = "IDENTIFIER_ACCESS_EXPRESSION",
  BinaryExpression = "BINARY_EXPRESSION",
  LiteralExpression = "LITERAL_EXPRESSION",
  MemberAccessExpression = "MEMBER_ACCESS_EXPRESSION",
  CallExpression = "CALL_EXPRESSION",
  UnaryExpression = "UNARY_EXPRESSION",
  GroupExpression = "GROUP_EXPRESSION",
  Struct = "STRUCT",
  StructField = "STRUCT_FIELD",
  Directive = "DIRECTIVE",
  Extern = "EXTERN",
  FunctionTypeAnnotation = "FUNCTION_TYPE_ANNOTATION",
  StructLiteralExpression = "STRUCT_LITERAL_EXPRESSION",
  StructLiteralExpressionField = "STRUCT_LITERAL_EXPRESSION_FIELD",
  Extend = "EXTEND",
}

export interface TreeNode {
  type: TreeNodeType;
  span: TreeSpan;
}

export interface FileTreeNode extends TreeNode {
  type: TreeNodeType.File;
  nodes: TreeNode[];
}

export interface FunctionTreeNode extends TreeNode {
  type: TreeNodeType.Function;
  nameNode: IdentifierTreeNode | null;
  parameterNodes: FunctionParameterTreeNode[];
  typeAnnotationNode: TypeAnnotationTreeNode | null;
  bodyNode: BasicBlockTreeNode | null;
  modifiers: TreeModifier[];
}

export interface IdentifierTreeNode extends TreeNode {
  type: TreeNodeType.Identifier;
  name: string;
}

export interface NamedTypeAnnotationTreeNode extends TreeNode {
  type: TreeNodeType.NamedTypeAnnotation;
  nameNode: IdentifierTreeNode;
}

export interface FunctionTypeAnnotationTreeNode extends TreeNode {
  type: TreeNodeType.FunctionTypeAnnotation;
  parameterTypeNodes: TypeAnnotationTreeNode[];
  returnTypeNode: TypeAnnotationTreeNode | null;
}

export type TypeAnnotationTreeNode =
  | NamedTypeAnnotationTreeNode
  | FunctionTypeAnnotationTreeNode
  | null;

export interface FunctionParameterTreeNode extends TreeNode {
  type: TreeNodeType.FunctionParameter;
  nameNode: IdentifierTreeNode | null;
  typeAnnotationNode: TypeAnnotationTreeNode | null;
}

export interface BasicBlockTreeNode extends TreeNode {
  type: TreeNodeType.BasicBlock;
  nodes: TreeNode[];
}

export interface ReturnStatementTreeNode extends TreeNode {
  type: TreeNodeType.ReturnStatement;
  expressionNode: ExpressionTreeNode | null;
}

export interface ExpressionStatementTreeNode extends TreeNode {
  type: TreeNodeType.ExpressionStatement;
  expressionNode: ExpressionTreeNode | null;
}

export interface IdentifierAccessExpressionTreeNode extends TreeNode {
  type: TreeNodeType.IdentifierAccessExpression;
  identifierNode: IdentifierTreeNode | null;
}

export interface BinaryExpressionTreeNode extends TreeNode {
  type: TreeNodeType.BinaryExpression;
  leftNode: ExpressionTreeNode | null;
  operatorToken: LexerTokenType;
  rightNode: ExpressionTreeNode | null;
}

export interface LiteralExpressionTreeNode extends TreeNode {
  type: TreeNodeType.LiteralExpression;
  literalType: TreeLiteralType;
  value: string;
}

export interface MemberAccessExpressionTreeNode extends TreeNode {
  type: TreeNodeType.MemberAccessExpression;
  objectNode: ExpressionTreeNode | null;
  propertyNode: IdentifierTreeNode | null;
}

export interface CallExpressionTreeNode extends TreeNode {
  type: TreeNodeType.CallExpression;
  calleeNode: ExpressionTreeNode | null;
  argumentNodes: ExpressionTreeNode[];
}

export interface UnaryExpressionTreeNode extends TreeNode {
  type: TreeNodeType.UnaryExpression;
  operatorToken: LexerTokenType;
  operandNode: ExpressionTreeNode | null;
}

export interface GroupExpressionTreeNode extends TreeNode {
  type: TreeNodeType.GroupExpression;
  expressionNode: ExpressionTreeNode | null;
}

export interface StructLiteralExpressionFieldTreeNode extends TreeNode {
  type: TreeNodeType.StructLiteralExpressionField;
  nameNode: IdentifierTreeNode | null;
  expressionNode: ExpressionTreeNode | null;
}

export interface StructLiteralExpressionTreeNode extends TreeNode {
  type: TreeNodeType.StructLiteralExpression;
  fieldNodes: StructLiteralExpressionFieldTreeNode[];
}

export type ExpressionTreeNode =
  | IdentifierAccessExpressionTreeNode
  | BinaryExpressionTreeNode
  | LiteralExpressionTreeNode
  | MemberAccessExpressionTreeNode
  | CallExpressionTreeNode
  | TypeAnnotationTreeNode
  | UnaryExpressionTreeNode
  | GroupExpressionTreeNode
  | StructLiteralExpressionTreeNode;

export interface ImportMemberTreeNode extends TreeNode {
  type: TreeNodeType.ImportMember;
  nameNode: IdentifierTreeNode | null;
  aliasNode: IdentifierTreeNode | null;
}

export interface ImportTreeNode extends TreeNode {
  type: TreeNodeType.Import;
  memberNodes: ImportMemberTreeNode[];
  sourceNode: LiteralExpressionTreeNode | null;
}

export interface VariableDeclarationStatementTreeNode extends TreeNode {
  type: TreeNodeType.VariableDeclarationStatement;
  nameNode: IdentifierTreeNode | null;
  typeAnnotationNode: TypeAnnotationTreeNode | null;
  initializerNode: ExpressionTreeNode | null;
  isConstant: boolean;
  modifiers: TreeModifier[];
}

export interface IfStatementTreeNode extends TreeNode {
  type: TreeNodeType.IfStatement;
  conditionNode: ExpressionTreeNode | null;
  thenBlockNode: BasicBlockTreeNode | null;
  elseBlockNode: BasicBlockTreeNode | null;
}

export interface StructFieldTreeNode extends TreeNode {
  type: TreeNodeType.StructField;
  nameNode: IdentifierTreeNode | null;
  typeAnnotationNode: TypeAnnotationTreeNode | null;
}

export interface StructTreeNode extends TreeNode {
  type: TreeNodeType.Struct;
  nameNode: IdentifierTreeNode | null;
  fieldNodes: StructFieldTreeNode[];
  modifiers: TreeModifier[];
}

export interface DirectiveTreeNode extends TreeNode {
  type: TreeNodeType.Directive;
  nameNode: IdentifierTreeNode | null;
  argumentNodes: ExpressionTreeNode[];
}

export interface ExternTreeNode extends TreeNode {
  type: TreeNodeType.Extern;
  nameNode: IdentifierTreeNode | null;
  argumentNodes: TypeAnnotationTreeNode[];
  typeAnnotationNode: TypeAnnotationTreeNode | null;
}

export interface ExtendTreeNode extends TreeNode {
  type: TreeNodeType.Extend;
  nameNode: IdentifierTreeNode | null;
  structExpressionNode: StructLiteralExpressionTreeNode | null;
}
