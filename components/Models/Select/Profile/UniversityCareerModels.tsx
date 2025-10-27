import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';

// ============================================================================
// MODEL 1: ANIMATED SALARY CHART COMPONENT
// ============================================================================
export const AnimatedSalaryChart = ({ 
  data = null, 
  showTitle = true, 
  size = 200,
  className = "" 
}) => {
  const defaultData = [
    { sector: 'Business Development', min: 27000, max: 71000, color: '#ff6b9d', percentage: 25 },
    { sector: 'Education', min: 30000, max: 45525, color: '#4ecdc4', percentage: 20 },
    { sector: 'Operations', min: 25000, max: 31186, color: '#45b7d1', percentage: 18 },
    { sector: 'Health Services', min: 32300, max: 46600, color: '#96ceb4', percentage: 22 },
    { sector: 'Sales', min: 20000, max: 35000, color: '#feca57', percentage: 15 }
  ];

  const [salaryData] = useState(data || defaultData);
  const [chartRotation, setChartRotation] = useState(0);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setChartRotation(prev => (prev + 0.5) % 360);
    }, 100);

    return () => clearInterval(rotationInterval);
  }, []);

  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.25;

  let currentAngle = 0;

  return (
    <div className={` rounded-xl p-6  ${className}`}>

      
      <div className="relative flex items-center justify-center">
        <svg 
          width={size} 
          height={size} 
          className="transform transition-transform duration-1000"
          style={{ transform: `rotate(${chartRotation}deg)` }}
        >
          {salaryData.map((item, index) => {
            const angle = (item.percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + outerRadius * Math.cos(startAngleRad);
            const y1 = centerY + outerRadius * Math.sin(startAngleRad);
            const x2 = centerX + outerRadius * Math.cos(endAngleRad);
            const y2 = centerY + outerRadius * Math.sin(endAngleRad);
            const x3 = centerX + innerRadius * Math.cos(endAngleRad);
            const y3 = centerY + innerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(startAngleRad);
            const y4 = centerY + innerRadius * Math.sin(startAngleRad);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${x1} ${y1}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
              `L ${x3} ${y3}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
              'Z'
            ].join(' ');
            
            currentAngle = endAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              />
            );
          })}
          
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="white" className="drop-shadow-lg" />
          <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-sm font-bold fill-gray-800">
            £27,000
          </text>
          <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-xs fill-gray-600">
            Average
          </text>
        </svg>
      </div>

      <div className="mt-4 space-y-2">
        {salaryData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700">{item.sector}</span>
            </div>
            <span className="font-semibold text-gray-800">
              £{item.min.toLocaleString()} - £{item.max.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MODEL 2: EMPLOYMENT RATE METER COMPONENT - FIXED
// ============================================================================

interface EmploymentRateMeterProps {
  data?:any
  targetRate?:number
  size?:number
  className?:string
}

export const EmploymentRateMeter:React.FC<EmploymentRateMeterProps> = ({ 
  data = null,  // Add data prop
  targetRate = 82, 
  size = 192,
  className = "" 
}) => {
  const [currentRate, setCurrentRate] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Extract targetRate and size from data if available
  const actualTargetRate = data?.targetRate || targetRate;
  const actualSize = data?.size || size;
  
  console.log("👥 EmploymentRateMeter received data:", data);
  console.log("👥 Using targetRate:", actualTargetRate);
  console.log("👥 Using size:", actualSize);
  
  useEffect(() => {
    if (hasAnimated) return;
    
    const timer = setTimeout(() => {
      const animateRate = () => {
        let step = 0;
        let currentValue = 0;
        
        const animate = () => {
          if (step <= 60) {
            currentValue = Math.min(95 + Math.random() * 5, 100);
            setCurrentRate(currentValue);
            step++;
            setTimeout(animate, 30);
          } else if (step <= 80) {
            const progress = (step - 60) / 20;
            currentValue = 95 + (actualTargetRate - 95) * progress;
            setCurrentRate(currentValue);
            step++;
            setTimeout(animate, 50);
          } else {
            setCurrentRate(actualTargetRate);
            setHasAnimated(true);
          }
        };
        
        animate();
      };
      
      animateRate();
    }, 500);

    return () => clearTimeout(timer);
  }, [actualTargetRate, hasAnimated]);

  const angle = (currentRate / 100) * 180;
  const meterColor = currentRate >= 80 ? '#10b981' : currentRate >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`rounded-xl p-6 ${className}`}>

      
      <div className="relative flex flex-col items-center">
        <div className={`relative mb-4`} style={{ width: actualSize, height: actualSize / 2 }}>
          <svg width={actualSize} height={actualSize / 2} viewBox={`0 0 ${actualSize} ${actualSize / 2}`} className="overflow-visible">
            <path
              d={`M ${actualSize * 0.083} ${actualSize * 0.417} A ${actualSize * 0.417} ${actualSize * 0.417} 0 0 1 ${actualSize * 0.917} ${actualSize * 0.417}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            <path
              d={`M ${actualSize * 0.083} ${actualSize * 0.417} A ${actualSize * 0.417} ${actualSize * 0.417} 0 0 1 ${actualSize * 0.917} ${actualSize * 0.417}`}
              fill="none"
              stroke={meterColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(angle / 180) * 261.8} 261.8`}
              className="transition-all duration-500 ease-out"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            
            <g transform={`translate(${actualSize / 2}, ${actualSize * 0.417}) rotate(${angle - 90})`}>
              <line
                x1="0" y1="0" x2="0" y2={-actualSize * 0.365}
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-transform duration-500 ease-out"
              />
              <circle cx="0" cy="0" r="4" fill="#374151" />
            </g>
          </svg>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {Math.round(currentRate)}
          </div>
          <div className="text-sm text-gray-600">Employment Rate %</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODEL 3: COURSE TIMELINE COMPONENT - FIXED
// ============================================================================
export const CourseTimeline = ({ 
  data = null,  // Add data prop
  events = null, 
  showTitle = true,
  className = "" 
}) => {
  const defaultEvents = [
    { 
      course: 'Business Administration & Management'
    },
    { 
      course: 'Psychology'
    },
    { 
      course: 'Marketing'
    },
    { 
      course: 'Finance, General'
    },
    { 
      course: 'Accounting and Related Services'
    }
  ];

  // Use data prop first, then events prop, then default
  const actualEvents = data || events || defaultEvents;
  
  console.log("📚 CourseTimeline received data:", data);
  console.log("📚 Using events:", actualEvents);

  const [timelineEvents] = useState(actualEvents);
  const [visibleItems, setVisibleItems] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        if (count < timelineEvents.length) {
          setVisibleItems(count + 1);
          count++;
        } else {
          clearInterval(interval);
        }
      }, 300);
    }, 500);

    return () => clearTimeout(timer);
  }, [timelineEvents.length]);

  return (
    <div className={`w-full max-w-xs ${className}`}>

      
      <div className="relative py-4">
        {/* Dynamic vertical line that grows with items */}
        <div 
          className="absolute left-2 top-6 w-0.5 bg-gray-400 transition-all duration-500 ease-out"
          style={{ 
            height: visibleItems > 1 ? `${(visibleItems - 1) * 40}px` : '0px' 
          }}
        ></div>
        
        {timelineEvents.map((item, index) => (
          <div
            key={index}
            className={`relative flex items-center space-x-3 h-10 transform transition-all duration-500 ${
              index < visibleItems ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            {/* Dot marker */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-white">
              </div>
            </div>
            
            {/* Course name */}
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {item.course}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};