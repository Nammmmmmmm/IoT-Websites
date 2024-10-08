import React from "react";

export default function Profile() {
  return (
    <div className="bg-white-300 h-screen flex items-center justify-center relative">
      {/* Meme bên trái */}
      {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <img
          src="https://giphy.com/embed/3ohhwoTdxn7PHB7hQI"
          alt="meme-left"
          className="w-[100px] h-[100px]"
        />
      </div> */}
      {/* Profile */}
      <div className="w-[600px] bg-white rounded-md overflow-hidden mt-[-50px]">
        <div className="w-full h-[240px] bg-blue-400 flex items-center justify-center">
          <div className="w-[150px] h-[150px] rounded-full bg-white relative overflow-hidden">
            <img
              src="/anh_profile.png"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="py-8 px-8">
          <div className="flex flex-col items-center pb-8">
            <h3 className="text-4xl font-semibold text-black-500">
              Phạm Phương Nam
            </h3>
          </div>
          <div className="text-lg font-semibold">
            <h3 className="text-md text-black-500">Mã Sinh Viên: B21DCCN555</h3>
            <h3 className="text-md text-black-500">Lớp: D21HTTT02</h3>
            <h3 className="text-md text-black-500">Nhóm: 05</h3>
            <h3 className="text-md text-black-500">
              Link bài tập lớn:{" "}
              <a
                href="https://github.com/Nammmmmmmm/IoT-Websites.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </h3>
            <h3 className="text-md text-black-500">
              Link quyển PDF:{" "}
              <a
                href="https://github.com/Nammmmmmmm/IoT-Websites.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                PDF
              </a>
            </h3>
            <h3 className="text-md text-black-500">
              Link tài liệu API docs:{" "}
              <a
                href="https://github.com/Nammmmmmmm/IoT-Websites.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                API DOCS
              </a>
            </h3>
          </div>
        </div>
      </div>

      {/* Meme bên phải */}
      {/* <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <img
          src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
          alt="meme-right"
          className="w-[100px] h-[100px]"
        />
      </div> */}
    </div>
  );
}