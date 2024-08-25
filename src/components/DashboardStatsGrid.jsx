import React  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureHigh, faTint, faSun} from '@fortawesome/free-solid-svg-icons'

const getTempColor = (temperature) => {
    const maxHue = 30; 
    const minHue = 0; 
  
    const maxTemperature = 60;
    const minTemperature = -10;
  
    // Điều chỉnh công thức tính hue
    const hue = (temperature - minTemperature) * (maxHue - minHue) / (maxTemperature - minTemperature) + minHue; 
    return `hsl(${hue}, 100%, 50%)`; 
  };
  const getHumColor = (hum) => {
    const maxHue = 220; 
    const minHue = 180; 
  
    const maxHum = 100;
    const minHum = 0;
  
    // Điều chỉnh công thức tính hue
    const hue = (hum - minHum) * (maxHue - minHue) / (maxHum - minHum) + minHue; 
    return `hsl(${hue}, 100%, 50%)`; 
  };
  const getLightColor = (Ligh) => {
    const maxHue = 60; 
    const minHue = 40; 
  
    const maxLi = 1000;
    const minLi = 0;
  
    // Điều chỉnh công thức tính hue
    const hue = (Ligh - minLi) * (maxHue - minHue) / (maxLi - minLi) + minHue; 
    return `hsl(${hue}, 100%, 50%)`; 
  };
export default function DashboardStatsGrid() {
    
  
    return (
        <div className='flex gap-3'>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center '
                        style={{ backgroundColor: getTempColor(32) }}>
                <FontAwesomeIcon icon={faTemperatureHigh} className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                        <span className="text-sm text-gray-500 font-light">Nhiệt độ phòng </span>
                        <div className="flex items-center">
                            <strong className="text-xl text-gray-700 font-semibold">0 °C</strong>
                            <span className="text-sm text-green-500 pl-2">+343</span>
                        </div>
                </div>
            </BoxWrapper>

            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center' 
                    style={{ backgroundColor: getHumColor(60) }}> 
                    <FontAwesomeIcon icon={faTint} className="text-2xl text-white" /> 
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-500 font-light">Độ ẩm</span>
                    <div className="flex items-center">
                        <strong className="text-xl text-gray-700 font-semibold">0%</strong> 
                    </div>
                </div>
            </BoxWrapper>

            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center' 
                    style={{ backgroundColor: getLightColor(600) }}> 
                    <FontAwesomeIcon icon={faSun} className="text-2xl text-white" /> 
                    </div>
                    <div className="pl-4">
                        <span className="text-sm text-gray-500 font-light">Ánh Sáng</span>
                    <div className="flex items-center">
                        <strong className="text-xl text-gray-700 font-semibold">600 Lux</strong> 
                    </div>
                </div>
            </BoxWrapper>

        </div>
  )
}

function BoxWrapper({ children }) {
	return <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}
