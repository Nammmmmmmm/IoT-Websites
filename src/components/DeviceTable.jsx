import React, { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

const sampleData = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  device: `Device ${index + 1}`,
  status: Math.random() > 0.5 ? "Active" : "Inactive",
  startTime: new Date().toLocaleString(),
  endTime: new Date().toLocaleString(),
}));

export default function AttributeTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sampleData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sampleData.length / itemsPerPage);

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

  return (
    <div>
      <div>
        <div className="relative">
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search..."
            className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[24rem] h-10 pl-11 pr-4 rounded-lg"
          />
        </div>
      </div>
      <div className="overflow-y-auto max-h-[500px] mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>ID</th>
              <th>Thiết bị</th>
              <th>Trạng thái</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.device}</td>
                <td>{item.status}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {renderPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-white"
            }`}
            disabled={pageNumber === "..."}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}