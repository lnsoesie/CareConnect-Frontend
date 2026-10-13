import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Dashboard,
  Appointments,
  Medications,
  Messages,
  NewMessage,
  Conversation,
  Profile,
  Settings,
} from "./CareScreens";

describe("CareScreens", () => {
  const onNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Dashboard", () => {
    test("renders dashboard content", () => {
      render(<Dashboard onNavigate={onNavigate} />);

      expect(screen.getByText("Good morning, Jane")).toBeInTheDocument();
      expect(screen.getByText("NEXT APPOINTMENT")).toBeInTheDocument();
      expect(screen.getByText("MEDICATIONS TODAY")).toBeInTheDocument();
      expect(screen.getByText("CARE PLAN")).toBeInTheDocument();
      expect(screen.getByText("HEALTH SNAPSHOT")).toBeInTheDocument();
    });

    test("View all navigates to appointments", async () => {
      const user = userEvent.setup();
      render(<Dashboard onNavigate={onNavigate} />);

      await user.click(screen.getByRole("button", { name: "View all" }));

      expect(onNavigate).toHaveBeenCalledWith("appointments");
    });

    test("View details navigates to appointments", async () => {
      const user = userEvent.setup();
      render(<Dashboard onNavigate={onNavigate} />);

      await user.click(screen.getByRole("button", { name: "View details" }));

      expect(onNavigate).toHaveBeenCalledWith("appointments");
    });

    test("renders checklist checkboxes", () => {
      render(<Dashboard onNavigate={onNavigate} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(4);
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();
    });
  });

  describe("Appointments", () => {
    test("renders appointment list", () => {
      render(<Appointments />);

      expect(screen.getByRole("heading", { name: "Appointments" })).toBeInTheDocument();
      expect(screen.getByText("Cardiology follow-up")).toBeInTheDocument();
      expect(screen.getByText("Physical therapy")).toBeInTheDocument();
      expect(screen.getByText("Annual wellness visit")).toBeInTheDocument();
      expect(screen.getByText("Confirmed")).toBeInTheDocument();
    });

    test("renders appointment status tabs", () => {
      render(<Appointments />);

      expect(screen.getByRole("tab", { name: "Upcoming" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tab", { name: "Past" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
      expect(screen.getByRole("tab", { name: "Cancelled" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    });

    test("appointment tabs respond to arrows, Home, and End", async () => {
      const user = userEvent.setup();
      render(<Appointments />);
      const upcoming = screen.getByRole("tab", { name: "Upcoming" });
      upcoming.focus();

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Past" })).toHaveFocus();
      expect(screen.getByRole("tab", { name: "Past" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent(
        "No past appointments.",
      );

      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Cancelled" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await user.keyboard("{Home}");
      expect(screen.getByRole("tab", { name: "Upcoming" })).toHaveFocus();
      await user.keyboard("{End}");
      expect(screen.getByRole("tab", { name: "Cancelled" })).toHaveFocus();
    });

    test("scheduling adds an appointment to Upcoming", async () => {
      const user = userEvent.setup();
      render(<Appointments />);
      await user.click(
        screen.getByRole("button", { name: "+ Schedule appointment" }),
      );

      const dialog = screen.getByRole("dialog", {
        name: "Schedule appointment",
      });
      await user.type(
        within(dialog).getByLabelText("Appointment"),
        "Eye exam",
      );
      await user.type(within(dialog).getByLabelText("Provider"), "Dr. Jones");
      await user.type(within(dialog).getByLabelText("Date"), "2026-11-12");
      await user.type(within(dialog).getByLabelText("Time"), "10:30");
      await user.click(
        within(dialog).getByRole("button", { name: "Schedule appointment" }),
      );

      expect(screen.getByRole("tabpanel")).toHaveTextContent("Eye exam");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Dr. Jones");
      expect(
        screen.queryByRole("dialog", { name: "Schedule appointment" }),
      ).not.toBeInTheDocument();
    });

    test("schedule dialog traps focus and restores it when dismissed", async () => {
      const user = userEvent.setup();
      render(<Appointments />);
      const trigger = screen.getByRole("button", {
        name: "+ Schedule appointment",
      });
      await user.click(trigger);

      const dialog = screen.getByRole("dialog", {
        name: "Schedule appointment",
      });
      const closeButton = within(dialog).getByRole("button", {
        name: "Close Schedule appointment",
      });
      const submitButton = within(dialog).getByRole("button", {
        name: "Schedule appointment",
      });

      expect(closeButton).toHaveFocus();
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      expect(submitButton).toHaveFocus();
      await user.keyboard("{Tab}");
      expect(closeButton).toHaveFocus();
      await user.keyboard("{Escape}");

      expect(
        screen.queryByRole("dialog", { name: "Schedule appointment" }),
      ).not.toBeInTheDocument();
      await waitFor(() => {
        expect(trigger).toHaveFocus()
      })
    });

    test("renders scheduling help", () => {
      render(<Appointments />);

      expect(screen.getByText(/Need help/i)).toBeInTheDocument();
      expect(screen.getByText(/\(555\) 018-2200/)).toBeInTheDocument();
    });
  });

  describe("Medications", () => {
    test("renders medication summary and list", () => {
      render(<Medications />);

      expect(screen.getByRole("heading", { name: "Medications" })).toBeInTheDocument();
      expect(screen.getByText("Lisinopril")).toBeInTheDocument();
      expect(screen.getByText("Metformin")).toBeInTheDocument();
      expect(screen.getByText("Atorvastatin")).toBeInTheDocument();
      expect(screen.getByText("Taken today")).toBeInTheDocument();
      expect(screen.getByText("Next at 6:00 PM")).toBeInTheDocument();
      expect(screen.getByText("Due tonight")).toBeInTheDocument();
    });

    test("renders medication safety message", () => {
      render(<Medications />);

      expect(
        screen.getByText(/Never change or stop a medication/i),
      ).toBeInTheDocument();
    });

    test("renders medication action buttons", () => {
      render(<Medications />);

      expect(
        screen.getByRole("button", { name: /\+ Add medication/i }),
      ).toBeInTheDocument();

      expect(screen.getAllByRole("button", { name: "Details" })).toHaveLength(3);
    });

    test("Add medication creates an entry and Details shows its information", async () => {
      const user = userEvent.setup();
      render(<Medications />);
      await user.click(
        screen.getByRole("button", { name: "+ Add medication" }),
      );
      const dialog = screen.getByRole("dialog", { name: "Add medication" });
      await user.type(
        within(dialog).getByLabelText("Medication name"),
        "Vitamin D",
      );
      await user.type(within(dialog).getByLabelText("Dose"), "1000 IU");
      await user.type(
        within(dialog).getByLabelText("Schedule"),
        "Once daily",
      );
      await user.click(
        within(dialog).getByRole("button", { name: "Add medication" }),
      );

      const row = screen.getByText("Vitamin D").closest(".medication-row");
      expect(row).not.toBeNull();
      expect(within(row as HTMLElement).getByText("1000 IU")).toBeInTheDocument();
      await user.click(
        within(row as HTMLElement).getByRole("button", { name: "Details" }),
      );
      expect(
        screen.getByRole("dialog", { name: "Vitamin D" }),
      ).toHaveTextContent("Once daily");
    });
  });

  describe("Messages", () => {
    test("renders message list", () => {
      render(<Messages onNavigate={onNavigate} />);

      expect(screen.getByRole("heading", { name: "Messages" })).toBeInTheDocument();
      expect(screen.getByText("Your test results are ready")).toBeInTheDocument();
      expect(screen.getByText("Annual wellness visit Reminder")).toBeInTheDocument();
    });

    test("New Message navigates to new-message", async () => {
      const user = userEvent.setup();
      render(<Messages onNavigate={onNavigate} />);

      await user.click(
        screen.getByRole("button", { name: /\+ New Message/i }),
      );

      expect(onNavigate).toHaveBeenCalledWith("new-message");
    });

    test("Details navigates to conversation", async () => {
      const user = userEvent.setup();
      render(<Messages onNavigate={onNavigate} />);

      const detailsButtons = screen.getAllByRole("button", { name: "Details" });
      await user.click(detailsButtons[0]);

      expect(onNavigate).toHaveBeenCalledWith("conversation");
    });
  });

  describe("NewMessage", () => {
    test("renders compose form", () => {
      render(<NewMessage onNavigate={onNavigate} />);

      expect(screen.getByRole("heading", { name: "New Message" })).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter provider name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Type your message here")).toBeInTheDocument();
      expect(screen.getByLabelText(/attachment/i)).toBeInTheDocument();
    });

    test("back button returns to messages", async () => {
      const user = userEvent.setup();
      render(<NewMessage onNavigate={onNavigate} />);

      await user.click(
        screen.getByRole("button", { name: "Back to messages" }),
      );

      expect(onNavigate).toHaveBeenCalledWith("messages");
    });

    test("submitting form navigates to messages", async () => {
      const user = userEvent.setup();
      render(<NewMessage onNavigate={onNavigate} />);

      await user.type(
        screen.getByPlaceholderText("Enter provider name"),
        "Dr. Smith",
      );
      await user.type(
        screen.getByPlaceholderText("Type your message here"),
        "Hello doctor",
      );

      await user.click(
        screen.getByRole("button", { name: /Send Message/i }),
      );

      expect(onNavigate).toHaveBeenCalledWith("messages");
    });
  });

  describe("Conversation", () => {
    // Conversation
    test("renders conversation", () => {
      render(<Conversation onNavigate={onNavigate} />);

      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Dr. Sarah Smith",
        })
      ).toBeInTheDocument();

      //expect(screen.getByText("Neurology")).toBeInTheDocument();
      expect(
        screen.getByText(/Your test results are ready/)
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Type a message")).toBeInTheDocument();
    });

    test("back to messages navigates correctly", async () => {
      const user = userEvent.setup();
      render(<Conversation onNavigate={onNavigate} />);

      await user.click(
        screen.getByRole("button", { name: /Back to Messages/i }),
      );

      expect(onNavigate).toHaveBeenCalledWith("messages");
    });

    test("sends a typed reply", async () => {
      const user = userEvent.setup();
      render(<Conversation onNavigate={onNavigate} />);

      const input = screen.getByRole("textbox", {
        name: "Type a message",
      });

      await user.type(input, "Thank you for the update.");
      await user.click(
        screen.getByRole("button", { name: "Send message" }),
      );

      expect(
        screen.getByText("Thank you for the update."),
      ).toBeInTheDocument();
      expect(input).toHaveValue("");
    });

    test("sends reply when Enter is pressed", async () => {
      const user = userEvent.setup();
      render(<Conversation onNavigate={onNavigate} />);

      const input = screen.getByRole("textbox", {
        name: "Type a message",
      });

      await user.type(input, "Reply with Enter{Enter}");

      expect(screen.getByText("Reply with Enter")).toBeInTheDocument();
    });

    test("does not add an empty reply", async () => {
      const user = userEvent.setup();
      render(<Conversation onNavigate={onNavigate} />);

      await user.click(
        screen.getByRole("button", { name: "Send message" }),
      );

      expect(
        screen.getByText(/Your test results are ready/)
      ).toBeInTheDocument();
    });
  });

  describe("Profile", () => {
    test("renders profile information", () => {
      render(<Profile />);

      expect(
        screen.getByRole("heading", { name: "Profile" })
      ).toBeInTheDocument();

      //expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("4821 Willowbrook Drive")).toBeInTheDocument();
      expect(screen.getByText("San Francisco")).toBeInTheDocument();
    });

    test("renders Edit Profile action", () => {
      render(<Profile />);

      expect(
        screen.getByRole("button", { name: /Edit Profile/i }),
      ).toBeInTheDocument();
    });

    test("Edit Profile updates displayed profile details", async () => {
      const user = userEvent.setup();
      render(<Profile />);
      await user.click(
        screen.getByRole("button", { name: /Edit Profile/i }),
      );
      const dialog = screen.getByRole("dialog", { name: "Edit profile" });
      const name = within(dialog).getByLabelText("Full name");
      await user.clear(name);
      await user.type(name, "Jane Updated Doe");
      await user.click(
        within(dialog).getByRole("button", { name: "Save profile" }),
      );

      expect(screen.getAllByText("Jane Updated Doe")).toHaveLength(2);
      expect(
        screen.queryByRole("dialog", { name: "Edit profile" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Settings", () => {
    test("renders settings", () => {
      render(<Settings />);

      expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
      expect(screen.getByText("NOTIFICATIONS")).toBeInTheDocument();
      expect(screen.getByText("ACCOUNT")).toBeInTheDocument();
      expect(screen.getByText("Appointment reminders")).toBeInTheDocument();
      expect(screen.getByText("Medication reminders")).toBeInTheDocument();
      expect(screen.getByText("New messages")).toBeInTheDocument();
    });

    test("renders enabled notification settings", () => {
      render(<Settings />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    test("allows changing language", async () => {
      const user = userEvent.setup();
      render(<Settings />);

      const language = screen.getByRole("combobox");
      await user.selectOptions(language, "Spanish");

      expect(language).toHaveValue("Spanish");
    });

    test("shows save confirmation", async () => {
      const user = userEvent.setup();
      render(<Settings />);

      await user.click(
        screen.getByRole("button", { name: "Save changes" }),
      );

      expect(
        screen.getByRole("status"),
      ).toHaveTextContent("Your settings have been saved.");
    });

    test("password and two-step actions provide workflows", async () => {
      const user = userEvent.setup();
      render(<Settings />);
      await user.click(
        screen.getByRole("button", { name: "Change password" }),
      );
      const passwordDialog = screen.getByRole("dialog", {
        name: "Change password",
      });
      await user.type(
        within(passwordDialog).getByLabelText("Current password"),
        "old-password",
      );
      await user.type(
        within(passwordDialog).getByLabelText("New password"),
        "new-password",
      );
      await user.type(
        within(passwordDialog).getByLabelText("Confirm new password"),
        "different-password",
      );
      await user.click(
        within(passwordDialog).getByRole("button", {
          name: "Save password change request",
        }),
      );
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "The new passwords do not match.",
      );

      const confirmation = within(passwordDialog).getByLabelText(
        "Confirm new password",
      );
      await user.clear(confirmation);
      await user.type(confirmation, "new-password");
      await user.click(
        within(passwordDialog).getByRole("button", {
          name: "Save password change request",
        }),
      );
      expect(await screen.findByRole("status")).toHaveTextContent(
        "password change request is saved for this demo",
      );

      await user.click(screen.getByRole("button", { name: "Set up" }));
      const twoStepDialog = screen.getByRole("dialog", {
        name: "Set up two-step verification",
      });
      await user.click(
        within(twoStepDialog).getByRole("button", {
          name: "Enable two-step verification",
        }),
      );
      expect(await screen.findByRole("status")).toHaveTextContent(
        "Two-step verification setup is saved for this demo account.",
      );
      expect(
        screen.getByRole("button", { name: "Enabled" }),
      ).toBeInTheDocument();
    });
  });
});
