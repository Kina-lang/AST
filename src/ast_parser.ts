import {
  EKinaLexerTokenKind,
  type IKinaLexerTokenDefinition,
  type IKinaLexerTokenKindLiteral,
  type IKinaLexerTokenKindType,
} from "@kina-lang/lexer";
import { KinaASTTokenStream } from "./ast_token_stream";
import { KinaASTNode } from "./nodes/_node";
import { KinaASTFunctionDeclarationNode } from "./nodes/functionDeclaration";
import { KinaASTParameterDeclarationNode } from "./nodes/parameterDeclaration";
import { KinaASTBlockStatementNode } from "./nodes/blockStatement";
import type {
  IKinaASTExpressionNode,
  IKinaASTStatementNode,
} from "./types/ast";
import { KinaASTExpressionStatementNode } from "./nodes/expressionStatement";
import { KinaASTReturnStatementNode } from "./nodes/returnStatement";
import { KinaASTLiteralExpressionNode } from "./nodes/literalExpression";
import { KinaASTVariableAccessNode } from "./nodes/variableAccess";
import { KinaASTCallExpressionNode } from "./nodes/callExpression";
import { KinaASTMemberAccessNode } from "./nodes/memberAccess";
import { KinaASTExternDeclarationNode } from "./nodes/externDeclaration";
import { KinaASTIncludeDirectiveNode } from "./nodes/includeDirective";

export class KinaASTParser {
  private readonly tokenStream: KinaASTTokenStream;
  private readonly fileName: string;

  private static readonly TYPE_TOKEN_KINDS = new Set([
    EKinaLexerTokenKind.TypeInt32,
    EKinaLexerTokenKind.TypeString,
    EKinaLexerTokenKind.TypeBool,
  ]);
  private static readonly LITERAL_TOKEN_KINDS = new Set([
    EKinaLexerTokenKind.LiteralInt,
    EKinaLexerTokenKind.LiteralFloat,
    EKinaLexerTokenKind.LiteralString,
    EKinaLexerTokenKind.LiteralBool,
  ]);
  private static readonly PRECEDENCE = {
    LOWEST: 0,
    SUM: 10, // + -
    PRODUCT: 20, // * /
    CALL: 30, // myFunction()
    MEMBER_ACCESS: 40, // object.property
  } as const;

  constructor(tokens: IKinaLexerTokenDefinition[], fileName?: string) {
    this.fileName = fileName ?? "anonymous";
    this.tokenStream = new KinaASTTokenStream(tokens, this.fileName);
  }

  public async parse() {
    const ast: KinaASTNode[] = [];

    while (!this.tokenStream.isAtEnd()) {
      const node = this.parseTopLevelDeclaration();
      if (node) ast.push(node);
    }

    return ast;
  }

  private parseTopLevelDeclaration(): KinaASTNode | null {
    const token = this.tokenStream.peek();
    if (!token) return null;

    switch (token.kind) {
      case EKinaLexerTokenKind.KeywordFunction:
        return this.parseFunctionDeclaration();
      case EKinaLexerTokenKind.KeywordExtern:
        return this.parseExternDeclaration();
      case EKinaLexerTokenKind.DirectiveInclude:
        return this.parseIncludeDirective();
      default:
        throw new Error(
          `Unexpected token "${token.kind}" at top level. ${this.fileName}:${token.line + 1}:${token.col + 1}`,
        );
    }
  }

  private parseFunctionDeclaration(): KinaASTFunctionDeclarationNode | null {
    this.tokenStream.expect(EKinaLexerTokenKind.KeywordFunction);

    // name of the function
    const identifierToken = this.tokenStream.expect(
      EKinaLexerTokenKind.Identifier,
    );

    this.tokenStream.expect(EKinaLexerTokenKind.ParentheseOpen);

    // parameters of the function
    const parameters = this.parseParameterDeclarations();

    this.tokenStream.expect(EKinaLexerTokenKind.ParentheseClose);
    this.tokenStream.expect(EKinaLexerTokenKind.Colon);

    // return type of the function
    const type = this.parseTypeIdentifier();

    this.tokenStream.expect(EKinaLexerTokenKind.BraceOpen);

    // body of the function
    const body = this.parseBlockStatement();

    this.tokenStream.expect(EKinaLexerTokenKind.BraceClose);

    return new KinaASTFunctionDeclarationNode(
      identifierToken.value,
      parameters ?? [],
      type,
      body ?? new KinaASTBlockStatementNode([]),
    );
  }

