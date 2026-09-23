import { render } from '@testing-library/react-native';
import AppointmentsScreen from '../AppointmentsScreen';

describe('AppointmentsScreen — integration tests', () => {

  const makeNavigation = () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  });

  // ---------------------------------------------------------
  // TC01 — Screen renders successfully
  // ---------------------------------------------------------
  test('TC01 - renders the Appointments screen', async () => {
    const navigation = makeNavigation();

    const result = await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={{} as any}
      />
    );

    expect(result).toBeTruthy();
  });

  // ---------------------------------------------------------
  // TC02 — Screen can be rendered with navigation
  // ---------------------------------------------------------
  test('TC02 - renders with navigation object', async () => {
    const navigation = makeNavigation();

    const result = await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={{} as any}
      />
    );

    expect(result).toBeTruthy();
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // TC03 — Screen renders with an empty route
  // ---------------------------------------------------------
  test('TC03 - renders with an empty route', async () => {
    const navigation = makeNavigation();

    const result = await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={{} as any}
      />
    );

    expect(result).toBeTruthy();
  });

  // ---------------------------------------------------------
  // TC04 — Screen does not navigate automatically
  // ---------------------------------------------------------
  test('TC04 - does not navigate automatically when opened', async () => {
    const navigation = makeNavigation();

    await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={{} as any}
      />
    );

    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // TC05 — Screen can be rendered multiple times
  // ---------------------------------------------------------
  test('TC05 - renders successfully on repeated renders', async () => {
    const navigation1 = makeNavigation();
    const navigation2 = makeNavigation();

    const firstRender = await render(
<AppointmentsScreen
        navigation={navigation1 as any}
        route={{} as any}
      />
    );

    const secondRender = await render(
<AppointmentsScreen
        navigation={navigation2 as any}
        route={{} as any}
      />
    );

    expect(firstRender).toBeTruthy();
    expect(secondRender).toBeTruthy();
  });

  // ---------------------------------------------------------
  // TC06 — Screen renders with navigation functions
  // ---------------------------------------------------------
  test('TC06 - accepts navigation functions without error', async () => {
    const navigation = {
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      setParams: jest.fn(),
    };

    const result = await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={{} as any}
      />
    );

    expect(result).toBeTruthy();
  });

  // ---------------------------------------------------------
  // TC07 — Screen renders with route parameters
  // ---------------------------------------------------------
  test('TC07 - renders when route contains parameters', async () => {
    const navigation = makeNavigation();

    const route = {
      key: 'Appointments',
      name: 'Appointments',
      params: {},
    };

    const result = await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={route as any}
      />
    );

    expect(result).toBeTruthy();
  });

  // ---------------------------------------------------------
  // TC08 — Screen does not call navigation on initial render
  // ---------------------------------------------------------
  test('TC08 - does not call navigation during initial render', async () => {
    const navigation = makeNavigation();

    await render(
<AppointmentsScreen
        navigation={navigation as any}
        route={{} as any}
      />
    );

    expect(navigation.navigate).toHaveBeenCalledTimes(0);
    expect(navigation.replace).toHaveBeenCalledTimes(0);
    expect(navigation.goBack).toHaveBeenCalledTimes(0);
  });

});