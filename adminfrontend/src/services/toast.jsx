// src/pages/Services/toast.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Success toast
const success = (message = 'Success') => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3500,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

// ✅ Error toast
const error = (message = 'Something went wrong') => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

// ✅ Info toast
const info = (message = 'Info') => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

// ✅ Warning toast
const warning = (message = 'Warning') => {
  toast.warn(message, {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

const Toast = {
  success,
  error,
  info,
  warning,
};

export default Toast;