  private parseExternDeclaration(): KinaASTExternDeclarationNode {
    this.tokenStream.expect(EKinaLexerTokenKind.KeywordExtern);

    // name of the function
    const identifierToken = this.tokenStream.expect(
      EKinaLexerTokenKind.Identifier,
    );

    this.tokenStream.expect(EKinaLexerTokenKind.ParentheseOpen);

    // parameters of the function
    const parameterTypeTokens: IKinaLexerTokenDefinition[] = [];

    while (true) {
      const token = this.tokenStream.peek();
      if (!token || token.kind == EKinaLexerTokenKind.EOF) break;
      if (!this.isTypeToken(token)) break;

      parameterTypeTokens.push(token);
      this.tokenStream.advance();

      break;
    }

    this.tokenStream.expect(EKinaLexerTokenKind.ParentheseClose);
    this.tokenStream.expect(EKinaLexerTokenKind.Colon);

    // return type of the function
    const type = this.parseTypeIdentifier();

    this.tokenStream.expect(EKinaLexerTokenKind.Semicolon);

    return new KinaASTExternDeclarationNode(
      identifierToken.value,
      parameterTypeTokens.map((p) => p.kind as IKinaLexerTokenKindType),
      type,
    );
  }

  private parseIncludeDirective(): KinaASTIncludeDirectiveNode {
    this.tokenStream.expect(EKinaLexerTokenKind.DirectiveInclude);
    this.tokenStream.expect(EKinaLexerTokenKind.ParentheseOpen);

    const argToken = this.tokenStream.advance();
    if (!argToken || !this.isLiteralToken(argToken))
      throw new Error("Invalid directive argument");

    this.tokenStream.expect(EKinaLexerTokenKind.ParentheseClose);

    return new KinaASTIncludeDirectiveNode(
      new KinaASTLiteralExpressionNode(
        argToken.kind as IKinaLexerTokenKindLiteral,
        argToken.value,
      ),
    );
  }

  private parseParameterDeclarations():
    | KinaASTParameterDeclarationNode[]
    | null {
    const nodes: KinaASTParameterDeclarationNode[] = [];

    while (!this.tokenStream.isAtEnd()) {
      const token = this.tokenStream.peek()!;

      // If does not start with identifier, we have reached end -> break
      if (token.kind != EKinaLexerTokenKind.Identifier) break;

      const parameter = this.parseParameterDeclaration();
      if (!parameter) break;

      nodes.push(parameter);

      // If there is not comma after it, we have reached end -> break
      // moves cursor if there is command, so that we can start with next parameter
      const hasComma = this.tokenStream.match(EKinaLexerTokenKind.Comma);
      if (!hasComma) break;
    }

    return nodes;
  }

  private parseParameterDeclaration(): KinaASTParameterDeclarationNode | null {
    // name of the parameter
    const identifierToken = this.tokenStream.expect(
      EKinaLexerTokenKind.Identifier,
    );

    this.tokenStream.expect(EKinaLexerTokenKind.Colon);

    // type of the parameter
    const type = this.parseTypeIdentifier();

    return new KinaASTParameterDeclarationNode(identifierToken.value, type);
  }

  private parseBlockStatement(): KinaASTBlockStatementNode | null {
    const nodes: IKinaASTStatementNode[] = [];

    while (!this.tokenStream.isAtEnd()) {
      const token = this.tokenStream.peek();

      // If there is no node or it's closing brace, we have reached the end -> break
      if (!token) break;
      if (token.kind == EKinaLexerTokenKind.BraceClose) break;

      const node = this.parseStatement();
      if (!node) continue; // TODO: maybe we should break instead?

      nodes.push(node);
    }

    return new KinaASTBlockStatementNode(nodes);
  }

  private parseStatement(): IKinaASTStatementNode | null {
    const token = this.tokenStream.peek();
    if (!token) return null; // EOF

    switch (token.kind) {
      case EKinaLexerTokenKind.KeywordFunction:
        return this.parseFunctionDeclaration();
      case EKinaLexerTokenKind.KeywordReturn:
        return this.parseReturnStatement();
      default:
        const expression = this.parseExpression();
        if (!expression) return null;

        this.tokenStream.expect(EKinaLexerTokenKind.Semicolon);

        return new KinaASTExpressionStatementNode(expression);
    }
  }

  private parseExpression(
    precedence: number = KinaASTParser.PRECEDENCE.LOWEST,
  ): IKinaASTExpressionNode {
    const token = this.tokenStream.advance()!;
    let left = this.parseExpressionPrefix(token);

    while (precedence < this.getPrecedence(this.tokenStream.peek())) {
      const operatorToken = this.tokenStream.advance()!;
      left = this.parseExpressionInfix(left, operatorToken);
    }

    return left;
  }

