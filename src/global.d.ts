declare class Connect {
  constructor(options: {
    app_id: string;
    p_key: string;
    type: string;
    config: { widget_id: string };
    metadata?: Record<string, string>;
    user_data?: Record<string, string>;
    onSuccess?: (response: unknown) => void;
    onError?: (error: unknown) => void;
    onClose?: () => void;
  });
  setup(): void;
  open(): void;
}
