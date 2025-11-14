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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef<boolean>(false);

  console.log("🚀 UniversityCareerOutcomes Component Initialized");
  console.log("📊 universityData prop received:", universityData);
  console.log("📊 universityData type:", typeof universityData);
  console.log("📊 universityData isArray:", Array.isArray(universityData));

  // Transform server data to component format - FIXED VERSION
  const transformActualDataToDisplayData = (data: ActualCareerOutcomeData | ActualCareerOutcomeData[]): CareerOutcomeItem[] => {
    console.log("🔄 Starting data transformation");
    console.log("🔄 Input data type:", typeof data);
    console.log("🔄 Input data isArray:", Array.isArray(data));
    console.log("🔄 Input data:", JSON.stringify(data, null, 2));

    const transformedItems: CareerOutcomeItem[] = [];

    if (!data) {
      console.log("❌ No career outcome data provided");
      return [];
    }

    // Convert single object to array for uniform processing
    const dataArray = Array.isArray(data) ? data : [data];
    console.log("✅ Processing career outcome data with", dataArray.length, "items");

    dataArray.forEach((outcome, index) => {
      console.log(`🔍 Processing outcome ${index}:`, outcome);
      console.log(`🔍 Outcome ID: ${outcome?.id}`);
      console.log(`🔍 Outcome Type: ${outcome?.type}`);
      console.log(`🔍 University ID: ${outcome?.universityId}`);
      console.log(`🔍 Outcome keys:`, outcome ? Object.keys(outcome) : []);
      console.log(`🔍 Has salaryChartData:`, !!outcome?.salaryChartData, outcome?.salaryChartData?.length);
      console.log(`🔍 Has employmentRateMeter:`, !!outcome?.employmentRateMeter);
      console.log(`🔍 Has courseTimelineData:`, !!outcome?.courseTimelineData, outcome?.courseTimelineData?.length);
      
      // Safety check
      if (!outcome) {
        console.log(`⚠️ Skipping null/undefined outcome at index ${index}`);
        return;
      }
      
      // More lenient check - allow outcomes without id if they have data
      if (!outcome.id && !outcome.salaryChartData && !outcome.employmentRateMeter && !outcome.courseTimelineData) {
        console.log(`⚠️ Skipping outcome at index ${index} - no id and no data`);
        return;
      }

      // Add Salary Chart if data exists
      if (outcome.salaryChartData && Array.isArray(outcome.salaryChartData) && outcome.salaryChartData.length > 0) {
        console.log("💰 Processing salary chart data:", outcome.salaryChartData);
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
            console.log(`💰 Processing salary item: sector=${item.sector}, min=${item.min}, max=${item.max}`);
            const avg = (item.min + item.max) / 2;
            const scaledAvg = avg * 1000; // Scale up the values
            console.log(`💰 Calculated average for ${item.sector}: ${avg} -> scaled: ${scaledAvg}`);
            return acc + scaledAvg;
          }, 0) / salaryData.length;

          console.log("💰 Final calculated average salary:", avgSalary);

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

          console.log("💰 Created salary item:", salaryItem);
          transformedItems.push(salaryItem);
        } else {
          console.log("💰 No valid salary chart data after filtering");
        }
      } else {
        console.log("💰 No salary chart data found");
      }

      // Add Employment Rate if data exists
      if (outcome.employmentRateMeter && 
          typeof outcome.employmentRateMeter.targetRate === 'number' &&
          typeof outcome.employmentRateMeter.size === 'number') {
        console.log("👥 Processing employment rate data:", outcome.employmentRateMeter);
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

        console.log("👥 Created employment item:", employmentItem);
        transformedItems.push(employmentItem);
      } else {
        console.log("👥 No employment rate data found");
      }

      // Add Course Timeline if data exists
      if (outcome.courseTimelineData && 
          Array.isArray(outcome.courseTimelineData) && 
          outcome.courseTimelineData.length > 0) {
        console.log("📚 Processing course timeline data:", outcome.courseTimelineData);
        
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

          console.log("📚 Created course item:", courseItem);
          transformedItems.push(courseItem);
        }
      } else {
        console.log("📚 No course timeline data found");
      }
    });

    console.log("✅ Transformation complete. Final items:", transformedItems);
    console.log("✅ Total transformed items count:", transformedItems.length);
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
    console.log("🎨 Getting icon component for:", iconName);
    return iconMap[iconName] || TrendingUp;
  };

  // Component mapping with data passing
  const getModelComponent = (componentName?: string, rawData?: any) => {
    console.log("🔧 Rendering model component:", componentName);
    console.log("🔧 Component raw data:", rawData);

    switch (componentName) {
      case 'AnimatedSalaryChart':
        console.log("💰 Rendering AnimatedSalaryChart with data:", rawData);
        return <AnimatedSalaryChart data={rawData} />;
      case 'EmploymentRateMeter':
        console.log("👥 Rendering EmploymentRateMeter with data:", rawData);
        return <EmploymentRateMeter data={rawData} />;
      case 'CourseTimeline':
        console.log("📚 Rendering CourseTimeline with data:", rawData);
        return <CourseTimeline data={rawData} />;
      default:
        console.log("❌ No matching component found for:", componentName);
        return <div className="text-center text-gray-500 p-4">No data available</div>;
    }
  };

  // Transform server data to display format - FIXED LOGIC
  const displayData: CareerOutcomeItem[] = React.useMemo(() => {
    console.log("🔄 useMemo: Processing display data");
    console.log("🔄 universityData in useMemo:", universityData);
    console.log("🔄 universityData type:", typeof universityData);
    console.log("🔄 universityData is null:", universityData === null);
    console.log("🔄 universityData is undefined:", universityData === undefined);
    console.log("🔄 universityData keys:", universityData ? Object.keys(universityData) : []);

    // Check if we have valid server data - must be truthy AND have actual content
    // First check if it's null or undefined
    if (universityData === null || universityData === undefined) {
      console.log("❌ universityData is null or undefined");
      return [];
    }
    
    // Check if it's an empty object
    if (typeof universityData === 'object' && !Array.isArray(universityData) && Object.keys(universityData).length === 0) {
      console.log("❌ universityData is an empty object");
      return [];
    }
    
    // Check if we have valid server data with actual content
    if (typeof universityData === 'object' && 
        (universityData.id || 
         universityData.salaryChartData || 
         universityData.employmentRateMeter || 
         universityData.courseTimelineData ||
         Array.isArray(universityData))) {
      console.log("✅ Server data is valid, transforming...");
      const transformed = transformActualDataToDisplayData(universityData);
      console.log("✅ Transformed data:", transformed);

      if (transformed.length > 0) {
        console.log("✅ Using transformed server data");
        return transformed.slice(0, 3);
      } else {
        console.log("❌ Transformation resulted in empty array");
        return [];
      }
    }

    console.log("❌ No valid server data available - universityData is:", universityData);
    return [];
  }, [universityData]);

  console.log("📋 Final display data:", displayData);
  console.log("📋 Display data length:", displayData.length);

  // If no data at all, don't render
  if (!displayData || displayData.length === 0) {
    console.log("❌ No display data - showing fallback message");
    console.log("❌ universityData received:", JSON.stringify(universityData, null, 2));
    console.log("❌ displayData:", displayData);
   
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

  console.log("✅ Rendering component with", displayData.length, "items");

  // Simplified scroll lock
  useEffect(() => {
    if (showModal) {
      console.log("🔒 Locking scroll for modal");
      document.body.style.overflow = 'hidden';
    } else {
      console.log("🔓 Unlocking scroll");
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      console.log("⏰ Clearing hover timeout");
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleIconHover = (item: CareerOutcomeItem, event: React.MouseEvent): void => {
    console.log("🖱️ Icon hover triggered for:", item.title);
    clearHoverTimeout();
    isHoveringRef.current = true;

    setMousePosition({ x: event.clientX, y: event.clientY });
    setModalData(item);
    setShowModal(true);
    console.log("🖱️ Modal data set:", item);
    console.log("🖱️ Mouse position:", { x: event.clientX, y: event.clientY });
  };

  const handleIconLeave = (): void => {
    console.log("🖱️ Icon leave triggered");
    isHoveringRef.current = false;

    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        console.log("🖱️ Closing modal after timeout");
        setShowModal(false);
        setModalData(null);
      }
    }, 150);
  };

  const handleModalEnter = (): void => {
    console.log("🖱️ Modal enter triggered");
    clearHoverTimeout();
    isHoveringRef.current = true;
  };

  const handleModalLeave = (): void => {
    console.log("🖱️ Modal leave triggered");
    isHoveringRef.current = false;
    clearHoverTimeout();
    setShowModal(false);
    setModalData(null);
  };

  const closeModal = (): void => {
    console.log("❌ Closing modal via close button");
    clearHoverTimeout();
    isHoveringRef.current = false;
    setShowModal(false);
    setModalData(null);
  };

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

    console.log("📐 Modal style calculated:", style);
    return style;
  };

  return (
    <div className="relative w-screen max-w-6xl mx-auto p-8 rounded-3xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-8 text-center">{title}</h2>
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-3 gap-8 justify-items-center">
        {displayData.map((item: CareerOutcomeItem) => {
          console.log("🎨 Rendering item:", item.id, item.title);

          if (!item || !item.id) {
            console.log("❌ Invalid item, skipping:", item);
            return null;
          }

          const IconComponent = getIconComponent(item.iconName);
          const itemColor = item.color || "from-blue-400 to-purple-500";

          console.log("🎨 Item color:", itemColor);
          console.log("🎨 Icon component:", IconComponent.name);

          return (
            <div
              key={item.id}
              className="relative group cursor-pointer"
              onMouseEnter={(e) => {
                console.log("🖱️ Mouse enter on item:", item.title);
                handleIconHover(item, e);
              }}
              onMouseLeave={() => {
                console.log("🖱️ Mouse leave on item:", item.title);
                handleIconLeave();
              }}
            >
              {/* Icon Container */}
              <div className={`
                w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center
                bg-gradient-to-br ${!item.iconImage && itemColor}
                transform transition-all duration-300 ease-in-out
                group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-3
                relative overflow-hidden 
              `}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl "></div>

                {item.iconImage ? (
                  <img
                    src={item.iconImage}
                    alt={item.title}
                    className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <IconComponent
                    size={32}
                    className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                )}

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>

              {/* Icon Label */}
              <div className="mt-3 text-center">
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
              console.log("🖱️ Background clicked, closing modal");
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
              console.log("🖱️ Modal mouse enter");
              handleModalEnter();
            }}
            onMouseLeave={() => {
              console.log("🖱️ Modal mouse leave");
              handleModalLeave();
            }}
          >
            <button
              onClick={() => {
                console.log("❌ Close button clicked");
                closeModal();
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 group"
            >
              <X size={16} className="text-slate-600 group-hover:text-slate-800" />
            </button>

            <div className="flex items-center mb-4">
              <div className={`
                w-12 h-12 rounded-xl bg-gradient-to-br ${!modalData.iconImage && (modalData.color || "from-blue-400 to-purple-500")} 
                flex items-center justify-center shadow-lg mr-3 flex-shrink-0
              `}>
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
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                  {modalData.title || "Career Metric"}
                </h3>
                <p className="text-sm text-slate-600">
                  {modalData.description}
                </p>
              </div>
            </div>

            {/* Model Component Section */}
            <div className="mb-6">
         
              {getModelComponent(modalData.component, modalData.rawData)}
            </div>

            {/* Details Section */}
            <div className="mb-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {modalData.details}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200/50">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Hover to explore more</span>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i: number) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${modalData.color || "from-blue-400 to-purple-500"} animate-pulse`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityCareerOutcomes;