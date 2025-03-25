import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getStatusColor } from '../utils/helpers';
import Sidebar from '../components/SideBar';

jest.mock('../utils/helpers', () => ({
  getStatusColor: jest.fn(),
}));

describe('Sidebar Component', () => {
  const mockToggleVisibility = jest.fn();
  const mockSetSearchTerm = jest.fn();
  const mockOnLocationClick = jest.fn();

  const locations = [
    { title: 'Location1', status: 'active', total_planes: 5, capacity: 10 },
    { title: 'Location2', status: 'inactive', total_planes: 3, capacity: 8 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up getStatusColor to return specific colors for testing
    getStatusColor.mockImplementation((status) => {
      if (status === 'active') return 'green';
      if (status === 'inactive') return 'gray';
      return 'blue';
    });
  });

  test('renders search container with collapse button and input field', () => {
    render(
      <Sidebar
        searchTerm="test"
        setSearchTerm={mockSetSearchTerm}
        locations={[]}
        onLocationClick={mockOnLocationClick}
        resetMap={() => {}}
        visible={true}
        toggleVisibility={mockToggleVisibility}
      />
    );

    // Verify the input field is rendered with the correct value
    const input = screen.getByPlaceholderText('Search for an airport...');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('test');

    // Verify the collapse button is rendered
    const collapseButton = document.getElementById('collapse-button');
    expect(collapseButton).toBeInTheDocument();

    // When visible is true, it should render the FaChevronUp icon
    // We can check for an SVG element inside the button
    expect(collapseButton.querySelector('svg')).toBeInTheDocument();
  });

  test('calls toggleVisibility when the collapse button is clicked', () => {
    render(
      <Sidebar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        locations={[]}
        onLocationClick={mockOnLocationClick}
        resetMap={() => {}}
        visible={false}
        toggleVisibility={mockToggleVisibility}
      />
    );

    const collapseButton = document.getElementById('collapse-button');
    fireEvent.click(collapseButton);
    expect(mockToggleVisibility).toHaveBeenCalledTimes(1);
  });

  test('calls setSearchTerm when the search input changes', () => {
    render(
      <Sidebar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        locations={[]}
        onLocationClick={mockOnLocationClick}
        resetMap={() => {}}
        visible={true}
        toggleVisibility={mockToggleVisibility}
      />
    );

    const input = screen.getByPlaceholderText('Search for an airport...');
    fireEvent.change(input, { target: { value: 'New York' } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('New York');
  });

  test('renders locations with status icons and calls onLocationClick when a location is clicked', () => {
    render(
      <Sidebar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        locations={locations}
        onLocationClick={mockOnLocationClick}
        resetMap={() => {}}
        visible={true}
        toggleVisibility={mockToggleVisibility}
      />
    );

    // Check that each location title is rendered
    locations.forEach((loc) => {
      expect(screen.getByText(loc.title)).toBeInTheDocument();
      // Check that the status text (e.g., "5/10") is rendered
      expect(screen.getByText(`${loc.total_planes}/${loc.capacity}`)).toBeInTheDocument();
    });

    // Verify that the status icons have the correct background color
    // We select them by their CSS class
    const statusIcons = document.querySelectorAll('.status-icon');
    expect(statusIcons[0].style.backgroundColor).toBe('green'); // active
    expect(statusIcons[1].style.backgroundColor).toBe('gray');  // inactive

    // Simulate clicking on the first location
    const firstLocation = screen.getByText(locations[0].title);
    fireEvent.click(firstLocation);
    expect(mockOnLocationClick).toHaveBeenCalledWith(locations[0].title);
  });
});
