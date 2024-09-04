import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan, faLightbulb, faTv } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@headlessui/react"; // Thêm Switch component

function DeviceControlPanel() {
  const [fanIsOn, setFanIsOn] = useState(false);
  const [lightbulbIsOn, setLightbulbIsOn] = useState(false);
  const [tvIsOn, setTvIsOn] = useState(false);

  return (
    <div className="w-[20rem] h-[22rem] bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
      {/* Quạt */}
      <div className="flex items-center mb-4 flex-1 justify-center">
        {" "}
        <div>
          {/* Thêm margin-bottom cho giãn cách */}
          <FontAwesomeIcon icon={faFan} size="2x" spin={fanIsOn} />{" "}
          {/* Giảm kích thước icon */}
          <span className="ml-2">Quạt</span> {/* Thêm nhãn */}
        </div>
        <div className="p-4 flex items-center ml-auto">
          <span className="p-4 font-black text-lg">OFF </span>
          <Switch
            checked={fanIsOn}
            onChange={setFanIsOn}
            className={`${fanIsOn ? "bg-blue-600" : "bg-gray-200"} ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${fanIsOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>

      {/* Đèn */}
      <div className="flex items-center mb-4 flex-1 justify-center">
        <div>
          <FontAwesomeIcon
            icon={faLightbulb}
            size="2x"
            style={{ color: lightbulbIsOn ? "yellow" : "gray" }}
          />
          <span className="ml-5">Đèn</span>
        </div>
        <div className="p-4 flex items-center ml-auto">
          <span className="p-4 font-black text-lg">OFF</span>
          <Switch
            checked={lightbulbIsOn}
            onChange={setLightbulbIsOn}
            className={`${lightbulbIsOn ? "bg-blue-600" : "bg-gray-200"} ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${lightbulbIsOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>

      {/* Tivi */}
      <div className="flex items-center mb-4 flex-1 justify-center">
        <div>
          <FontAwesomeIcon
            icon={faTv}
            size="2x"
            style={{ color: tvIsOn ? "blue" : "gray" }}
          />
          <span className="ml-2">Tivi</span>
        </div>
        <div className="p-4 flex items-center ml-auto">
          <span className="p-4 font-black text-lg">OFF</span>
          <Switch
            checked={tvIsOn}
            onChange={setTvIsOn}
            className={`${tvIsOn ? "bg-blue-600" : "bg-gray-200"} ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${tvIsOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>
    </div>
  );
}

export default DeviceControlPanel;
