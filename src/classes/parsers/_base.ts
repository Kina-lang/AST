import type { BaseToken } from "@kina-lang/lexer";
import type { BaseNode } from "../nodes/_base";
import type { TokenStream } from "../TokenStream";

export abstract class BaseParser {
  abstract canParse(tokenStream: TokenStream): boolean;
  abstract parse(tokenStream: TokenStream): BaseNode[];
}
