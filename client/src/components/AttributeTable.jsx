import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns"; // Import thư viện date-fns

export default function AttributeTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [itemsPerPage, setItemsPerPage] = useState(10); // Thay đổi state itemsPerPage
  const [inputPageNumber, setInputPageNumber] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedFilter]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7000/search_attribute", {
        params: {
          searchTerm,
          filter: selectedFilter,
        },
      });
      setData(response.data); // Lấy dữ liệu từ API và lưu vào state
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handleFilterSearch = async () => {
    try {
      const response = await axios.get("http://localhost:7000/search_attribute", {
        params: {
          searchTerm,
          filter: selectedFilter,
        },
      });
      setData(response.data); // Lấy dữ liệu từ API tìm kiếm và lưu vào state
      setCurrentPage(1); // Đặt lại trang hiện tại về trang đầu tiên
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  const handleInputPageChange = () => {
    const pageNumber = parseInt(inputPageNumber, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số lượng mục hiển thị
  };

  return (
    <div>
      <div className="flex space-x-4">
        <div className="relative">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[24rem] h-10 pl-11 pr-4 rounded-lg"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[10rem] h-10 pl-4 pr-4 rounded-lg flex justify-between items-center"
          >
            {selectedFilter === ""
              ? "Select Attribute"
              : selectedFilter.charAt(0).toUpperCase() +
                selectedFilter.slice(1)}
            <span className="ml-2">{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-[10rem] bg-white shadow-lg rounded-lg overflow-hidden z-10">
              <button
                onClick={() => {
                  setSelectedFilter("");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Select Attribute
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("temperature");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Temperature
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("humidity");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Humidity
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("light");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Light
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("radiation");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Radiation
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("dust");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Dust
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("time");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Time
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleFilterSearch}
          className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[8rem] h-10 pl-4 pr-4 rounded-lg bg-blue-500 text-white"
        >
          Search
        </button>
      </div>
      <div className="overflow-y-auto max-h-[500px] mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>
                ID
                <button onClick={() => handleSort("id")}>
                  {sortConfig.key === "id" &&
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
              <th>
                Nhiệt độ
                <button onClick={() => handleSort("temperature")}>
                  {sortConfig.key === "temperature" &&
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
              <th>
                Độ ẩm
                <button onClick={() => handleSort("humidity")}>
                  {sortConfig.key === "humidity" &&
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
              <th>
                Ánh sáng
                <button onClick={() => handleSort("light")}>
                  {sortConfig.key === "light" &&
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
             
              <th>
                Độ bụi
                <button onClick={() => handleSort("dust")}>
                  {sortConfig.key === "dust" &&
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
              <th>
                Thời gian đo
                <button onClick={() => handleSort("measurementTime")}>
                  {sortConfig.key === "measurementTime" &&
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.temperature} °C</td>
                <td>{item.humidity} %</td>
                <td>{item.light} Lux</td>
                <td>{item.dust} µg/m³</td> {/* Thêm cột độ bụi */}
                <td>{format(new Date(item.measurementTime), 'dd/MM/yyyy HH:mm:ss')}</td> {/* Định dạng ngày tháng */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex justify-center">
          {renderPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-white"
              }`}
              disabled={pageNumber === "..."} >
              {pageNumber}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={inputPageNumber}
            onChange={(e) => setInputPageNumber(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-16"
            placeholder="Page"
          />
          <button
            onClick={handleInputPageChange}
            className="ml-2 px-4 py-2 border rounded bg-blue-500 text-white"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}