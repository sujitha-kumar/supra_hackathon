type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastHandler = (message: string, type: ToastType) => void;

let _handler: ToastHandler | null = null;

export function registerGlobalToastHandler(fn: ToastHandler): void {
  _handler = fn;
}

export function emitToast(message: string, type: ToastType = 'error'): void {
  _handler?.(message, type);
}
