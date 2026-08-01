export type TreePosition = {
  line: number;
  column: number;
};

export type TreeSpan = {
  start: number;
  end: number;

  startPosition: TreePosition;
  endPosition: TreePosition;
};
