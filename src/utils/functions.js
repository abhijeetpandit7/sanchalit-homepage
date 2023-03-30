const isNull = (value) => value === null;

export const isObjectEmpty = (obj) =>
  isNull(obj)
    ? true
    : typeof obj === "object"
    ? Object.keys(obj).length === 0
    : true;

export const removeRefClassName = (ref, className) =>
  ref.current
    ? ref.current.classList.remove(className)
    : ref.classList.remove(className);
