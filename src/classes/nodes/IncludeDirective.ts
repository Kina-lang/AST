import { NodeKind, type NodeSpan } from "../../types/nodes";
import { BaseNode } from "./_base";

export class IncludeDirectiveNode extends BaseNode {
  protected readonly _path: string;

  constructor(span: NodeSpan, path: string) {
    super(NodeKind.IncludeDirective, span);
    this._path = path;
  }

  public get path(): string {
    return this._path;
  }

  public override export(): ReturnType<BaseNode["export"]> & {
    path: string;
  } {
    const baseExport = super.export();

    return {
      ...baseExport,
      path: this.path,
    };
  }
}
