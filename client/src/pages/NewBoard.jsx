import React from "react";
import ThanhThongBao from "../components/ThanhThongBao";
import DustChart from "../components/Dust";
import DieuKhienThietBi from "../components/DieuKhienThietBi";


export default function Newboard() {
    return (
      <div className='flex flex-col gap-3 p-4 h-screen overflow-y-auto'>
        <ThanhThongBao />
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            <DustChart />
          </div>
          <div className="w-3/10">
            <DieuKhienThietBi />
          </div>
        </div>
      </div>
    );
  }