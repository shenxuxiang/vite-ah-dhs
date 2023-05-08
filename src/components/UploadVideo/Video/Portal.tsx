import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function createElement() {
  return document.createElement("div");
}

function Portal(props: any) {
  const [state] = useState(createElement);
  useEffect(() => {
    document.body.appendChild(state);

    return () => {
      document.body.removeChild(state);
    };
  }, []);

  return createPortal(props.children, state);
}

export default memo(Portal);
