import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Weather from "../weather";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        name: "Jakarta",
        sys: { country: "ID" },
        main: { temp: 30, humidity: 70 },
        wind: { speed: 5 },
        weather: [{ description: "Sunny" }],
      }),
  })
) as jest.Mock;

// Mocking child component Search
jest.mock("../Search", () => ({ search, setSearch, handleSearch }: any) => (
  <div>
    <input
      type="text"
      placeholder="Enter City Name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button onClick={handleSearch}>Search</button>
  </div>
));

describe("Weather Component Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testing Component Search is work
  test("renders search component", () => {
    render(<Weather />);
    expect(screen.getByPlaceholderText("Enter City Name")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  test("handles fetch error correctly", async () => {
    // Mocking the fetch API to throw an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch"))
    ) as jest.Mock;

    // Mock console.error to suppress error output during test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Weather />);

    // Verify loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      // Ensure the loading state is removed after the error
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Ensure the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Failed to fetch"));

    consoleErrorSpy.mockRestore();
  });

  test("loading should be true when fetchWeatherData is called", async () => {
    // Mocking the fetch API to delay the response
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: () =>
                  Promise.resolve({
                    name: "Jakarta",
                    sys: { country: "ID" },
                    main: { temp: 30, humidity: 70 },
                    wind: { speed: 5 },
                    weather: [{ description: "Sunny" }],
                  }),
              }),
            1000
          )
        )
    ) as jest.Mock;

    const { container } = render(<Weather />);

    // Triggering search to set loading to true
    screen.getByText("Search").click();

    // Check if loading state is true
    await waitFor(() => {
      expect(container.querySelector(".loading")).toBeTruthy();
    });
  });
});
