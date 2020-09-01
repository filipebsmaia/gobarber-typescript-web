import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedUseLocation = jest.fn();

const mockedSignOut = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => mockedUseLocation(),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      singOut: mockedSignOut,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUseLocation.mockClear();
  });

  it('should be able to change password', async () => {
    apiMock.onPost('password/reset').reply(200, {});
    mockedUseLocation.mockImplementation(() => ({
      search: '?token=valid-token',
    }));

    const { getByPlaceholderText, getByTestId } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    const buttonElement = getByTestId('button-container');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedUseLocation).toHaveBeenCalled();
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to change password if password confirmation are incorrect', async () => {
    apiMock.onPost('password/reset').reply(200, {});
    mockedUseLocation.mockImplementation(() => ({
      search: '?token=valid-token',
    }));

    const { getByPlaceholderText, getByTestId } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    const buttonElement = getByTestId('button-container');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'an-different-password' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedUseLocation).toHaveBeenCalled();
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if forgot password request fails', async () => {
    apiMock.onPost('password/reset').reply(400, {});
    mockedUseLocation.mockImplementation(() => ({
      search: '',
    }));

    const { getByPlaceholderText, getByTestId } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );

    const buttonElement = getByTestId('button-container');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
