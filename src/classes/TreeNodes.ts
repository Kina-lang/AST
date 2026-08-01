import type { LexerToken, LexerTokenType } from "@kina-lang/lexer";
import type { TreeSpan } from "../types/span";
import {
  TreeNodeType,
  type BasicBlockTreeNode,
  type FileTreeNode,
  type FunctionParameterTreeNode,
  type FunctionTreeNode,
  type IdentifierTreeNode,
  type ReturnStatementTreeNode,
  type TreeNode,
  type TypeAnnotationTreeNode,
  type ExpressionTreeNode,
  type BinaryExpressionTreeNode,
  type IdentifierAccessExpressionTreeNode,
  type ExpressionStatementTreeNode,
  type LiteralExpressionTreeNode,
  type ImportMemberTreeNode,
  type ImportTreeNode,
  type VariableDeclarationStatementTreeNode,
  type IfStatementTreeNode,
  type CallExpressionTreeNode,
  type MemberAccessExpressionTreeNode,
  type UnaryExpressionTreeNode,
  type GroupExpressionTreeNode,
  type StructTreeNode,
  type StructFieldTreeNode,
  type ExternTreeNode,
  type DirectiveTreeNode,
  type FunctionTypeAnnotationTreeNode,
  type StructLiteralExpressionFieldTreeNode,
  type StructLiteralExpressionTreeNode,
  type ExtendTreeNode,
} from "../types/tree";
import type { TreeLiteralType } from "../types/type";
import type { TreeModifier } from "../types/modifier";

export class TreeNodes {
  public static createFileNode(
    nodes: TreeNode[],
    span: TreeSpan,
  ): FileTreeNode {
    return {
      type: TreeNodeType.File,
      nodes,
      span,
    };
  }

  public static createFunctionNode(
    nameNode: IdentifierTreeNode | null,
    parameterNodes: FunctionParameterTreeNode[],
    typeAnnotationNode: TypeAnnotationTreeNode | null,
    bodyNode: BasicBlockTreeNode | null,
    modifiers: TreeModifier[],
    span: TreeSpan,
  ): FunctionTreeNode {
    return {
      type: TreeNodeType.Function,
      nameNode,
      parameterNodes,
      typeAnnotationNode,
      bodyNode,
      modifiers,
      span,
    };
  }

  public static createFunctionParameterNode(
    nameNode: IdentifierTreeNode | null,
    typeAnnotationNode: TypeAnnotationTreeNode | null,
    span: TreeSpan,
  ): FunctionParameterTreeNode {
    return {
      type: TreeNodeType.FunctionParameter,
      nameNode,
      typeAnnotationNode,
      span,
    };
  }

  public static createNamedTypeAnnotationNode(
    nameNode: IdentifierTreeNode,
    span: TreeSpan,
  ): TypeAnnotationTreeNode {
    return {
      type: TreeNodeType.NamedTypeAnnotation,
      nameNode,
      span,
    };
  }

  public static createFunctionTypeAnnotationNode(
    parameterTypeNodes: TypeAnnotationTreeNode[],
    returnTypeNode: TypeAnnotationTreeNode | null,
    span: TreeSpan,
  ): FunctionTypeAnnotationTreeNode {
    return {
      type: TreeNodeType.FunctionTypeAnnotation,
      parameterTypeNodes,
      returnTypeNode,
      span,
    };
  }

  public static createBasicBlock(
    nodes: TreeNode[],
    span: TreeSpan,
  ): BasicBlockTreeNode {
    return {
      type: TreeNodeType.BasicBlock,
      nodes,
      span,
    };
  }

  public static createReturnStatementNode(
    expressionNode: ExpressionTreeNode | null,
    span: TreeSpan,
  ): ReturnStatementTreeNode {
    return {
      type: TreeNodeType.ReturnStatement,
      expressionNode: expressionNode,
      span,
    };
  }

  public static createExpressionStatementNode(
    expressionNode: ExpressionTreeNode | null,
    span: TreeSpan,
  ): ExpressionStatementTreeNode {
    return {
      type: TreeNodeType.ExpressionStatement,
      expressionNode: expressionNode,
      span,
    };
  }

  public static createBinaryExpressionNode(
    leftNode: ExpressionTreeNode | null,
    operatorToken: LexerTokenType,
    rightNode: ExpressionTreeNode | null,
    span: TreeSpan,
  ): BinaryExpressionTreeNode {
    return {
      type: TreeNodeType.BinaryExpression,
      leftNode,
      operatorToken,
      rightNode,
      span,
    };
  }

  public static createIdentifierAccessExpressionNode(
    identifierNode: IdentifierTreeNode | null,
    span: TreeSpan,
  ): IdentifierAccessExpressionTreeNode {
    return {
      type: TreeNodeType.IdentifierAccessExpression,
      identifierNode,
      span,
    };
  }

  public static createLiteralExpressionNode(
    literalType: TreeLiteralType,
    value: string,
    span: TreeSpan,
  ): LiteralExpressionTreeNode {
    return {
      type: TreeNodeType.LiteralExpression,
      literalType,
      value,
      span,
    };
  }

  public static createImportMemberNode(
    nameNode: IdentifierTreeNode | null,
    aliasNode: IdentifierTreeNode | null,
    span: TreeSpan,
  ): ImportMemberTreeNode {
    return {
      type: TreeNodeType.ImportMember,
      nameNode,
      aliasNode,
      span,
    };
  }

  public static createImportNode(
    memberNodes: ImportMemberTreeNode[],
    sourceNode: LiteralExpressionTreeNode | null,
    span: TreeSpan,
  ): ImportTreeNode {
    return {
      type: TreeNodeType.Import,
      memberNodes,
      sourceNode,
      span,
    };
  }

