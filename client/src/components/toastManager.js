import React from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';

let toastContainer = null;

const createToastContainer = () => {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
};

const toast = {
  show: (message, type) => {
    if (!toastContainer) {
      toastContainer = createToastContainer();
    }

    const toastElement = document.createElement('div');
    toastContainer.appendChild(toastElement);

    const handleClose = () => {
      ReactDOM.unmountComponentAtNode(toastElement);
      toastContainer.removeChild(toastElement);
    };

    ReactDOM.render(
      <Toast message={message} type={type} onClose={handleClose} />,
      toastElement
    );
  },
  success: (message) => toast.show(message, 'success'),
  error: (message) => toast.show(message, 'error'),
};

export default toast;