import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';

import BottomNav from '../BottomNav';

describe('BottomNav', () => {
    test('displays every CareConnect destination', async () => {
        const navigation = { navigate: jest.fn() } as any;

        await render(
            <BottomNav current="Home" navigation={navigation} />
        );

        expect(screen.getByLabelText('Home')).toBeTruthy();
        expect(screen.getByLabelText('Appointments')).toBeTruthy();
        expect(screen.getByLabelText('Messages')).toBeTruthy();
        expect(screen.getByLabelText('Medications')).toBeTruthy();
        expect(screen.getByLabelText('Profile')).toBeTruthy();
    });

    test('marks the current destination as selected', async () => {
        const navigation = { navigate: jest.fn() } as any;

        await render(
            <BottomNav current="Messages" navigation={navigation} />
        );

        expect(screen.getByLabelText('Messages')).toHaveProp(
            'accessibilityState',
            { selected: true }
        );
        expect(screen.getByLabelText('Home')).toHaveProp(
            'accessibilityState',
            { selected: false }
        );
    });

    test.each([
        'Home',
        'Appointments',
        'Messages',
        'Medications',
        'Profile',
    ])('navigates to %s when pressed', async (destination) => {
        const navigation = { navigate: jest.fn() } as any;

        await render(
            <BottomNav current="Home" navigation={navigation} />
        );

        await fireEvent.press(screen.getByLabelText(destination));

        expect(navigation.navigate).toHaveBeenCalledWith(destination);
    });

    test('provides accessibility roles and hints for navigation tabs', async () => {
        const navigation = { navigate: jest.fn() } as any;

        await render(
            <BottomNav current="Home" navigation={navigation} />
        );

        const homeTab = screen.getByRole('tab', { name: 'Home' });

        expect(homeTab).toHaveProp(
            'accessibilityHint',
            'Opens the Home screen'
        );

        expect(homeTab).toHaveProp(
            'accessibilityState',
            { selected: true }
        );
    });
});
