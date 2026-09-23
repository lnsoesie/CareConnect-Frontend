import { fireEvent, render, screen } from '@testing-library/react-native';
import ResetPasswordScreen from '../ResetPasswordScreen';

function makeNav() {
  return { navigate: jest.fn() } as any;
}

describe('ResetPasswordScreen — integration', () => {
  test('renders instruction text', async () => {
    await render(<ResetPasswordScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByText(/Enter your email to receive/i)).toBeTruthy();
  });

  test('renders email input and send button', async () => {
    await render(<ResetPasswordScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByLabelText('Email address')).toBeTruthy();
    expect(screen.getByLabelText('Send reset link')).toBeTruthy();
  });

  test('back button calls navigate with Login', async () => {
    const nav = makeNav();
    await render(<ResetPasswordScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByLabelText('Back'));
    expect(nav.navigate).toHaveBeenCalledWith('Login');
  });

  test('accepts email input', async () => {
    await render(<ResetPasswordScreen navigation={makeNav()} route={{} as any} />);
    const field = screen.getByLabelText('Email address');
    await fireEvent.changeText(field, 'user@care.com');
    expect(field).toHaveDisplayValue('user@care.com');
  });

  test('Send reset link button has accessible role', async () => {
    await render(<ResetPasswordScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeTruthy();
  });

  test('Send reset link has correct accessibility hint', async () => {
    await render(<ResetPasswordScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByLabelText('Send reset link')).toHaveProp(
      'accessibilityHint',
      'Sends password reset instructions to your email address'
    );
  });
});