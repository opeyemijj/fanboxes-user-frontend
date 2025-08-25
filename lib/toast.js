import { toast } from "sonner";

// Success toast
export const toastSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    ...options,
  });
};

// Error toast
export const toastError = (message, options = {}) => {
  return toast.error(message, {
    duration: 6000,
    ...options,
  });
};

// Info toast
export const toastInfo = (message, options = {}) => {
  return toast.info(message, {
    duration: 4000,
    ...options,
  });
};

// Warning toast
export const toastWarning = (message, options = {}) => {
  return toast.warning(message, {
    duration: 5000,
    ...options,
  });
};

// Custom toast
export const toastCustom = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    ...options,
  });
};

// Loading toast (returns a function to update/close)
export const toastLoading = (message, options = {}) => {
  return toast.loading(message, {
    duration: Infinity, // Stays until manually closed
    ...options,
  });
};

// Export the raw toast function as well
export { toast };
