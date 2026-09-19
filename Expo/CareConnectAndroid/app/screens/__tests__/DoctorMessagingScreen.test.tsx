import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';

import DoctorMessagingScreen from '../DoctorMessagingScreen';

async function renderConversation() {
    const navigation = { goBack: jest.fn() } as any;

    await render(
        <DoctorMessagingScreen
            navigation={navigation}
            route={{} as any}
        />
    );

    return navigation;
}

describe('DoctorMessagingScreen', () => {
    test('returns to the message list', async () => {
        const navigation = await renderConversation();

        await fireEvent.press(
            screen.getByLabelText('Back to messages')
        );

        expect(navigation.goBack).toHaveBeenCalledTimes(1);
    });

    test('clears a nonblank message after sending', async () => {
        await renderConversation();
        const input = screen.getByLabelText('Message');

        await fireEvent.changeText(input, 'I have a question');
        expect(input).toHaveDisplayValue('I have a question');

        await fireEvent.press(screen.getByLabelText('Send message'));

        expect(input).toHaveDisplayValue('');
    });

    test('does not clear a whitespace-only message', async () => {
        await renderConversation();
        const input = screen.getByLabelText('Message');

        await fireEvent.changeText(input, '   ');
        await fireEvent.press(screen.getByLabelText('Send message'));

        expect(input).toHaveDisplayValue('   ');
    });

    test('provides an attachment control', async () => {
        await renderConversation();

        await fireEvent.press(screen.getByLabelText('Attach file'));

        expect(screen.getByLabelText('Attach file')).toBeVisible();
    });
});