  private parseExpressionPrefix(
    token: IKinaLexerTokenDefinition,
  ): IKinaASTExpressionNode {
    if (this.isLiteralToken(token))
      return new KinaASTLiteralExpressionNode(
        token.kind as IKinaLexerTokenKindLiteral,
        token.value,
      );
    else if (token.kind == EKinaLexerTokenKind.Identifier)
      return new KinaASTVariableAccessNode(token.value);
    else if (token.kind == EKinaLexerTokenKind.ParentheseOpen) {
      // Parenthese processing: (3 + 4) * 2
      const expression = this.parseExpression(KinaASTParser.PRECEDENCE.LOWEST);

      this.tokenStream.expect(EKinaLexerTokenKind.ParentheseClose);

      return expression;
    }

    throw new Error(
      `Invalid token "${token.kind}" in expression. ${this.fileName}:${token.line + 1}:${token.col + 1}`,
    );
  }

  private parseExpressionInfix(
    left: IKinaASTExpressionNode,
    operator: IKinaLexerTokenDefinition,
  ): IKinaASTExpressionNode {
    switch (operator.kind) {
      case EKinaLexerTokenKind.ParentheseOpen:
        const args = this.parseCallArguments();

        this.tokenStream.expect(EKinaLexerTokenKind.ParentheseClose);

        return new KinaASTCallExpressionNode(left, args);

      case EKinaLexerTokenKind.Dot:
        const propertyToken = this.tokenStream.expect(
          EKinaLexerTokenKind.Identifier,
        );

        return new KinaASTMemberAccessNode(left, propertyToken.value);

      default:
        return left;

      // case for plus
      // return new KinaASTBinaryExpressionNode(left, operator.kind, this.parseExpression(Precedence.SUM))
    }
  }

  private parseCallArguments(): IKinaASTExpressionNode[] {
    const args: IKinaASTExpressionNode[] = [];

    const token = this.tokenStream.peek();
    if (!token || token.kind == EKinaLexerTokenKind.ParentheseClose)
      return args;

    while (true) {
      args.push(this.parseExpression(KinaASTParser.PRECEDENCE.LOWEST));

      if (!this.tokenStream.match(EKinaLexerTokenKind.Comma)) break;
    }

    return args;
  }

  private parseReturnStatement(): KinaASTReturnStatementNode | null {
    this.tokenStream.expect(EKinaLexerTokenKind.KeywordReturn);

    let value: IKinaASTExpressionNode | null = null;

    const nextToken = this.tokenStream.peek();
    if (nextToken && nextToken.kind != EKinaLexerTokenKind.Semicolon)
      value = this.parseExpression();

    this.tokenStream.expect(EKinaLexerTokenKind.Semicolon);

    return new KinaASTReturnStatementNode(value);
  }

  private parseTypeIdentifier(): IKinaLexerTokenKindType {
    const token = this.tokenStream.peek();
    if (!token)
      throw new Error(
        `Expected type identifier, but reached EOF. ${this.fileName}`,
      );

    if (!this.isTypeToken(token))
      throw new Error(
        `Expected a type, but got "${token.kind}" at ${this.fileName}:${token.line + 1}:${token.col + 1}`,
      );

    this.tokenStream.advance();
    return token.kind as IKinaLexerTokenKindType;
  }

  private isTypeToken(token: IKinaLexerTokenDefinition): boolean {
    if (KinaASTParser.TYPE_TOKEN_KINDS.has(token.kind)) return true;
    return false;
  }

  private isLiteralToken(token: IKinaLexerTokenDefinition): boolean {
    if (KinaASTParser.LITERAL_TOKEN_KINDS.has(token.kind)) return true;
    return false;
  }

  private getPrecedence(token: IKinaLexerTokenDefinition | null): number {
    if (!token) return KinaASTParser.PRECEDENCE.LOWEST;

    switch (token.kind) {
      /*case EKinaLexerTokenKind.Plus:
      case EKinaLexerTokenKind.Minus:
        return Precedence.SUM;

      case EKinaLexerTokenKind.Asterisk:
      case EKinaLexerTokenKind.Slash:
        return Precedence.PRODUCT;*/

      case EKinaLexerTokenKind.ParentheseOpen:
        // Parentheses has highest precedence because it starts function call
        return KinaASTParser.PRECEDENCE.CALL;

      case EKinaLexerTokenKind.Dot:
        return KinaASTParser.PRECEDENCE.MEMBER_ACCESS;

      default:
        return KinaASTParser.PRECEDENCE.LOWEST;
    }
  }
}
