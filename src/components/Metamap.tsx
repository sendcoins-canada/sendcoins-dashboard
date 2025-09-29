import React, { useEffect, useRef, useState } from "react";

interface MetaMapVerifyProps {
  clientId: string;
  flowId: string;
  onSuccess: (detail: unknown) => void;
  onExit: (detail: unknown) => void;
}

const MetaMapVerify: React.FC<MetaMapVerifyProps> = ({
  clientId,
  flowId,
  onSuccess,
  onExit,
}) => {
  const buttonRef = useRef<HTMLElement | null>(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buttonEl = buttonRef.current;

    if (!buttonEl) return;

       // When SDK is mounted, stop loader
    const readyHandler = () => {
      setLoading(false);
    };

    const userFinishedHandler = (event: Event) => {
      const customEvent = event as CustomEvent<unknown>;
      onSuccess(customEvent.detail);
    };

    const exitedHandler = (event: Event) => {
      const customEvent = event as CustomEvent<unknown>;
      onExit(customEvent.detail);
    };

      buttonEl.addEventListener("load", readyHandler);
    buttonEl.addEventListener("metamap:userFinishedSdk", userFinishedHandler);
    buttonEl.addEventListener("metamap:exitedSdk", exitedHandler);

    return () => {
       buttonEl.removeEventListener("load", readyHandler);
      buttonEl.removeEventListener("metamap:userFinishedSdk", userFinishedHandler);
      buttonEl.removeEventListener("metamap:exitedSdk", exitedHandler);
    };
  }, [onSuccess, onExit]);

    return (
    <div>
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading verification...</span>
        </div>
      )}
{/* @ts-ignore */}
      <metamap-button
        ref={buttonRef}
        clientid={clientId}
        flowid={flowId}
        style={{ display: loading ? "none" : "block" }}
      >
        {/* @ts-ignore */}
      </metamap-button>
    </div>
  );
};

export default MetaMapVerify;
