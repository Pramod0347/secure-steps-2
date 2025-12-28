import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  GraduationCap,
  Building2,
  Clock,
  Users,
  Calendar,
  X,
  LucideIcon
} from 'lucide-react';

// Import the three models
import { AnimatedSalaryChart } from '@/components/Models/Select/Profile/UniversityCareerModels';
import { EmploymentRateMeter } from '@/components/Models/Select/Profile/UniversityCareerModels';
import { CourseTimeline } from '@/components/Models/Select/Profile/UniversityCareerModels';

interface CareerOutcomeItem {
  id: number;
  iconName: string;
  iconImage?: string;
  title: string;
  value: string;
  description: string;
  details: string;
  color: string;
  bgColor: string;
  component?: 'AnimatedSalaryChart' | 'EmploymentRateMeter' | 'CourseTimeline';
  rawData?: any;
}

// Correct type based on actual data structure
type ActualCareerOutcomeData = {
  id: string;
  type: "SALARY_CHART" | "EMPLOYMENT_RATE_METER" | "COURSE_TIMELINE";
  universityId: string;
  salaryChartData?: Array<{
    id: string;
    sector: string;
    min: number;
    max: number;
    color: string;
    percentage: number;
    careerOutcomeId: string;
  }>;
  employmentRateMeter?: {
    id: string;
    targetRate: number;
    size: number;
    careerOutcomeId: string;
  };
  courseTimelineData?: Array<{
    id: string;
    course: string;
    careerOutcomeId: string;
  }>;
};

interface UniversityCareerOutcomesProps {
  universityData?: any | null;
  title?: string;
}

