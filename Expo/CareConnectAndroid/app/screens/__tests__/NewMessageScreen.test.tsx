import { fireEvent, render, screen } from '@testing-library/react-native';

import NewMessageScreen from '../NewMessageScreen';

function makeNav() {

  return { navigate: jest.fn(), goBack: jest.fn() } as any;

}

describe('NewMessageScreen — integration', () => {

  test('renders screen title', async () => {

    await render(<NewMessageScreen navigation={makeNav()} route={{} as any} />);

    expect(screen.getByText('New Message')).toBeTruthy();

  });

  test('renders recipient and message inputs', async () => {

    await render(<NewMessageScreen navigation={makeNav()} route={{} as any} />);

    expect(screen.getByLabelText('Message recipient')).toBeTruthy();

    expect(screen.getByLabelText('Message')).toBeTruthy();

  });

  test('renders Add attachment and Send message controls', async () => {

    await render(<NewMessageScreen navigation={makeNav()} route={{} as any} />);

    expect(screen.getByLabelText('Add attachment')).toBeTruthy();

    expect(screen.getByLabelText('Send message')).toBeTruthy();

  });

  test('back button calls goBack', async () => {

    const nav = makeNav();

    await render(<NewMessageScreen navigation={nav} route={{} as any} />);

    await fireEvent.press(screen.getByLabelText('Back to messages'));

    expect(nav.goBack).toHaveBeenCalledTimes(1);

  });

  test('Send message navigates to Messages', async () => {

    const nav = makeNav();

    await render(<NewMessageScreen navigation={nav} route={{} as any} />);

    await fireEvent.press(screen.getByLabelText('Send message'));

    expect(nav.navigate).toHaveBeenCalledWith('Messages');

  });

  test('accepts text in recipient field', async () => {

    await render(<NewMessageScreen navigation={makeNav()} route={{} as any} />);

    const field = screen.getByLabelText('Message recipient');

    await fireEvent.changeText(field, 'Dr. Smith');

    expect(field).toHaveDisplayValue('Dr. Smith');

  });

  test('accepts multiline text in message body', async () => {

    await render(<NewMessageScreen navigation={makeNav()} route={{} as any} />);

    const field = screen.getByLabelText('Message');

    await fireEvent.changeText(field, 'Hello doctor,\nI have a question.');

    expect(field).toHaveDisplayValue('Hello doctor,\nI have a question.');

  });

  test('controls have accessible button roles', async () => {

    await render(<NewMessageScreen navigation={makeNav()} route={{} as any} />);

    expect(screen.getByRole('button', { name: 'Back to messages' })).toBeTruthy();

    expect(screen.getByRole('button', { name: 'Send message' })).toBeTruthy();

    expect(screen.getByRole('button', { name: 'Add attachment' })).toBeTruthy();

  });

});
