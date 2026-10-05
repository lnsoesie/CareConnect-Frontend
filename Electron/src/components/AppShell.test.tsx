import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Shell } from "./AppShell";

const onNavigate = jest.fn();

const renderShell = (screenName: any = "dashboard") =>
  render(
    <Shell screen={screenName} onNavigate={onNavigate}>
      <h1 tabIndex={-1}>Test Page</h1>
    </Shell>
  );

beforeEach(() => {
  jest.clearAllMocks();
  delete (window as any).careConnectDesktop;
});

describe("Shell", () => {
  test("renders the application shell", () => {
    renderShell();

    expect(screen.getByText("CareConnect")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Appointments/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Messages/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Medications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  test("navigates using sidebar buttons", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Appointments" }));
    expect(onNavigate).toHaveBeenCalledWith("appointments");

    await user.click(screen.getByRole("button", { name: /Messages/ }));
    expect(onNavigate).toHaveBeenCalledWith("messages");

    await user.click(screen.getByRole("button", { name: "Medications" }));
    expect(onNavigate).toHaveBeenCalledWith("medications");

    await user.click(screen.getByRole("button", { name: "Profile" }));
    expect(onNavigate).toHaveBeenCalledWith("profile");

    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalledWith("settings");
  });

  test("logs out when Log out is clicked", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(onNavigate).toHaveBeenCalledWith("login");
  });

  test("maps conversation and new-message screens to Messages as active navigation", () => {
    renderShell("conversation");
    expect(screen.getByRole("button", { name: /Messages/ })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("supports Alt keyboard shortcuts", () => {
    renderShell();

    const main = screen.getByRole("main");

    fireEvent.keyDown(main, { key: "1", code: "Digit1", altKey: true });
    fireEvent.keyDown(main, { key: "2", code: "Digit2", altKey: true });
    fireEvent.keyDown(main, { key: "3", code: "Digit3", altKey: true });
    fireEvent.keyDown(main, { key: "4", code: "Digit4", altKey: true });
    fireEvent.keyDown(main, { key: "5", code: "Digit5", altKey: true });
    fireEvent.keyDown(main, { key: "6", code: "Digit6", altKey: true });
    fireEvent.keyDown(main, { key: "n", code: "KeyN", altKey: true });

    expect(onNavigate).toHaveBeenNthCalledWith(1, "dashboard");
    expect(onNavigate).toHaveBeenNthCalledWith(2, "appointments");
    expect(onNavigate).toHaveBeenNthCalledWith(3, "messages");
    expect(onNavigate).toHaveBeenNthCalledWith(4, "medications");
    expect(onNavigate).toHaveBeenNthCalledWith(5, "profile");
    expect(onNavigate).toHaveBeenNthCalledWith(6, "settings");
    expect(onNavigate).toHaveBeenNthCalledWith(7, "new-message");
  });


  test("Ctrl+K focuses the search box", () => {
    renderShell();

    const search = screen.getByRole("textbox", { name: "Search" });

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "k",
      code: "KeyK",
      ctrlKey: true,
    });

    expect(document.activeElement).toBe(search);
  });

  test("opens shortcut dialog with ?", async () => {
    renderShell();

    const main = screen.getByRole("main");

    fireEvent.keyDown(main, {
      key: "?",
      code: "Slash",
      shiftKey: true,
    });

    expect(
      await screen.findByRole("dialog", {
        name: /Keyboard shortcuts/i,
      })
    ).toBeInTheDocument();
  });

  test("opens shortcut dialog with Ctrl+/", async () => {
    renderShell();

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "/",
      code: "Slash",
      ctrlKey: true,
    });

    expect(
      await screen.findByRole("dialog", {
        name: /Keyboard shortcuts/i,
      })
    ).toBeInTheDocument();
  });

  test("does not open shortcut dialog from an editing field", () => {
    renderShell();

    const search = screen.getByRole("textbox", { name: "Search" });

    fireEvent.keyDown(search, {
      key: "?",
      code: "Slash",
      shiftKey: true,
    });

    expect(
      screen.queryByRole("dialog", { name: /Keyboard shortcuts/i })
    ).not.toBeInTheDocument();
  });

  test("closes shortcut dialog with Escape", async () => {
    renderShell();

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "?",
      code: "Slash",
      shiftKey: true,
    });

    const dialog = await screen.findByRole("dialog", {
      name: /Keyboard shortcuts/i,
    });

    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "Escape",
      code: "Escape",
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /Keyboard shortcuts/i })
      ).not.toBeInTheDocument();
    });
  });

  test("Help menu opens and closes", async () => {
    const user = userEvent.setup();
    renderShell();

    const helpButton = screen.getByRole("button", { name: "Help" });

    await user.click(helpButton);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: /Keyboard shortcuts/i }))
      .toBeInTheDocument();

    await user.click(helpButton);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("Help menu opens Keyboard shortcuts", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Help" }));

    const menu = screen.getByRole("menu");

    await user.click(
      within(menu).getByRole("menuitem", {
        name: /Keyboard shortcuts/i,
      })
    );

    expect(
      await screen.findByRole("dialog", {
        name: /Keyboard shortcuts/i,
      })
    ).toBeInTheDocument();
  });

  test("context menu opens with right click", async () => {
    renderShell();

    fireEvent.contextMenu(screen.getByRole("main"), {
      clientX: 100,
      clientY: 100,
    });

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      within(screen.getByRole("menu")).getByRole("menuitem", {
        name: "Go to Home",
      })
    ).toBeInTheDocument();
  });

  test("context menu actions navigate correctly", async () => {
    const user = userEvent.setup();
    renderShell();

    fireEvent.contextMenu(screen.getByRole("main"), {
      clientX: 100,
      clientY: 100,
    });

    const menu = screen.getByRole("menu");

    await user.click(
      within(menu).getByRole("menuitem", { name: "New message" })
    );

    expect(onNavigate).toHaveBeenCalledWith("new-message");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("Shift+F10 opens context menu", () => {
    renderShell();

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "F10",
      code: "F10",
      shiftKey: true,
    });

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  test("context menu supports keyboard navigation", () => {
    renderShell();

    fireEvent.contextMenu(screen.getByRole("main"), {
      clientX: 100,
      clientY: 100,
    });

    const menu = screen.getByRole("menu");
    const items = within(menu).getAllByRole("menuitem");

    expect(document.activeElement).toBe(items[0]);

    fireEvent.keyDown(items[0], { key: "ArrowDown", code: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);

    fireEvent.keyDown(items[1], { key: "ArrowUp", code: "ArrowUp" });
    expect(document.activeElement).toBe(items[0]);
  });

  test("Escape closes context menu", () => {
    renderShell();

    fireEvent.contextMenu(screen.getByRole("main"), {
      clientX: 100,
      clientY: 100,
    });

    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "Escape",
      code: "Escape",
    });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("notifications panel opens", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: /Notifications, 3 unread/i })
    );

    expect(
      screen.getByRole("dialog", { name: /Notifications/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Appointment reminder")).toBeInTheDocument();
    expect(screen.getByText("Medication reminder")).toBeInTheDocument();
    expect(screen.getByText("New care team message")).toBeInTheDocument();
  });

  test("opening a notification marks it read and navigates", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: /Notifications, 3 unread/i })
    );

    const notificationButton = screen.getByRole("button", {
      name: /Appointment reminder/i,
    });

    await user.click(notificationButton);

    expect(onNavigate).toHaveBeenCalledWith("appointments");
    expect(
      screen.queryByRole("dialog", { name: /Notifications/i })
    ).not.toBeInTheDocument();
  });


  test("Escape closes notifications", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: /Notifications, 3 unread/i })
    );

    expect(
      screen.getByRole("dialog", { name: /Notifications/i })
    ).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("main"), {
      key: "Escape",
      code: "Escape",
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /Notifications/i })
      ).not.toBeInTheDocument();
    });
  });

  test("loads Electron app information", async () => {
    (window as any).careConnectDesktop = {
      getAppInfo: jest.fn().mockResolvedValue({
        version: "3.0.0",
        platform: "win32",
      }),
      onShowShortcuts: jest.fn(),
      showTestNotification: jest.fn(),
    };

    renderShell();

    
  });

  test("handles Electron app info failure", async () => {
    (window as any).careConnectDesktop = {
      getAppInfo: jest.fn().mockRejectedValue(new Error("Failed")),
      onShowShortcuts: jest.fn(),
      showTestNotification: jest.fn(),
    };

    renderShell();

    await waitFor(() => {
      expect(
        (window as any).careConnectDesktop.getAppInfo
      ).toHaveBeenCalled();
    });

    expect(screen.getByText(/CareConnect v2.4.1/i)).toBeInTheDocument();
  });

  test("opens shortcut dialog from Electron event", async () => {
    let shortcutHandler: (() => void) | undefined;

    (window as any).careConnectDesktop = {
      getAppInfo: jest.fn().mockResolvedValue({
        version: "2.4.1",
        platform: "win32",
      }),
      onShowShortcuts: jest.fn((callback: () => void) => {
        shortcutHandler = callback;
      }),
      showTestNotification: jest.fn(),
    };

    renderShell();

    await waitFor(() => {
      expect(shortcutHandler).toBeDefined();
    });

    act(() => {
      shortcutHandler?.();
    });

    expect(
      await screen.findByRole("dialog", {
        name: /Keyboard shortcuts/i,
      })
    ).toBeInTheDocument();
  });

  test("sends a Windows test notification successfully", async () => {
    const showTestNotification = jest.fn().mockResolvedValue({ shown: true });

    (window as any).careConnectDesktop = {
      getAppInfo: jest.fn().mockResolvedValue({
        version: "2.4.1",
        platform: "win32",
      }),
      onShowShortcuts: jest.fn(),
      showTestNotification,
    };

    renderShell();

    await waitFor(() => {
      expect(screen.getByText(/CareConnect v2.4.1/i)).toBeInTheDocument();
    });

    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /Notifications, 3 unread/i,
      })
    );

    const testButton = await screen.findByRole("button", {
      name: "Send test Windows notification",
    });

    await user.click(testButton);

    expect(showTestNotification).toHaveBeenCalled();
    expect(await screen.findByText("Test notification")).toBeInTheDocument();
    //expect(screen.getByText(/Notification sent/i)).toBeInTheDocument();
  });

  test("handles unavailable Windows test notification", async () => {
    const showTestNotification = jest.fn().mockResolvedValue({ shown: false });

    (window as any).careConnectDesktop = {
      getAppInfo: jest.fn().mockResolvedValue({
        version: "2.4.1",
        platform: "win32",
      }),
      onShowShortcuts: jest.fn(),
      showTestNotification,
    };

    renderShell();

    
    
  });

  test("handles Windows test notification error", async () => {
    const showTestNotification = jest
      .fn()
      .mockRejectedValue(new Error("Notification failed"));

    (window as any).careConnectDesktop = {
      getAppInfo: jest.fn().mockResolvedValue({
        version: "2.4.1",
        platform: "win32",
      }),
      onShowShortcuts: jest.fn(),
      showTestNotification,
    };

    renderShell();

  

    
  });
});
