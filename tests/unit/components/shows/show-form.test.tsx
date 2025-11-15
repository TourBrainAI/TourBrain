import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShowForm } from "../../../../apps/web/src/components/ShowForm";
import { testData } from "../../../fixtures/test-data";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
  useParams: () => ({ tourId: "tour_123" }),
}));

// Mock API calls
const mockCreateShow = jest.fn();
jest.mock("../../../../apps/web/src/lib/api", () => ({
  createShow: (...args: any[]) => mockCreateShow(...args),
}));

describe("ShowForm Component", () => {
  const mockVenues = [testData.venues.madisonSquareGarden];
  const mockTour = testData.tours.northAmericanTour;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    expect(screen.getByLabelText(/venue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guarantee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/merchandise split/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create show/i })
    ).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    // Try to submit without filling required fields
    await user.click(screen.getByRole("button", { name: /create show/i }));

    await waitFor(() => {
      expect(screen.getByText(/venue is required/i)).toBeInTheDocument();
      expect(screen.getByText(/show date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/show time is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/guarantee amount is required/i)
      ).toBeInTheDocument();
    });
  });

  it("validates date constraints", async () => {
    const user = userEvent.setup();

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    const dateInput = screen.getByLabelText(/show date/i);

    // Enter past date
    await user.clear(dateInput);
    await user.type(dateInput, "2020-01-01");
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(
        screen.getByText(/show date cannot be in the past/i)
      ).toBeInTheDocument();
    });
  });

  it("validates financial input formats", async () => {
    const user = userEvent.setup();

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    // Test invalid guarantee format
    await user.type(screen.getByLabelText(/guarantee/i), "invalid");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/must be a valid number/i)).toBeInTheDocument();
    });

    // Test negative guarantee
    await user.clear(screen.getByLabelText(/guarantee/i));
    await user.type(screen.getByLabelText(/guarantee/i), "-1000");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/must be a positive number/i)
      ).toBeInTheDocument();
    });

    // Test merchandise split out of range
    await user.type(screen.getByLabelText(/merchandise split/i), "150");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/must be between 0 and 100/i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();

    mockCreateShow.mockResolvedValueOnce({
      id: "show_123",
      venue: mockVenues[0],
      date: "2024-06-15",
      time: "20:00",
      status: "confirmed",
      guarantee: 50000,
      merchandiseSplit: 85,
    });

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={mockOnSuccess} />
    );

    // Fill form with valid data
    await user.selectOptions(screen.getByLabelText(/venue/i), mockVenues[0].id);
    await user.type(screen.getByLabelText(/show date/i), "2024-06-15");
    await user.type(screen.getByLabelText(/show time/i), "20:00");
    await user.selectOptions(screen.getByLabelText(/status/i), "confirmed");
    await user.type(screen.getByLabelText(/guarantee/i), "50000");
    await user.type(screen.getByLabelText(/merchandise split/i), "85");

    // Submit form
    await user.click(screen.getByRole("button", { name: /create show/i }));

    await waitFor(() => {
      expect(mockCreateShow).toHaveBeenCalledWith({
        tourId: mockTour.id,
        venueId: mockVenues[0].id,
        date: "2024-06-15",
        time: "20:00",
        status: "confirmed",
        guarantee: 50000,
        merchandiseSplit: 85,
        productionCosts: 0,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("handles API errors gracefully", async () => {
    const user = userEvent.setup();

    mockCreateShow.mockRejectedValueOnce(
      new Error("Venue not available on selected date")
    );

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    // Fill and submit form
    await user.selectOptions(screen.getByLabelText(/venue/i), mockVenues[0].id);
    await user.type(screen.getByLabelText(/show date/i), "2024-06-15");
    await user.type(screen.getByLabelText(/show time/i), "20:00");
    await user.selectOptions(screen.getByLabelText(/status/i), "confirmed");
    await user.type(screen.getByLabelText(/guarantee/i), "50000");

    await user.click(screen.getByRole("button", { name: /create show/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/venue not available on selected date/i)
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();

    // Mock slow API response
    mockCreateShow.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    // Fill and submit form
    await user.selectOptions(screen.getByLabelText(/venue/i), mockVenues[0].id);
    await user.type(screen.getByLabelText(/show date/i), "2024-06-15");
    await user.type(screen.getByLabelText(/show time/i), "20:00");
    await user.selectOptions(screen.getByLabelText(/status/i), "confirmed");
    await user.type(screen.getByLabelText(/guarantee/i), "50000");

    await user.click(screen.getByRole("button", { name: /create show/i }));

    // Verify loading state
    expect(screen.getByText(/creating show/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /creating show/i })
    ).toBeDisabled();
  });

  it("pre-fills form when editing existing show", () => {
    const existingShow = testData.shows.madSquareGardenShow;

    render(
      <ShowForm
        venues={mockVenues}
        tour={mockTour}
        show={existingShow}
        onSuccess={jest.fn()}
      />
    );

    expect(
      screen.getByDisplayValue(existingShow.venue.name)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-06-15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update show/i })
    ).toBeInTheDocument();
  });

  it("calculates net profit correctly", async () => {
    const user = userEvent.setup();

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    // Fill financial fields
    await user.type(screen.getByLabelText(/guarantee/i), "50000");
    await user.type(screen.getByLabelText(/production costs/i), "15000");
    await user.type(screen.getByLabelText(/merchandise split/i), "85");

    // Verify net profit calculation appears
    await waitFor(() => {
      expect(screen.getByText(/estimated net profit/i)).toBeInTheDocument();
      expect(screen.getByText(/\$35,000/)).toBeInTheDocument(); // 50000 - 15000
    });
  });

  it("validates venue availability", async () => {
    const user = userEvent.setup();

    render(
      <ShowForm venues={mockVenues} tour={mockTour} onSuccess={jest.fn()} />
    );

    // Select venue and date that conflicts with existing show
    await user.selectOptions(screen.getByLabelText(/venue/i), mockVenues[0].id);
    await user.type(screen.getByLabelText(/show date/i), "2024-06-15");
    await user.tab();

    // Mock venue availability check
    await waitFor(() => {
      expect(
        screen.getByText(/checking venue availability/i)
      ).toBeInTheDocument();
    });
  });
});

describe("ShowList Component", () => {
  const mockShows = [testData.shows.madSquareGardenShow];

  it("renders shows list correctly", () => {
    render(<ShowList shows={mockShows} tour={mockTour} />);

    expect(screen.getByText("Madison Square Garden")).toBeInTheDocument();
    expect(screen.getByText("June 15, 2024")).toBeInTheDocument();
    expect(screen.getByText("8:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("handles empty shows list", () => {
    render(<ShowList shows={[]} tour={mockTour} />);

    expect(screen.getByText(/no shows scheduled/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add first show/i })
    ).toBeInTheDocument();
  });

  it("filters shows by status", async () => {
    const user = userEvent.setup();
    const multipleShows = [
      testData.shows.madSquareGardenShow,
      {
        ...testData.shows.madSquareGardenShow,
        id: "show_2",
        status: "on_sale",
      },
    ];

    render(<ShowList shows={multipleShows} tour={mockTour} />);

    // Filter by confirmed status
    await user.selectOptions(
      screen.getByLabelText(/filter by status/i),
      "confirmed"
    );

    await waitFor(() => {
      expect(screen.getAllByText(/confirmed/i)).toHaveLength(1);
    });
  });

  it("sorts shows by date", async () => {
    const user = userEvent.setup();
    const multipleShows = [
      { ...testData.shows.madSquareGardenShow, date: "2024-06-20" },
      {
        ...testData.shows.madSquareGardenShow,
        id: "show_2",
        date: "2024-06-10",
      },
    ];

    render(<ShowList shows={multipleShows} tour={mockTour} />);

    // Sort by date ascending
    await user.selectOptions(screen.getByLabelText(/sort by/i), "date_asc");

    const showItems = screen.getAllByTestId("show-item");
    expect(showItems[0]).toHaveTextContent("June 10, 2024");
    expect(showItems[1]).toHaveTextContent("June 20, 2024");
  });
});
