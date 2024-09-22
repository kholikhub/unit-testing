import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Search from "../search";

describe("Search Component", () => {
  // Testing input and button search
  test("renders input and button", () => {
    render(<Search search="" setSearch={() => {}} handleSearch={() => {}} />);
    expect(screen.getByPlaceholderText("Enter City Name")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });
  // Testing function setSearch when input is changed
  test("calls setSearch on input change", () => {
    const setSearchMock = jest.fn();
    render(
      <Search search="" setSearch={setSearchMock} handleSearch={() => {}} />
    );
    const input = screen.getByPlaceholderText("Enter City Name");

    fireEvent.change(input, { target: { value: "New York" } });
    expect(setSearchMock).toHaveBeenCalledWith("New York");
  });
  // Testing function handleSearch works when user click button search
  test("calls handleSearch on button click", () => {
    const handleSearchMock = jest.fn();
    render(
      <Search search="" setSearch={() => {}} handleSearch={handleSearchMock} />
    );
    const button = screen.getByText("Search");

    fireEvent.click(button);
    expect(handleSearchMock).toHaveBeenCalled();
  });

  test('handleSearch should be called when the search button is clicked', () => {
    const mockSetSearch = jest.fn();
    const mockHandleSearch = jest.fn();
 
    render(
      <Search
        search=""
        setSearch={mockSetSearch}
        handleSearch={mockHandleSearch}
      />
    );

    // Simulate button click
    fireEvent.click(screen.getByText('Search'));

    // Assert handleSearch is called
    expect(mockHandleSearch).toBeTruthy();
    expect(mockHandleSearch).toHaveBeenCalledTimes(1);
  });

});
