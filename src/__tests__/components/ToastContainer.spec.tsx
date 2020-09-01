import React from 'react';
import { render } from '@testing-library/react';
import ToastContainer from '../../components/ToastContainer';

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Toast component', () => {
  it('should be able to show toast container', () => {
    const { getByTestId } = render(
      <ToastContainer
        messages={[
          {
            id: '1',
            type: 'info',
            title: 'Title',
            description: 'Description',
          },
        ]}
      />,
    );

    const toastElement = getByTestId('toast-1');
    const titleElement = getByTestId('toast-1-title');
    const descriptionElement = getByTestId('toast-1-description');

    expect(toastElement).toBeTruthy();
    expect(titleElement).toHaveTextContent('Title');
    expect(descriptionElement).toHaveTextContent('Description');
  });
});
