import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Toast from '../../components/ToastContainer/Toast';

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Toast component', () => {
  it('should be able to show toast', () => {
    const { getByTestId } = render(
      <Toast
        message={{
          id: '1',
          type: 'info',
          title: 'Title',
          description: 'Description',
        }}
        style={{}}
      />,
    );

    const toastElement = getByTestId('toast-1');
    const titleElement = getByTestId('toast-1-title');
    const descriptionElement = getByTestId('toast-1-description');

    expect(toastElement).toBeTruthy();
    expect(titleElement).toHaveTextContent('Title');
    expect(descriptionElement).toHaveTextContent('Description');
  });

  it('should be able to remove toast', () => {
    const { getByTestId } = render(
      <Toast
        message={{
          id: '1',
          type: 'info',
          title: 'Title',
          description: 'Description',
        }}
        style={{}}
      />,
    );

    const buttonElement = getByTestId('toast-1-button');
    fireEvent.click(buttonElement);

    expect(mockedRemoveToast).toBeCalled();
  });
});
