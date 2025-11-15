import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// EarlyAccessForm tests removed - component deprecated in favor of direct signup

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock waitlist API
const mockSubmitWaitlist = jest.fn();
jest.mock("../../../../apps/web/src/lib/api", () => ({
  submitWaitlistEntry: (...args: any[]) => mockSubmitWaitlist(...args),
}));

describe("EarlyAccessForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(<EarlyAccessForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join waitlist/i })
    ).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();

    render(<EarlyAccessForm />);

    // Try to submit empty form
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/role is required/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();

    render(<EarlyAccessForm />);

    // Enter invalid email
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });

    // Enter valid email
    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.queryByText(/invalid email format/i)
      ).not.toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();

    mockSubmitWaitlist.mockResolvedValueOnce({
      id: "waitlist_123",
      email: "test@example.com",
      name: "John Doe",
      role: "artist",
    });

    render(<EarlyAccessForm />);

    // Fill form with valid data
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.selectOptions(screen.getByLabelText(/role/i), "artist");

    // Submit form
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    await waitFor(() => {
      expect(mockSubmitWaitlist).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "John Doe",
        role: "artist",
      });
    });

    // Verify success message
    await waitFor(() => {
      expect(
        screen.getByText(/thank you for joining our waitlist/i)
      ).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const user = userEvent.setup();

    mockSubmitWaitlist.mockRejectedValueOnce(new Error("Email already exists"));

    render(<EarlyAccessForm />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/email/i), "existing@example.com");
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.selectOptions(screen.getByLabelText(/role/i), "artist");
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();

    // Mock slow API response
    mockSubmitWaitlist.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<EarlyAccessForm />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.selectOptions(screen.getByLabelText(/role/i), "artist");
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    // Verify loading state
    expect(screen.getByText(/joining waitlist/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /joining waitlist/i })
    ).toBeDisabled();
  });

  it("tracks form interactions for analytics", async () => {
    const user = userEvent.setup();
    const mockTrack = jest.fn();

    render(<EarlyAccessForm onTrack={mockTrack} />);

    // Fill form and track interactions
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    expect(mockTrack).toHaveBeenCalledWith("waitlist_email_entered");

    await user.selectOptions(screen.getByLabelText(/role/i), "artist");
    expect(mockTrack).toHaveBeenCalledWith("waitlist_role_selected", {
      role: "artist",
    });
  });
});

describe("HeroSection Component", () => {
  it("renders hero content correctly", () => {
    render(<HeroSection />);

    expect(
      screen.getByText(/the all-in-one tour management platform/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/streamline your music tours/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join early access/i })
    ).toBeInTheDocument();
  });

  it("handles CTA button click", async () => {
    const user = userEvent.setup();
    const mockOnCtaClick = jest.fn();

    render(<HeroSection onCtaClick={mockOnCtaClick} />);

    await user.click(
      screen.getByRole("button", { name: /join early access/i })
    );

    expect(mockOnCtaClick).toHaveBeenCalled();
  });

  it("displays hero image correctly", () => {
    render(<HeroSection />);

    const heroImage = screen.getByAltText(/tourbrain platform dashboard/i);
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src");
  });

  it("animates on scroll into view", async () => {
    render(<HeroSection />);

    const heroSection = screen.getByTestId("hero-section");

    // Mock intersection observer
    const mockIntersectionObserver = jest.fn();
    global.IntersectionObserver = jest
      .fn()
      .mockImplementation(mockIntersectionObserver);

    // Trigger animation
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    expect(heroSection).toHaveClass(/animate-fade-in/);
  });
});

describe("WaitlistSection Component", () => {
  it("renders waitlist section correctly", () => {
    render(<WaitlistSection />);

    expect(
      screen.getByText(/join the early access waitlist/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/be among the first/i)).toBeInTheDocument();
    expect(screen.getByTestId("waitlist-form")).toBeInTheDocument();
  });

  it("includes social proof elements", () => {
    render(<WaitlistSection />);

    expect(
      screen.getByText(/join 500\+ industry professionals/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("testimonial-carousel")).toBeInTheDocument();
  });

  it("handles successful form submission", async () => {
    const user = userEvent.setup();

    mockSubmitWaitlist.mockResolvedValueOnce({ success: true });

    render(<WaitlistSection />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.selectOptions(screen.getByLabelText(/role/i), "artist");
    await user.click(screen.getByRole("button", { name: /join waitlist/i }));

    // Verify success state
    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      expect(screen.queryByTestId("waitlist-form")).not.toBeVisible();
    });
  });
});

describe("ProductPillarsSection Component", () => {
  it("renders all product pillars", () => {
    render(<ProductPillarsSection />);

    expect(screen.getByText(/tour management/i)).toBeInTheDocument();
    expect(screen.getByText(/venue booking/i)).toBeInTheDocument();
    expect(screen.getByText(/financial tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/ai insights/i)).toBeInTheDocument();
  });

  it("displays pillar icons and descriptions", () => {
    render(<ProductPillarsSection />);

    // Verify each pillar has icon and description
    const pillars = [
      "tour-management",
      "venue-booking",
      "financial-tracking",
      "ai-insights",
    ];

    pillars.forEach((pillar) => {
      expect(screen.getByTestId(`${pillar}-icon`)).toBeInTheDocument();
      expect(screen.getByTestId(`${pillar}-description`)).toBeInTheDocument();
    });
  });

  it("animates pillars on scroll", async () => {
    render(<ProductPillarsSection />);

    const pillarSection = screen.getByTestId("product-pillars-section");

    // Simulate scroll intersection
    fireEvent.scroll(window, { target: { scrollY: 500 } });

    await waitFor(() => {
      expect(pillarSection).toHaveClass(/animate-slide-up/);
    });
  });
});

