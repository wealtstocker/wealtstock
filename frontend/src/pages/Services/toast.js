import Swal from 'sweetalert2';

const showToast = (icon = 'info', title = 'Info') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
};

const toast = {
  success: (msg) => showToast('success', msg),
  error: (msg) => showToast('error', msg),
  warning: (msg) => showToast('warning', msg),
  info: (msg) => showToast('info', msg),
};

export default toast;

