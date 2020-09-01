import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      data-testid={`toast-${message.id}`}
      type={message.type}
      hasdescription={Number(!!message.description)}
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
        <strong data-testid={`toast-${message.id}-title`}>
          {message.title}
        </strong>
        {message.description && (
          <p data-testid={`toast-${message.id}-description`}>
            {message.description}
          </p>
        )}
      </div>

      <button
        data-testid={`toast-${message.id}-button`}
        onClick={() => removeToast(message.id)}
        type="button"
      >
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
