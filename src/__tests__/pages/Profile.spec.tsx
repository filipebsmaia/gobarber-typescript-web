import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import Profile from '../../pages/Profile';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedProfile = jest.fn();
const mockedUpdateUser = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      singIn: mockedProfile,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      updateUser: mockedUpdateUser,
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

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to change name and email', async () => {
    apiMock.onPut('/profile').reply(200, {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const { getByPlaceholderText, getByTestId } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByTestId('button-container');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should be able to change password', async () => {
    apiMock.onPut('/profile').reply(200, {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const { getByPlaceholderText, getByTestId } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');

    const buttonElement = getByTestId('button-container');

    fireEvent.change(oldPasswordField, { target: { value: 'old_password' } });
    fireEvent.change(passwordField, { target: { value: 'new_password' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'new_password' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to change password when old_password is different than user password', async () => {
    apiMock.onPut('/profile').reply(401);

    const { getByPlaceholderText, getByTestId } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');

    const buttonElement = getByTestId('button-container');

    fireEvent.change(oldPasswordField, { target: { value: 'wrong_password' } });
    fireEvent.change(passwordField, { target: { value: 'new_password' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'new_password' },
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

  it('should not be able to change password when password_confirmationis different than password', async () => {
    // mockedProfile.mockImplementation(() => {
    //   throw new Error();
    // });
    apiMock.onPut('/profile').reply(401);

    const { getByPlaceholderText, getByTestId } = render(<Profile />);

    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmar senha');

    const buttonElement = getByTestId('button-container');

    fireEvent.change(oldPasswordField, { target: { value: 'old_password' } });
    fireEvent.change(passwordField, { target: { value: 'new_password' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'different_new_password' },
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

  it('should be able to change user avatar', async () => {
    apiMock.onPatch('users/avatar').reply(200);

    const { getByTestId } = render(<Profile />);

    const inputField = getByTestId('avatar-input');

    const filename = 'awesome-profile-picture.png';
    const file = new File(['awesome-profile-picture'], filename, {
      type: 'image/png',
    });

    fireEvent.change(inputField, {
      target: { files: [file] },
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to change user avatar without an image file', async () => {
    apiMock.onPatch('users/avatar').reply(400);

    const { getByTestId } = render(<Profile />);

    const inputField = getByTestId('avatar-input');

    fireEvent.change(inputField, {
      target: { files: null },
    });

    await wait(() => {
      expect(mockedUpdateUser).not.toHaveBeenCalledWith();
    });
  });
});
