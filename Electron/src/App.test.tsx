import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

describe('CareConnect Login', () => {
    test('displays the login screen when the application starts', () => {
        render(<App />);

        expect(
            screen.getByRole('heading', { name: 'CareConnect' })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText('Email')
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText('Password')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: 'Sign In' })
        ).toBeInTheDocument();
    });
});

test('allows the user to sign in and opens the home screen', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
        screen.getByLabelText('Email'),
        'jane.doe@example.com'
    );

    await user.type(
        screen.getByLabelText('Password'),
        'password123'
    );

    await user.click(
        screen.getByRole('button', { name: 'Sign In' })
    );

    expect(
        screen.getByRole('heading', { name: /good morning, jane/i })
    ).toBeInTheDocument();
});
test('does not sign in when required fields are empty', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
        screen.getByRole('button', { name: 'Sign In' })
    );

    expect(
        screen.getByRole('heading', { name: 'CareConnect' })
    ).toBeInTheDocument();

    expect(
        screen.queryByRole('heading', { name: /good morning, jane/i })
    ).not.toBeInTheDocument();
});

test('opens the reset password screen from forgot password', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
        screen.getByRole('button', { name: 'Forgot password?' })
    );

    expect(
        screen.getByRole('heading', { name: 'Reset Password' })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: 'Send Reset Instructions' })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: 'Back to Sign In' })
    ).toBeInTheDocument();
});

test('submits a password reset request successfully', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
        screen.getByRole('button', { name: 'Forgot password?' })
    );

    await user.type(
        screen.getByLabelText('Email'),
        'jane.doe@example.com'
    );

    await user.click(
        screen.getByRole('button', { name: 'Send Reset Instructions' })
    );

    expect(
        screen.getByRole('status')
    ).toHaveTextContent(
        'Reset instructions have been sent to jane.doe@example.com.'
    );
});