import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import axios from "axios";

export default function AttributeTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterTriggered, setFilterTriggered] = useState(false);
  const [inputPageNumber, setInputPageNumber] = useState("");
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7000/data_device");
      const data = response.data;
      setData(data);
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchClick = () => {
    setFilterTriggered(!filterTriggered);
  };

  const filteredData = [...data].filter((item) => {
    return (
      (selectedFilter === "" || item.device.includes(selectedFilter)) &&
      (item.device.includes(searchTerm) ||
        item.status.includes(searchTerm) ||
        item.measurementTime.includes(searchTerm))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
  const handleInputPageChange = () => {
    const pageNumber = parseInt(inputPageNumber, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
            className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[10rem] h-10 pl-4 pr-4 rounded-lg"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedFilter === "" ? "Select Device" : selectedFilter}
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
                Select Device
              </button>
              {["Fan", "TV", "Lamp"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSearchClick}
          className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[8rem] h-10 pl-4 pr-4 rounded-lg bg-blue-500 text-white"
        >
          Search
        </button>
      </div>
      <div className="overflow-y-auto max-h-[500px] mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>ID</th>
              <th>Thiết bị</th>
              <th>Trạng thái</th>
              <th>Thời gian đo</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.device}</td>
                <td>{item.status}</td>
                <td>{item.measurementTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div></div>
        <div className="flex justify-center">
          {renderPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              disabled={pageNumber === "..."}
            >
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