describe("HowItWorksSection Component", () => {
  it("renders workflow steps correctly", () => {
    render(<HowItWorksSection />);

    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
    expect(screen.getByText(/create your tour/i)).toBeInTheDocument();
    expect(screen.getByText(/book venues/i)).toBeInTheDocument();
    expect(screen.getByText(/manage shows/i)).toBeInTheDocument();
    expect(screen.getByText(/track financials/i)).toBeInTheDocument();
  });

  it("displays step numbers and descriptions", () => {
    render(<HowItWorksSection />);

    // Verify step numbers
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    // Verify step descriptions exist
    expect(screen.getByTestId("step-1-description")).toBeInTheDocument();
    expect(screen.getByTestId("step-2-description")).toBeInTheDocument();
    expect(screen.getByTestId("step-3-description")).toBeInTheDocument();
    expect(screen.getByTestId("step-4-description")).toBeInTheDocument();
  });
});

describe("RoleChooserSection Component", () => {
  it("renders role options correctly", () => {
    render(<RoleChooserSection />);

    expect(screen.getByText(/choose your role/i)).toBeInTheDocument();
    expect(screen.getByTestId("role-artist")).toBeInTheDocument();
    expect(screen.getByTestId("role-promoter")).toBeInTheDocument();
    expect(screen.getByTestId("role-venue")).toBeInTheDocument();
    expect(screen.getByTestId("role-agent")).toBeInTheDocument();
  });

  it("handles role selection", async () => {
    const user = userEvent.setup();

    render(<RoleChooserSection />);

    // Select artist role
    await user.click(screen.getByTestId("role-artist"));

    // Verify role is selected
    expect(screen.getByTestId("role-artist")).toHaveClass(/selected/);

    // Verify role-specific content appears
    expect(screen.getByTestId("artist-specific-content")).toBeVisible();
  });

  it("updates content based on selected role", async () => {
    const user = userEvent.setup();

    render(<RoleChooserSection />);

    // Select promoter role
    await user.click(screen.getByTestId("role-promoter"));

    // Verify promoter-specific content
    expect(screen.getByText(/for promoters/i)).toBeInTheDocument();
    expect(screen.getByText(/manage multiple tours/i)).toBeInTheDocument();
  });
});

describe("ComparisonTable Component", () => {
  const mockComparisonData = testData.comparison;

  it("renders comparison table correctly", () => {
    render(<ComparisonTable data={mockComparisonData} />);

    expect(screen.getByText(/feature comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/tourbrain/i)).toBeInTheDocument();
    expect(screen.getByText(/current tools/i)).toBeInTheDocument();
  });

  it("displays feature comparisons", () => {
    render(<ComparisonTable data={mockComparisonData} />);

    // Verify features are displayed
    mockComparisonData.features.forEach((feature) => {
      expect(screen.getByText(feature.name)).toBeInTheDocument();
    });
  });

  it("highlights TourBrain advantages", () => {
    render(<ComparisonTable data={mockComparisonData} />);

    // Verify TourBrain column is highlighted
    const tourbrainColumn = screen.getByTestId("tourbrain-column");
    expect(tourbrainColumn).toHaveClass(/highlighted/);
  });
});

describe("FAQ Component", () => {
  const mockFaqData = testData.faq;

  it("renders FAQ items correctly", () => {
    render(<FAQ data={mockFaqData} />);

    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();

    // Verify first FAQ item
    expect(screen.getByText(mockFaqData.items[0].question)).toBeInTheDocument();
  });

  it("handles FAQ accordion interaction", async () => {
    const user = userEvent.setup();

    render(<FAQ data={mockFaqData} />);

    const firstQuestion = screen.getByText(mockFaqData.items[0].question);

    // Initially collapsed
    expect(screen.queryByText(mockFaqData.items[0].answer)).not.toBeVisible();

    // Click to expand
    await user.click(firstQuestion);
    expect(screen.getByText(mockFaqData.items[0].answer)).toBeVisible();

    // Click to collapse
    await user.click(firstQuestion);
    expect(screen.queryByText(mockFaqData.items[0].answer)).not.toBeVisible();
  });

  it("allows multiple FAQs to be open simultaneously", async () => {
    const user = userEvent.setup();

    render(<FAQ data={mockFaqData} allowMultiple />);

    // Open first FAQ
    await user.click(screen.getByText(mockFaqData.items[0].question));
    expect(screen.getByText(mockFaqData.items[0].answer)).toBeVisible();

    // Open second FAQ
    await user.click(screen.getByText(mockFaqData.items[1].question));
    expect(screen.getByText(mockFaqData.items[1].answer)).toBeVisible();

    // Verify both are still open
    expect(screen.getByText(mockFaqData.items[0].answer)).toBeVisible();
    expect(screen.getByText(mockFaqData.items[1].answer)).toBeVisible();
  });
});
