import { fireEvent, render, screen } from '@testing-library/react-native';
import MessagesScreen from '../MessagesScreen';

function makeNav() {
  return { navigate: jest.fn(), replace: jest.fn() } as any;
}

describe('MessagesScreen — integration', () => {
  test('renders screen title', async () => {
    await render(<MessagesScreen navigation={makeNav()} route={{} as any} />);
    // "Messages" also appears as a bottom-nav tab; the heading is first in tree order.
    expect(screen.getAllByText('Messages')[0]).toBeTruthy();
  });

  test('renders the New message button', async () => {
    await render(<MessagesScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByLabelText('New message')).toBeTruthy();
  });

  test('renders both message cards', async () => {
    await render(<MessagesScreen navigation={makeNav()} route={{} as any} />);
    expect(screen.getByText('Dr. Barrow')).toBeTruthy();
    expect(screen.getByText('Gastroenterology')).toBeTruthy();
    expect(screen.getByText('Your test results are ready')).toBeTruthy();
    expect(screen.getByText('Dr. Smith')).toBeTruthy();
    expect(screen.getByText('Neurology')).toBeTruthy();
    expect(screen.getByText('Please let us know if...')).toBeTruthy();
  });

  test('tapping New message navigates to NewMessage', async () => {
    const nav = makeNav();
    await render(<MessagesScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByLabelText('New message'));
    expect(nav.navigate).toHaveBeenCalledWith('NewMessage');
  });

  test('tapping See details navigates to DoctorMessaging', async () => {
    const nav = makeNav();
    await render(<MessagesScreen navigation={nav} route={{} as any} />);
    await fireEvent.press(screen.getByLabelText('See message details from Dr. Barrow'));
    expect(nav.navigate).toHaveBeenCalledWith('DoctorMessaging');
  });

  test('See details buttons have accessible roles', async () => {
    await render(<MessagesScreen navigation={makeNav()} route={{} as any} />);
    expect(
      screen.getByRole('button', { name: 'See message details from Dr. Barrow' })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'See message details from Dr. Smith' })
    ).toBeTruthy();
  });

  test('renders bottom navigation bar', async () => {
    await render(<MessagesScreen navigation={makeNav()} route={{} as any} />);
    // The tablist container isn't an accessibility element in RNTL v14; assert its 5 tabs.
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });
});