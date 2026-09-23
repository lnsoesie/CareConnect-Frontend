import { cleanup, fireEvent, render, screen } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';

function makeNav() {
  return { navigate: jest.fn(), replace: jest.fn() } as any;
}

// Explicit cleanup guards against partial-render failures leaving screen stale
afterEach(cleanup);

describe('ProfileScreen — integration', () => {
  test('renders screen title', async () => {
    await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    // "Profile" also appears as a bottom-nav tab; the heading is first in tree order.
    expect(screen.getAllByText('Profile')[0]).toBeTruthy();
  });

  test('renders user identity', async () => {
    await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    // "John Doe" appears in both the identity card and the Personal Information row.
    expect(screen.getAllByText('John Doe')[0]).toBeTruthy();
    expect(screen.getByText('Patient')).toBeTruthy();
  });

  test('renders personal information section with correct values', async () => {
    await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByText('Personal Information')).toBeTruthy();
    expect(screen.getByText('john.doe@gmail.com')).toBeTruthy();
    expect(screen.getByText('(111) 111-1111')).toBeTruthy();
  });

  test('renders all settings rows', async () => {
    await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByText('Account Settings')).toBeTruthy();
    expect(screen.getByText('Accessibility Settings')).toBeTruthy();
    expect(screen.getByText('Notification Settings')).toBeTruthy();
    expect(screen.getByText('Privacy and Security')).toBeTruthy();
  });

  test('settings buttons have accessible button roles', async () => {
    const { getByRole } = await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    expect(getByRole('button', { name: 'Account Settings' })).toBeTruthy();
    expect(getByRole('button', { name: 'Accessibility Settings' })).toBeTruthy();
    expect(getByRole('button', { name: 'Notification Settings' })).toBeTruthy();
    expect(getByRole('button', { name: 'Privacy and Security' })).toBeTruthy();
  });

  test('Log out button calls replace with Login', async () => {
    const nav = makeNav();
    const { getByRole } = await render(<ProfileScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(getByRole('button', { name: 'Log out' }));
    expect(nav.replace).toHaveBeenCalledWith('Login');
  });

  test('Log out button has accessible role and label', async () => {
    const { getByRole } = await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    expect(getByRole('button', { name: 'Log out' })).toBeTruthy();
  });

  test('renders bottom navigation bar', async () => {
    await render(<ProfileScreen navigation={makeNav()} route={{} as any} />);
    // The tablist container isn't an accessibility element in RNTL v14; assert its 5 tabs.
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });
});