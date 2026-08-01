import { LexerTokenType } from "@kina-lang/lexer";
import type { LiteralExpressionTreeNode } from "../../../../types/tree";
import type { TreeContext } from "../../../TreeContext";
import type { PrefixExpressionNodeParser } from "../ExpressionParser";
import { TreeLiteralType } from "../../../../types/type";
import { TreeNodes } from "../../../TreeNodes";
import { Diagnostics } from "@kina-lang/utils";

export const LiteralTokenTypes = [
  LexerTokenType.String,
  LexerTokenType.Int,
  LexerTokenType.Float,
  LexerTokenType.KeywordTrue,
  LexerTokenType.KeywordFalse,
  LexerTokenType.KeywordNull,
];

export class LiteralExpressionParser implements PrefixExpressionNodeParser<LiteralExpressionTreeNode> {
  parse(ctx: TreeContext): LiteralExpressionTreeNode | null {
    const literal = ctx.scanner.expect(...LiteralTokenTypes);
    if (!literal) return null;

    let literalType: TreeLiteralType | null = null;
    switch (literal.type) {
      case LexerTokenType.String:
        literalType = TreeLiteralType.String;
        break;
      case LexerTokenType.Int:
        literalType = TreeLiteralType.Integer;
        break;
      case LexerTokenType.Float:
        literalType = TreeLiteralType.Float;
        break;
      case LexerTokenType.KeywordTrue:
      case LexerTokenType.KeywordFalse:
        literalType = TreeLiteralType.Boolean;
        break;
      case LexerTokenType.KeywordNull:
        literalType = TreeLiteralType.Null;
        break;
      default:
        Diagnostics.throwInternal(
          `Unexpected literal token type: ${literal.type}`,
        );
    }

    return TreeNodes.createLiteralExpressionNode(
      literalType,
      literal.value,
      literal.span,
    );
  }
}
