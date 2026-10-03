import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

describe('CareConnect Login', () => {
    test('displays the login screen when the application starts', () => {
        render(<App />);

        expect(
            screen.getByRole('heading', { name: 'Welcome' })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText('Email address')
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText('Password')
        ).toBeInTheDocument();

    });

    test('allows the user to sign in and opens the home screen', async () => {
        const user = userEvent.setup();

        render(<App />);

        await user.type(
            screen.getByLabelText('Email address'),
            'jane.doe@example.com'
        );

        await user.type(
            screen.getByLabelText('Password'),
            'password123'
        );

        await user.click(
            screen.getByRole('button', { name: 'Sign in' })
        );

        expect(
            screen.getByRole('heading', { name: /good morning/i })
        ).toBeInTheDocument();
    });


    test('does not sign in when required fields are empty', async () => {
        const user = userEvent.setup();

        render(<App />);

        await user.click(
            screen.getByRole('button', { name: 'Sign in' })
        );

        expect(
            screen.getByRole('heading', { name: 'Welcome' })
        ).toBeInTheDocument();
    });
});



test('opens the reset password screen from forgot password', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
        screen.getByRole('button', { name: 'Forgot password?' })
    );

    expect(
        screen.getByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: /send reset link/i })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: /back to login/i })
    ).toBeInTheDocument();
});

test('submits a password reset request successfully', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
        screen.getByRole('button', { name: 'Forgot password?' })
    );

    await user.type(
        screen.getByLabelText(/email address/i),
        'jane.doe@example.com'
    );

    await user.click(
        screen.getByRole('button', { name: /send reset link/i })
    );

    expect(
        screen.getByRole('status')
    ).toHaveTextContent(
        'Reset instructions have been sent.'
    );
});
