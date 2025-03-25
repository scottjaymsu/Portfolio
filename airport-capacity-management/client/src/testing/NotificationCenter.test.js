import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationCenter from "../components/NotificationCenter";

describe("NotificationCenter Component", () => {
  const mockNotifications = [
    { title: "Location1", message: "Notification 1" },
    { title: "Location2", message: "Notification 2" },
  ];

  const toggleVisibility = jest.fn();
  const handleLocationClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the bell button with an icon", () => {
    const { container } = render(
      <NotificationCenter
        notifications={[]}
        visible={false}
        toggleVisibility={toggleVisibility}
        handleLocationClick={handleLocationClick}
      />
    );

    // There is one button for toggling
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check that the bell icon (an SVG element) is rendered inside the button
    const bellIcon = button.querySelector("svg");
    expect(bellIcon).toBeInTheDocument();

    // Also check that the main container is rendered with id "notification-center"
    const notifCenter = container.querySelector("#notification-center");
    expect(notifCenter).toBeInTheDocument();
  });

  test("calls toggleVisibility when the bell button is clicked", () => {
    render(
      <NotificationCenter
        notifications={[]}
        visible={false}
        toggleVisibility={toggleVisibility}
        handleLocationClick={handleLocationClick}
      />
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(toggleVisibility).toHaveBeenCalledTimes(1);
  });

  test("applies the visible class when visible prop is true", () => {
    const { container } = render(
      <NotificationCenter
        notifications={[]}
        visible={true}
        toggleVisibility={toggleVisibility}
        handleLocationClick={handleLocationClick}
      />
    );

    const notifCenter = container.querySelector("#notification-center");
    expect(notifCenter).toHaveClass("visible");
  });

  test("renders notifications and calls handleLocationClick when a notification is clicked", () => {
    render(
      <NotificationCenter
        notifications={mockNotifications}
        visible={false}
        toggleVisibility={toggleVisibility}
        handleLocationClick={handleLocationClick}
      />
    );

    // Check that both notifications are rendered
    mockNotifications.forEach((notif) => {
      expect(screen.getByText(notif.message)).toBeInTheDocument();
    });

    // Click the first notification
    const firstNotif = screen.getByText(mockNotifications[0].message);
    fireEvent.click(firstNotif);
    expect(handleLocationClick).toHaveBeenCalledWith(mockNotifications[0].title);
  });
});
