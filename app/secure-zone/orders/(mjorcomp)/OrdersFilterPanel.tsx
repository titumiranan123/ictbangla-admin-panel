import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import OrderFilters from "../OrderFilters";

interface Props {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  searchInput: string;
  setSearchInput: (value: string) => void;
  isFilterPanelOpen: boolean;
  setIsFilterPanelOpen: (value: boolean) => void;
  uniqueCourses: any[];
  resetFilters: () => void;
  setEditFormData: (value: boolean) => void;
}

const OrdersFilterPanel = ({
  filters,
  setFilters,
  searchInput,
  setSearchInput,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  uniqueCourses,
  resetFilters,
  setEditFormData,
}: Props) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        {/* Search Box */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setEditFormData(true)}
            className="p-1 text-purple-500 hover:text-purple-700"
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="px-4 py-2 border rounded flex items-center gap-2"
          >
            {isFilterPanelOpen ? <CloseIcon /> : <FilterIcon />}
            <span>Filters</span>
          </button>
          {Object.values(filters).some(
            (val) => val !== "" && val !== "FROM_NEW" && val !== 10 && val !== 1
          ) && (
            <button onClick={resetFilters} className="px-4 py-2 border rounded">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterPanelOpen && (
        <OrderFilters
          filters={filters}
          uniqueCourses={uniqueCourses}
          onFilterChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              [e.target.name]: e.target.value,
              page: 1,
            }))
          }
          onResetFilters={resetFilters}
        />
      )}
    </div>
  );
};

export default OrdersFilterPanel;