const UniversityCareerOutcomes: React.FC<UniversityCareerOutcomesProps> = ({
  universityData = null,
  title = "University Career Outcomes"
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<CareerOutcomeItem | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [circleFillPercentage, setCircleFillPercentage] = useState<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef<boolean>(false);

  // Transform server data to component format - FIXED VERSION
  const transformActualDataToDisplayData = (data: ActualCareerOutcomeData | ActualCareerOutcomeData[]): CareerOutcomeItem[] => {

    const transformedItems: CareerOutcomeItem[] = [];

    if (!data) {
      return [];
    }

    // Convert single object to array for uniform processing
    const dataArray = Array.isArray(data) ? data : [data];

    dataArray.forEach((outcome, index) => {
      
      // Safety check
      if (!outcome) {
        return;
      }
      
      // More lenient check - allow outcomes without id if they have data
      if (!outcome.id && !outcome.salaryChartData && !outcome.employmentRateMeter && !outcome.courseTimelineData) {
        return;
      }

      // Add Salary Chart if data exists
      if (outcome.salaryChartData && Array.isArray(outcome.salaryChartData) && outcome.salaryChartData.length > 0) {
        // Filter out invalid entries
        const salaryData = outcome.salaryChartData.filter(item => 
          item && 
          typeof item.sector === 'string' && 
          item.sector.trim() !== '' &&
          typeof item.min === 'number' &&
          typeof item.max === 'number'
        );
        
        if (salaryData.length > 0) {
          const avgSalary = salaryData.reduce((acc, item) => {
            const avg = (item.min + item.max) / 2;
            const scaledAvg = avg * 1000; // Scale up the values
            return acc + scaledAvg;
          }, 0) / salaryData.length;

          const salaryItem: CareerOutcomeItem = {
            id: 1,
            iconName: 'Briefcase',
            title: "Roles and Paycheck",
            value: `$${Math.round(avgSalary).toLocaleString()}`,
            description: "Median starting salary for graduates",
            details: "Competitive starting salaries across different sectors and roles.",
            color: "from-orange-400 to-red-500",
            bgColor: "bg-gradient-to-br from-orange-50 to-red-50 ",
            component: 'AnimatedSalaryChart',
            rawData: salaryData
          };
          transformedItems.push(salaryItem);
        } 
      }

      // Add Employment Rate if data exists
      if (outcome.employmentRateMeter && 
          typeof outcome.employmentRateMeter.targetRate === 'number' &&
          typeof outcome.employmentRateMeter.size === 'number') {
        const employmentData = outcome.employmentRateMeter;

        const employmentItem: CareerOutcomeItem = {
          id: 2,
          iconName: 'Users',
          title: "Employment Rate",
          value: `${employmentData.targetRate}%`,
          description: "Graduates employed post-graduation",
          details: "High employment rate reflects strong industry connections and comprehensive career preparation programs.",
          color: "from-pink-400 to-purple-500",
          bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
          component: 'EmploymentRateMeter',
          rawData: employmentData
        };

        transformedItems.push(employmentItem);
      } 

      // Add Course Timeline if data exists
      if (outcome.courseTimelineData && 
          Array.isArray(outcome.courseTimelineData) && 
          outcome.courseTimelineData.length > 0) {
        
        // Filter out invalid entries
        const validTimelineData = outcome.courseTimelineData.filter(item => 
          item && 
          typeof item.course === 'string' && 
          item.course.trim() !== ''
        );
        
        if (validTimelineData.length === 0) {
          console.log("📚 No valid course timeline data after filtering");
        } else {
          const courseItem: CareerOutcomeItem = {
            id: 3,
            iconName: 'TrendingUp',
            title: "Courses in Demand",
            value: `${validTimelineData.length} Courses`,
            description: "Popular courses with strong market demand",
            details: "Our courses are designed to meet current industry needs and future market trends.",
            color: "from-yellow-400 to-orange-500",
            bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50 ",
            component: 'CourseTimeline',
            rawData: validTimelineData
          };

          transformedItems.push(courseItem);
        }
      }
    });

    return transformedItems;
  };

  // Icon mapping with proper typing
  const iconMap: Record<string, LucideIcon> = {
    TrendingUp,
    Briefcase,
    DollarSign,
    GraduationCap,
    Building2,
    Clock,
    Users,
    Calendar
  };

  // Get icon component with proper typing
  const getIconComponent = (iconName: string): LucideIcon => {
    return iconMap[iconName] || TrendingUp;
  };

  // Component mapping with data passing
  const getModelComponent = (componentName?: string, rawData?: any) => {

    switch (componentName) {
      case 'AnimatedSalaryChart':
        return <AnimatedSalaryChart data={rawData} />;
      case 'EmploymentRateMeter':
        return <EmploymentRateMeter data={rawData} />;
      case 'CourseTimeline':
        return <CourseTimeline data={rawData} />;
      default:
        return <div className="text-center text-gray-500 p-4">No data available</div>;
    }
  };

  // Transform server data to display format - FIXED LOGIC
  const displayData: CareerOutcomeItem[] = React.useMemo(() => {

    // Check if we have valid server data - must be truthy AND have actual content
    // First check if it's null or undefined
    if (universityData === null || universityData === undefined) {
      return [];
    }
    
    // Check if it's an empty object
    if (typeof universityData === 'object' && !Array.isArray(universityData) && Object.keys(universityData).length === 0) {
      return [];
    }
    
    // Check if we have valid server data with actual content
    if (typeof universityData === 'object' && 
        (universityData.id || 
         universityData.salaryChartData || 
         universityData.employmentRateMeter || 
         universityData.courseTimelineData ||
         Array.isArray(universityData))) {
      const transformed = transformActualDataToDisplayData(universityData);

      if (transformed.length > 0) {
        return transformed.slice(0, 3);
      } else {
        return [];
      }
    }

    return [];
  }, [universityData]);

  // If no data at all, don't render
  if (!displayData || displayData.length === 0) {
   
    return (
      <div className="relative w-screen max-w-6xl mx-auto p-8 rounded-3xl">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 text-center">{title}</h2>
          <p className="text-gray-500">No career outcome data available</p>
          {/* <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 font-semibold mb-2">Debug Info:</p>
            <pre className="text-xs mt-2 overflow-auto text-left bg-white p-2 rounded border">
              {JSON.stringify({ 
                hasUniversityData: !!universityData,
                universityDataType: typeof universityData,
                universityDataIsArray: Array.isArray(universityData),
                universityDataKeys: universityData ? Object.keys(universityData) : [],
                displayDataLength: displayData?.length,
                universityDataSample: universityData ? {
                  id: universityData.id,
                  type: universityData.type,
                  hasSalaryChartData: !!universityData.salaryChartData,
                  salaryChartDataLength: universityData.salaryChartData?.length,
                  hasEmploymentRateMeter: !!universityData.employmentRateMeter,
                  hasCourseTimelineData: !!universityData.courseTimelineData,
                  courseTimelineDataLength: universityData.courseTimelineData?.length,
                } : null
              }, null, 2)}
            </pre>
          </div> */}
        </div>
      </div>
    );
  }


  // Simplified scroll lock
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleIconHover = (item: CareerOutcomeItem, event: React.MouseEvent): void => {
    clearHoverTimeout();
    isHoveringRef.current = true;

    setMousePosition({ x: event.clientX, y: event.clientY });
    setModalData(item);
    setShowModal(true);
    setCircleFillPercentage(0);
    
    // Trigger animation after modal is shown
    setTimeout(() => {
      setCircleFillPercentage(0.75);
    }, 100);
  };

  const handleIconLeave = (): void => {
    isHoveringRef.current = false;

    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setShowModal(false);
        setModalData(null);
      }
    }, 150);
  };

  const handleModalEnter = (): void => {
    clearHoverTimeout();
    isHoveringRef.current = true;
  };

  const handleModalLeave = (): void => {
    isHoveringRef.current = false;
    setCircleFillPercentage(0);
    clearHoverTimeout();
    setShowModal(false);
    setModalData(null);
  };

  const closeModal = (): void => {
    clearHoverTimeout();
    isHoveringRef.current = false;
    setShowModal(false);
    setModalData(null);
  };

  // Initialize with first modal open by default
  useEffect(() => {
    if (displayData && displayData.length > 0) {
      setModalData(displayData[1]);
      setShowModal(true);
      // Set circle fill for first item
      setTimeout(() => {
        setCircleFillPercentage(0.75);
      }, 100);
    }
  }, [displayData]);

  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, []);

  const getModalStyle = () => {
    const modalWidth = 500;
    const modalHeight = 600;
    const padding = 24;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = mousePosition.x - modalWidth / 2;
    let top = mousePosition.y - modalHeight / 2;

    if (left + modalWidth > viewportWidth - padding) {
      left = viewportWidth - modalWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    if (top + modalHeight > viewportHeight - padding) {
      top = viewportHeight - modalHeight - padding;
    }
    if (top < padding) {
      top = padding;
    }

    left = Math.max(padding, Math.min(left, viewportWidth - modalWidth - padding));
    top = Math.max(padding, Math.min(top, viewportHeight - modalHeight - padding));

    const style = {
      left: `${left}px`,
      top: `${top}px`,
      position: 'fixed' as const
    };
    return style;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8 rounded-3xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 text-center">{title}</h2>
      </div>

      {/* Icons Grid */}
      <div className="flex justify-around items-center gap-12 md:gap-16 flex-wrap">
        {displayData.map((item: CareerOutcomeItem) => {

          if (!item || !item.id) {
            return null;
          }

          const IconComponent = getIconComponent(item.iconName);
          const itemColor = item.color || "from-blue-400 to-purple-500";

          return (
            <div
              key={item.id}
              className="relative group cursor-pointer flex flex-col items-center"
              onMouseEnter={(e) => {
                handleIconHover(item, e);
              }}
              onMouseLeave={() => {
                handleIconLeave();
              }}
            >
              {/* Outer Glow Background */}
              <div className="absolute -inset-6 bg-gradient-to-br rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
                style={{
                  background: `linear-gradient(135deg, rgba(${itemColor.includes('orange') ? '255,140,83' : itemColor.includes('purple') ? '236,72,153' : '250,204,21'}, 0.3) 0%, rgba(${itemColor.includes('orange') ? '239,68,68' : itemColor.includes('purple') ? '168,85,247' : '245,158,11'}, 0.2) 100%)`
                }}
              ></div>

              {/* Icon Container */}
              <div className={`
                w-32 h-32 rounded-3xl shadow-2xl flex items-center justify-center
                bg-gradient-to-br ${!item.iconImage && itemColor}
                transform transition-all duration-300 ease-in-out
                group-hover:scale-110 group-hover:shadow-2xl group-hover:-translate-y-2
                relative overflow-hidden border-8 border-white
              `}
              style={{
                boxShadow: `0 0 30px rgba(${itemColor.includes('orange') ? '255,122,69,0.4' : itemColor.includes('purple') ? '168,85,247,0.4' : '234,179,8,0.4'})`,
              }}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl"></div>

                {item.iconImage ? (
                  <img
                    src={item.iconImage}
                    alt={item.title}
                    className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <IconComponent
                    size={56}
                    className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                )}

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>

              {/* Icon Label */}
              <div className="mt-5 text-center">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
                  {item.title || "Career Metric"}
                </p>
                <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.value || "N/A"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
            onClick={() => {
              closeModal();
            }}
          ></div>

          <div
            ref={modalRef}
            className={`
              max-w-lg w-full rounded-3xl p-6 transform transition-all duration-200 pointer-events-auto
              ${modalData.bgColor || "bg-gradient-to-br from-blue-50 to-purple-50"} border border-white/20 shadow-2xl
              animate-in zoom-in-95 fade-in duration-200 min-h-0
            `}
            style={getModalStyle()}
            onMouseEnter={() => {
              handleModalEnter();
            }}
            onMouseLeave={() => {
              handleModalLeave();
            }}
          >
            {/* Header with Icon */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${!modalData.iconImage && (modalData.color || "from-blue-400 to-purple-500")} flex items-center justify-center shadow-lg mr-3 flex-shrink-0 border-[5px] border-white`}>
                  {modalData.iconImage ? (
                    <img
                      src={modalData.iconImage}
                      alt={modalData.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    React.createElement(getIconComponent(modalData.iconName), {
                      size: 20,
                      className: "text-white"
                    })
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Statistics</p>
                  <div className='flex items-center justify-between'>
                    <h3 className="text-lg font-bold text-slate-800 truncate flex-1">
                      {modalData.title || "Career Metric"}
                    </h3>
                    <div className="flex flex-col space-y-1 ml-3">
                      {[0, 1, 2].map((i: number) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full bg-gradient-to-r ${modalData.color || "from-blue-400 to-purple-500"} animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  closeModal();
                }}
                className="flex-shrink-0 ml-2"
              >
                <X size={20} className=" text-black hover:text-slate-600" />
              </button>
            </div>

            {/* Model Component Section - Different layouts for each component */}
            <div>
              {modalData.component === 'AnimatedSalaryChart' && modalData.rawData ? (
                <div className="flex flex-col items-center justify-center">
                  {/* Circular Progress - Speedometer Style */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-full h-[24rem]" viewBox="0 0 200 200">
                      {/* Background Arc (White) - from bottom-left going up and around */}
                      <path
                        d="M 50 150 A 70 70 0 1 1 150 150"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      {/* Progress Arc - fills from bottom-left upward */}
                      <path
                        d="M 50 150 A 70 70 0 1 1 150 150"
                        fill="none"
                        stroke="#FD7935"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.PI * 70 * 1.5 * circleFillPercentage} ${Math.PI * 70 * 1.5}`}
                        style={{ transition: 'stroke-dasharray 2s ease-in-out' }}
                      />
                    </svg>
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <p className="text-slate-500 text-xl mb-1">Average Income</p>
                      <p className="text-4xl font-bold text-slate-800">
                        {modalData.value}
                      </p>
                    </div>
                  </div>

                  {/* Salary Breakdown Grid */}
                  <div className="w-full grid grid-cols-2 gap-3">
                    {modalData.rawData?.map((item: any, index: number) => (
                      <div key={index} className="bg-white/60 rounded-lg p-3 hover:bg-white/80 transition-colors duration-200 shadow relative">
                        <p className="text-xs text-slate-500 mb-1">{item.sector}</p>
                        <p className="text-sm font-extrabold text-slate-800">
                          £{item.min?.toLocaleString()} – £{item.max?.toLocaleString()}
                        </p>
                        <svg className="w-4 h-4 text-slate-400 mt-2 absolute bottom-[-5px] right-[-5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ) : modalData.component === 'EmploymentRateMeter' && modalData.rawData ? (
                <div className="flex flex-col items-center justify-center">
                  {/* Circular Gauge - Speedometer Style */}
                  <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      {/* Background Arc (White) - from bottom-left going up and around */}
                      <path
                        d="M 50 150 A 70 70 0 1 1 150 150"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />
                      {/* Progress Arc - fills from bottom-left upward */}
                      <path
                        d="M 50 150 A 70 70 0 1 1 150 150"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.PI * 70 * 1.5 * (modalData.rawData.targetRate / 100)} ${Math.PI * 70 * 1.5}`}
                        style={{ transition: 'stroke-dasharray 2s ease-in-out' }}
                      />
                      {/* Indicator Dot - positioned at the end of progress arc */}
                      <circle
                        cx={100 + 70 * Math.cos(-Math.PI / 4 + (modalData.rawData.targetRate / 100) * Math.PI * 1.5)}
                        cy={100 + 70 * Math.sin(-Math.PI / 4 + (modalData.rawData.targetRate / 100) * Math.PI * 1.5)}
                        r="8"
                        fill="#a855f7"
                      />
                    </svg>
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-slate-800">
                        {modalData.rawData.targetRate}%
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="w-full text-center">
                    <p className="text-slate-600 text-sm">
                      Average salary : <span className="font-semibold">{modalData.value}</span>
                    </p>
                  </div>
                </div>
              ) : modalData.component === 'CourseTimeline' && modalData.rawData ? (
                <div className="flex flex-col py-4 max-h-96 overflow-y-auto">
                  {/* Course List */}
                  <div className="space-y-3">
                    {modalData.rawData?.map((item: any, index: number) => (
                      <div key={index} className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors duration-200 shadow flex items-center justify-between group">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-white">{String.fromCharCode(65 + (index % 26))}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-800">{item.course}</span>
                        </div>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                getModelComponent(modalData.component, modalData.rawData)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityCareerOutcomes;