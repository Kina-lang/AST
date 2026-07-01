import type { NodeKind, NodeSpan, NodeSpanExport } from "../../types/nodes";

export abstract class BaseNode {
  private readonly _kind: NodeKind;
  private readonly _span: NodeSpan | null;

  constructor(kind: NodeKind, span: NodeSpan | null = null) {
    this._kind = kind;
    this._span = span;
  }

  public get kind(): NodeKind {
    return this._kind;
  }

  public get span(): NodeSpan | null {
    return this._span;
  }

  public export(): { kind: NodeKind; span?: NodeSpanExport } {
    return {
      kind: this._kind,
      ...(this._span
        ? {
            span: [
              [this._span.start.line, this._span.start.column],
              [this._span.end.line, this._span.end.column],
            ],
          }
        : {}),
    };
  }
}
