export const bench = <T>(funcName: string, callback: () => T) => {
    const p1 = performance.now();
    const result = callback();
    const p2 = performance.now();
    console.log(`${funcName} (${(p2-p1).toFixed(2)}ms)`);
    return result;
};