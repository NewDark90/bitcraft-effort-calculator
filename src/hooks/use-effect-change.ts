import { useEffect, useRef } from "react";

/** Same as useEffect, but with a function reference that will be updated with the new action that gets sent. */
export const useEffectChange: typeof useEffect = (action, deps) => {
    const actionRef = useRef(action);
    actionRef.current = action;
    useEffect(() => {
        return actionRef.current();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, (deps || []));  
}