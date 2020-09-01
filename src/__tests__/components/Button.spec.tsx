import React from 'react';
import { render } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button component', () => {
  it('should be able to show button', () => {
    const { getByTestId } = render(<Button>Entrar</Button>);

    const buttonElement = getByTestId('button-container');

    expect(buttonElement).toBeTruthy();
  });

  it('should be able to show button with loading', () => {
    const { getByTestId } = render(<Button loading>Entrar</Button>);

    const buttonElement = getByTestId('button-container');

    expect(buttonElement).toHaveTextContent('Carregando...');
  });
});