  public static createVariableDeclarationStatementNode(
    nameNode: IdentifierTreeNode | null,
    typeAnnotationNode: TypeAnnotationTreeNode | null,
    initializerNode: ExpressionTreeNode | null,
    isConstant: boolean,
    modifiers: TreeModifier[],
    span: TreeSpan,
  ): VariableDeclarationStatementTreeNode {
    return {
      type: TreeNodeType.VariableDeclarationStatement,
      nameNode,
      typeAnnotationNode,
      initializerNode,
      isConstant,
      modifiers,
      span,
    };
  }

  public static createIfStatementNode(
    conditionNode: ExpressionTreeNode | null,
    thenBlockNode: BasicBlockTreeNode | null,
    elseBlockNode: BasicBlockTreeNode | null,
    span: TreeSpan,
  ): IfStatementTreeNode {
    return {
      type: TreeNodeType.IfStatement,
      conditionNode,
      thenBlockNode,
      elseBlockNode,
      span,
    };
  }

  public static createMemberAccessExpressionNode(
    objectNode: ExpressionTreeNode | null,
    propertyNode: IdentifierTreeNode | null,
    span: TreeSpan,
  ): MemberAccessExpressionTreeNode {
    return {
      type: TreeNodeType.MemberAccessExpression,
      objectNode,
      propertyNode,
      span,
    };
  }

  public static createCallExpressionNode(
    calleeNode: ExpressionTreeNode | null,
    argumentNodes: ExpressionTreeNode[],
    span: TreeSpan,
  ): CallExpressionTreeNode {
    return {
      type: TreeNodeType.CallExpression,
      calleeNode,
      argumentNodes,
      span,
    };
  }

  public static createUnaryExpressionNode(
    operatorToken: LexerTokenType,
    operandNode: ExpressionTreeNode | null,
    span: TreeSpan,
  ): UnaryExpressionTreeNode {
    return {
      type: TreeNodeType.UnaryExpression,
      operatorToken,
      operandNode,
      span,
    };
  }

  public static createGroupExpressionNode(
    expressionNode: ExpressionTreeNode | null,
    span: TreeSpan,
  ): GroupExpressionTreeNode {
    return {
      type: TreeNodeType.GroupExpression,
      expressionNode,
      span,
    };
  }

  public static createStructFieldNode(
    nameNode: IdentifierTreeNode | null,
    typeAnnotationNode: TypeAnnotationTreeNode | null,
    span: TreeSpan,
  ): StructFieldTreeNode {
    return {
      type: TreeNodeType.StructField,
      nameNode,
      typeAnnotationNode,
      span,
    };
  }

  public static createStructNode(
    nameNode: IdentifierTreeNode | null,
    fieldNodes: StructFieldTreeNode[],
    modifiers: TreeModifier[],
    span: TreeSpan,
  ): StructTreeNode {
    return {
      type: TreeNodeType.Struct,
      nameNode,
      fieldNodes,
      modifiers,
      span,
    };
  }

  public static createDirectiveNode(
    nameNode: IdentifierTreeNode | null,
    argumentNodes: ExpressionTreeNode[],
    span: TreeSpan,
  ): DirectiveTreeNode {
    return {
      type: TreeNodeType.Directive,
      nameNode,
      argumentNodes,
      span,
    };
  }

  public static createExternNode(
    nameNode: IdentifierTreeNode | null,
    argumentNodes: TypeAnnotationTreeNode[],
    typeAnnotationNode: TypeAnnotationTreeNode | null,
    span: TreeSpan,
  ): ExternTreeNode {
    return {
      type: TreeNodeType.Extern,
      nameNode,
      argumentNodes,
      typeAnnotationNode,
      span,
    };
  }

  public static createStructLiteralExpressionNode(
    fieldNodes: StructLiteralExpressionFieldTreeNode[],
    span: TreeSpan,
  ): StructLiteralExpressionTreeNode {
    return {
      type: TreeNodeType.StructLiteralExpression,
      fieldNodes,
      span,
    };
  }

  public static createStructLiteralExpressionFieldNode(
    nameNode: IdentifierTreeNode | null,
    expressionNode: ExpressionTreeNode | null,
    span: TreeSpan,
  ): StructLiteralExpressionFieldTreeNode {
    return {
      type: TreeNodeType.StructLiteralExpressionField,
      nameNode,
      expressionNode,
      span,
    };
  }

  public static createExtendNode(
    nameNode: IdentifierTreeNode | null,
    structExpressionNode: StructLiteralExpressionTreeNode | null,
    span: TreeSpan,
  ): ExtendTreeNode {
    return {
      type: TreeNodeType.Extend,
      nameNode,
      structExpressionNode,
      span,
    };
  }

  public static tokenToIdentifierNode(
    token: LexerToken | null,
  ): IdentifierTreeNode | null {
    if (!token) return null;

    return {
      type: TreeNodeType.Identifier,
      name: token.value,
      span: token.span,
    };
  }

  public static mergeSpans(...spans: (TreeSpan | null)[]): TreeSpan {
    let validSpans = spans.filter((s): s is TreeSpan => !!s);

    if (validSpans.length === 0) validSpans = [this.zeroSpan];

    return {
      start: Math.min(...validSpans.map((s) => s.start)),
      end: Math.max(...validSpans.map((s) => s.end)),
      startPosition: validSpans.reduce((min, span) =>
        span.start < min.start ? span : min,
      ).startPosition,
      endPosition: validSpans.reduce((max, span) =>
        span.end > max.end ? span : max,
      ).endPosition,
    };
  }

  public static get zeroSpan(): TreeSpan {
    return {
      start: 0,
      end: 0,
      startPosition: { line: 0, column: 0 },
      endPosition: { line: 0, column: 0 },
    };
  }
}
