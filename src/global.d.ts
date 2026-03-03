import React from "react";

declare namespace JSX {
  interface IntrinsicElements {
    "metamap-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > & {
      clientid?: string;
      flowid?: string;
      metadata?: string;
    };
  }
}
