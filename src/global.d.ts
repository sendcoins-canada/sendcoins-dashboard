declare namespace JSX {
  interface IntrinsicElements {
    "metamap-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      clientid?: string;
      flowid?: string;
    };
  }
}
