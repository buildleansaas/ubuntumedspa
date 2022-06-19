export function isEmpty(obj: any) {
  return (
    Object.prototype.toString.call(obj) === "[object Object]" &&
    JSON.stringify(obj) === "{}"
  );
}
