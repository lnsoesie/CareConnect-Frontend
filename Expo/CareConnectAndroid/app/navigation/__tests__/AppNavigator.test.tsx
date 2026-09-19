import {
    act,
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';

import App from '../../../App';

jest.useFakeTimers();

async function finishAnimations() {
    await act(() => jest.runAllTimers());
}

async function logIn() {
    await fireEvent.press(
        screen.getByRole('button', { name: 'Login' })
    );
    await finishAnimations();
}

describe('CareConnect navigation', () => {
    test('starts on Login and opens Reset Password', async () => {
        await render(<App />);

        expect(screen.getByLabelText('Email address')).toBeTruthy();

        await fireEvent.press(
            screen.getByRole('button', {
                name: 'Forgot password',
            })
        );
        await finishAnimations();

        expect(
            screen.getByRole('button', {
                name: 'Send reset link',
            })
        ).toBeVisible();

        await fireEvent.changeText(
            screen.getByLabelText('Email address'),
            'patient@example.com'
        );
        expect(
            screen.getByLabelText('Email address')
        ).toHaveDisplayValue('patient@example.com');

        await fireEvent.press(
            screen.getByRole('button', { name: 'Back' })
        );
        await finishAnimations();

        expect(
            screen.getByRole('button', { name: 'Login' })
        ).toBeVisible();
    });

    test('reaches every quick-access destination from Home', async () => {
        await render(<App />);
        await logIn();

        expect(screen.getByText('Welcome back!')).toBeVisible();

        await fireEvent.press(
            screen.getByRole('button', { name: 'Appointments' })
        );
        await finishAnimations();
        expect(screen.getByText('Upcoming')).toBeVisible();

        await fireEvent.press(screen.getByLabelText('Home'));
        await finishAnimations();
        await fireEvent.press(
            screen.getByRole('button', { name: 'Messages' })
        );
        await finishAnimations();
        expect(screen.getByText('+ New message')).toBeVisible();

        await fireEvent.press(screen.getByLabelText('Home'));
        await finishAnimations();
        await fireEvent.press(
            screen.getByRole('button', { name: 'Medications' })
        );
        await finishAnimations();
        expect(screen.getByLabelText('Search medications')).toBeVisible();

        await fireEvent.press(screen.getByLabelText('Home'));
        await finishAnimations();
        await fireEvent.press(
            screen.getByRole('button', { name: 'Profile' })
        );
        await finishAnimations();
        expect(screen.getByText('Personal Information')).toBeVisible();
    });

    test('searches for and marks a medication as taken', async () => {
        await render(<App />);
        await logIn();

        await fireEvent.press(
            screen.getByRole('button', { name: 'Medications' })
        );
        await finishAnimations();

        await fireEvent.changeText(
            screen.getByLabelText('Search medications'),
            'lisin'
        );

        expect(screen.getByText('Lisinopril')).toBeVisible();
        expect(screen.queryByText('Fingolimod')).toBeNull();

        await fireEvent.press(
            screen.getByRole('button', {
                name: 'Mark Lisinopril as taken',
            })
        );

        expect(screen.getByText('Taken just now')).toBeVisible();
        expect(
            screen.queryByLabelText('Mark Lisinopril as taken')
        ).toBeNull();
    });

    test('opens the new-message and doctor-conversation screens', async () => {
        await render(<App />);
        await logIn();

        await fireEvent.press(
            screen.getByRole('button', { name: 'Messages' })
        );
        await finishAnimations();

        await fireEvent.press(screen.getByText('+ New message'));
        await finishAnimations();
        expect(screen.getByText('New Message')).toBeVisible();

        await fireEvent.changeText(
            screen.getByLabelText('Message recipient'),
            'Dr. Smith'
        );
        await fireEvent.changeText(
            screen.getByLabelText('Message'),
            'Question about my test results'
        );
        await fireEvent.press(
            screen.getByRole('button', { name: 'Send message' })
        );
        await finishAnimations();

        expect(screen.getByText('+ New message')).toBeVisible();

        await fireEvent.press(screen.getAllByText('See details')[0]);
        await finishAnimations();

        expect(screen.getByText('Dr. Sarah Smith')).toBeVisible();
    });

    test('logs out from Profile', async () => {
        await render(<App />);
        await logIn();

        await fireEvent.press(
            screen.getByRole('button', { name: 'Profile' })
        );
        await finishAnimations();

        await fireEvent.press(
            screen.getByRole('button', { name: 'Log out' })
        );
        await finishAnimations();

        expect(
            screen.getByRole('button', { name: 'Login' })
        ).toBeVisible();
    });
});
