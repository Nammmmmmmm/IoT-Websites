import React from "react";

export default function Profile() {
  return (
    <div className="bg-gray-200 h-screen flex items-center justify-center ">
      <div className="w-[400px] bg-white rounded-md overflow-hidden">
        <div className="w-full h-[160px] bg-blue-400 flex items-center justify-center">
          <div className="w-[100px] h-[100px] rounded-full bg-white relative overflow-hidden">
            <img
              src="/anh_profile.png"
              alt="profile"
              className="w-full h-full object-cover "
            />
          </div>
        </div>
        <div className="py-6 px-6 ">
          <div className="flex flex-col items-center pb-6">
            <h3 className=" text-3xl font-semibold text-blue-500">
              Phạm Phương Nam
            </h3>
          </div>
          <div className="text-md font-semibold">
            <h3 className="text-sm text-blue-500">Mã Sinh Viên: B21DCCN555 </h3>
            <h3 className="text-sm text-blue-500">Lớp: D21HTTT02 </h3>
            <h3 className="text-sm text-blue-500">Nhóm: 05 </h3>
            <h3 className="text-sm text-blue-500">
              Link bài tập lớn:{" "}
              <a
                href="https://github.com/Nammmmmmmm/IoT-Websites.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </h3>
            <h3 className="text-sm text-blue-500">
              Link quyển PDF:{" "}
              <a
                href="https://github.com/Nammmmmmmm/IoT-Websites.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </h3>
            <h3 className="text-sm text-blue-500">
              Link tài liệu API docs:{" "}
              <a
                href="https://github.com/Nammmmmmmm/IoT-Websites.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
