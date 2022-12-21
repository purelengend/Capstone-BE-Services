export const difference = (a: any[], b: any[]) => {
    a = a.map(x => x.toString());
    b = b.map(x => x.toString());
    const s = new Set(b);
    return a.filter(x => !s.has(x));
}