import { fireEvent, render, screen } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

function makeNav() {
  return { navigate: jest.fn(), replace: jest.fn() } as any;
}

describe('HomeScreen — integration', () => {
  test('renders brand, welcome message and appointment card', async () => {
    await render(<HomeScreen navigation={makeNav()} route={{} as any} />);

    expect(screen.getByText('CareConnect')).toBeTruthy();
    expect(screen.getByText('Welcome back!')).toBeTruthy();
    expect(screen.getByText('Upcoming Appointment')).toBeTruthy();
    expect(screen.getByText(/Dr\. Smith/)).toBeTruthy();
    expect(screen.getByText(/September 5/)).toBeTruthy();
  });

  test('renders all four quick-access tiles', async () => {
    await render(<HomeScreen navigation={makeNav()} route={{} as any} />);

    // Tiles are role "button"; the bottom-nav entries with the same labels are role "tab".
    expect(screen.getByRole('button', { name: 'Appointments' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Messages' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Medications' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeTruthy();
  });

  test('quick-access Appointments tile calls navigate', async () => {
    const nav = makeNav();
    await render(<HomeScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Appointments' }));
    expect(nav.navigate).toHaveBeenCalledWith('Appointments');
  });

  test('quick-access Messages tile calls navigate', async () => {
    const nav = makeNav();
    await render(<HomeScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Messages' }));
    expect(nav.navigate).toHaveBeenCalledWith('Messages');
  });

  test('quick-access Medications tile calls navigate', async () => {
    const nav = makeNav();
    await render(<HomeScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Medications' }));
    expect(nav.navigate).toHaveBeenCalledWith('Medications');
  });

  test('quick-access Profile tile calls navigate', async () => {
    const nav = makeNav();
    await render(<HomeScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Profile' }));
    expect(nav.navigate).toHaveBeenCalledWith('Profile');
  });

  test('renders the bottom navigation bar', async () => {
    await render(<HomeScreen navigation={makeNav()} route={{} as any} />);
    // The tablist container isn't an accessibility element in RNTL v14; assert its 5 tabs.
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });

  // Accessibility
  test('quick-access tiles have accessible button roles and hints', async () => {
    await render(<HomeScreen navigation={makeNav()} route={{} as any} />);
    const tile = screen.getByRole('button', { name: 'Appointments' });
    expect(tile).toHaveProp('accessibilityHint', 'Opens the Appointments screen');
  });
});