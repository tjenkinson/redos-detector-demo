export function sequence(start: number, end: number): number[] {
  const res: number[] = [];
  for (let i = start; i < end; i++) {
    res.push(i);
  }
  return res;
}
