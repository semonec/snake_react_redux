import { useEffect, useRef } from "react";

export const useCompare = (val: any) => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

export const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
