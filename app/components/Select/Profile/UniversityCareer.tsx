import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Custom SVG Icon for Salary/Briefcase
const SalaryBriefcaseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 232 223" fill="none" className={className}>
    <path d="M81.6553 51.095C81.6553 39.9046 90.7269 30.833 101.917 30.833H122.179C133.37 30.833 142.441 39.9046 142.441 51.095V71.3569H81.6553V51.095Z" stroke="currentColor" strokeWidth="20.262" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M172.834 71.3574H51.262C40.0716 71.3574 31 80.429 31 91.6194V162.536C31 173.727 40.0716 182.798 51.262 182.798H172.834C184.024 182.798 193.096 173.727 193.096 162.536V91.6194C193.096 80.429 184.024 71.3574 172.834 71.3574Z" stroke="currentColor" strokeWidth="20.262" strokeLinecap="round" strokeLinejoin="round"/>
    <g filter="url(#filter0_d_1358_1026)">
      <path d="M105.702 116.793C106.14 116.211 106.624 115.652 107.154 115.122C113.249 109.027 123.131 109.027 129.226 115.122L135.847 108.5C126.095 98.7486 110.285 98.7486 100.533 108.5C98.0861 110.947 96.2533 113.775 95.0343 116.793H90.0977V123.036H93.4137C93.1541 125.108 93.1541 127.207 93.4137 129.279H90.0977V135.522H95.0343C96.2533 138.54 98.0861 141.368 100.533 143.815C110.285 153.567 126.095 153.567 135.847 143.815L129.226 137.193C123.131 143.288 113.249 143.288 107.154 137.193C106.624 136.663 106.14 136.104 105.702 135.522H118.19V129.279H102.897C102.479 127.221 102.479 125.094 102.897 123.036H118.19V116.793H105.702Z" fill="currentColor"/>
    </g>
    <defs>
      <filter id="filter0_d_1358_1026" x="61.3932" y="83.7387" width="103.159" height="107.351" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="11.2566"/>
        <feGaussianBlur stdDeviation="14.3522"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1358_1026"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1358_1026" result="shape"/>
      </filter>
    </defs>
  </svg>
);

// Custom SVG Icon for Employment Rate/Users
const EmploymentUsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 267 240" fill="none" className={className}>
    <path d="M139.772 137.772C148.43 137.772 156.733 134.332 162.855 128.21C168.977 122.088 172.416 113.785 172.416 105.127C172.416 96.4697 168.977 88.1665 162.855 82.0445C156.733 75.9225 148.43 72.4832 139.772 72.4832C131.114 72.4832 122.811 75.9225 116.689 82.0445C110.567 88.1665 107.127 96.4697 107.127 105.127C107.127 113.785 110.567 122.088 116.689 128.21C122.811 134.332 131.114 137.772 139.772 137.772ZM139.772 137.772C126.785 137.772 114.33 142.931 105.147 152.114C95.9643 161.297 90.8053 173.751 90.8053 186.738V211.221M139.772 137.772C152.758 137.772 165.213 142.931 174.396 152.114C183.579 161.297 188.738 173.751 188.738 186.738V211.221M147.933 72.4832C151.23 58.9032 164.377 48 180.577 48C198.303 48 213.058 62.6083 213.221 80.6443C213.058 98.6802 198.303 113.289 180.577 113.289M180.577 113.289H172.416M180.577 113.289C207.411 113.289 229.543 135.209 229.543 162.255V178.577M131.611 72.4832C128.314 58.9032 115.166 48 98.9664 48C81.2406 48 66.4854 62.6083 66.3221 80.6443C66.4854 98.6802 81.2406 113.289 98.9664 113.289M98.9664 113.289H107.127M98.9664 113.289C72.1328 113.289 50 135.209 50 162.255V178.577" stroke="currentColor" strokeWidth="19.6991"/>
  </svg>
);

// Custom SVG Icon for Courses in Demand/TrendingUp
const CoursesTrendingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 234 165" fill="none" className={className}>
    <path d="M145.782 41H197.241V92.4589" stroke="currentColor" strokeWidth="22.5133" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M197.242 41L124.556 113.686C123.353 114.864 121.737 115.525 120.053 115.525C118.369 115.525 116.753 114.864 115.55 113.686L85.9616 84.0969C84.7592 82.9183 83.1426 82.2581 81.4589 82.2581C79.7753 82.2581 78.1587 82.9183 76.9563 84.0969L30 131.053" stroke="currentColor" strokeWidth="22.5133" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  const [employmentRateFill, setEmploymentRateFill] = useState<number>(0);
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
    setHoveredItemId(item.id);
    setShowModal(true);
    setCircleFillPercentage(0);
    setEmploymentRateFill(0);
    
    // Trigger animation after modal is shown
    setTimeout(() => {
      setCircleFillPercentage(0.75);
      // For employment rate, animate to the actual target rate
      if (item.rawData?.targetRate) {
        setEmploymentRateFill(item.rawData.targetRate);
      }
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
    setEmploymentRateFill(0);
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

  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, []);


  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const itemRefsRef = useRef<{ [key: number]: HTMLDivElement }>({});

  const setItemRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) {
      itemRefsRef.current[id] = el;
    }
  }, []);

  const getModalStyle = () => {
    const modalWidth = 500;
    const padding = 24;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if mobile (viewportWidth < 768px)
    const isMobile = viewportWidth < 768;

    // Mobile: Center modal on screen
    if (isMobile) {
      const left = (viewportWidth - Math.min(modalWidth, viewportWidth - 2 * padding)) / 2;
      const top = (viewportHeight - 600) / 2;

      const style = {
        left: `${left}px`,
        top: `${Math.max(padding, top)}px`,
        position: 'fixed' as const,
        zIndex: 9999,
        maxHeight: `${viewportHeight - 2 * padding}px`,
        overflowY: 'auto' as const
      };
      return style;
    }

    // Desktop: Position modal centered on the hovered card using transform
    if (modalData && itemRefsRef.current[modalData.id]) {
      const rect = itemRefsRef.current[modalData.id].getBoundingClientRect();
      
      // Get the center point of the hovered card
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const style = {
        left: `${cardCenterX}px`,
        top: `${cardCenterY}px`,
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        zIndex: 9999
      };
      return style;
    }

    // Fallback to cursor position
    let left = mousePosition.x - modalWidth / 2;
    let top = mousePosition.y + 20;

    if (left + modalWidth > viewportWidth - padding) {
      left = viewportWidth - modalWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    left = Math.max(padding, Math.min(left, viewportWidth - modalWidth - padding));

    const style = {
      left: `${left}px`,
      top: `${top}px`,
      position: 'fixed' as const,
      zIndex: 9999
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
              ref={(el) => setItemRef(item.id, el)}
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
                ) : item.iconName === 'Briefcase' ? (
                  <SalaryBriefcaseIcon className="w-14 h-14 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                ) : item.iconName === 'Users' ? (
                  <EmploymentUsersIcon className="w-14 h-14 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
                ) : item.iconName === 'TrendingUp' ? (
                  <CoursesTrendingIcon className="w-14 h-14 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
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
          {/* Animation keyframes */}
          <style>{`
            @keyframes fadeInScale {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.95);
              }
              100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}</style>
          
          <div
            className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
            onClick={() => {
              closeModal();
            }}
          ></div>

          <div
            ref={modalRef}
            className={`
              max-w-lg w-full rounded-3xl p-6 pointer-events-auto
              ${modalData.bgColor || "bg-gradient-to-br from-blue-50 to-purple-50"} border border-white/20 shadow-2xl
              min-h-0 animate-fade-in-scale
              md:w-auto
              max-md:!left-1/2 max-md:!top-1/2 max-md:!-translate-x-1/2 max-md:!-translate-y-1/2 max-md:w-[90vw] max-md:max-h-[80vh] max-md:overflow-y-auto
            `}
            style={{
              ...getModalStyle(),
              animation: 'fadeInScale 0.2s ease-out forwards'
            }}
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
                        <svg className="w-4 h-4 text-slate-400 mt-2 absolute bottom-[-5px] right-[-5px]" xmlns="http://www.w3.org/2000/svg" width="207" height="208" viewBox="0 0 207 208" fill="none">
                          <g>
                          <path d="M21.8777 53.5284C21.8784 48.7668 23.7702 44.2005 27.1371 40.8336C30.5041 37.4666 35.0704 35.5748 39.8319 35.5741L154.11 35.5741C158.871 35.5748 163.437 37.4666 166.804 40.8336C170.171 44.2005 172.063 48.7668 172.064 53.5284L172.064 167.806C171.982 172.514 170.054 177.001 166.696 180.301C163.338 183.602 158.818 185.451 154.11 185.451C149.401 185.451 144.881 183.602 141.523 180.301C138.165 177.001 136.237 172.514 136.155 167.806L135.063 97.9697L65.2287 167.804C61.8611 171.172 57.2936 173.064 52.5312 173.064C47.7687 173.064 43.2012 171.172 39.8336 167.804C36.466 164.437 34.5742 159.869 34.5742 155.107C34.5742 150.344 36.466 145.777 39.8336 142.409L109.668 72.5746L39.8319 71.4827C35.0704 71.4819 30.5041 69.5901 27.1371 66.2232C23.7702 62.8563 21.8784 58.2899 21.8777 53.5284Z" fill="black"/>
                          </g>
                          <defs>
                          <clipPath id="clip0_1358_1029">
                          <rect width="207" height="208" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              ) : modalData.component === 'EmploymentRateMeter' && modalData.rawData ? (
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  {/* Speedometer - Semicircle from left to right */}
                  <div className="w-full max-w-sm mx-auto mb-4 relative">
                    <svg width="100%" height="auto" viewBox="0 0 200 120" className="w-full">
                      {/* Background Arc - gray semicircle */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      {/* Filled Arc - purple filled portion with animation */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.PI * 80 * (employmentRateFill / 100)} ${Math.PI * 80}`}
                        style={{ transition: 'stroke-dasharray 2s ease-in-out' }}
                      />
                    </svg>

                    <p className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-5xl font-black text-slate-900 mb-1">
                      {modalData.rawData.targetRate}%
                    </p>
                  </div>

                  {/* Center Content */}
                  <p className="text-sm text-slate-600 text-center">
                    Average salary : <span className="font-semibold text-slate-800">{modalData.value}</span>
                  </p>
                </div>
              ) : modalData.component === 'CourseTimeline' && modalData.rawData ? (
                <div className="flex flex-col py-4 max-h-96 overflow-y-auto scrollbar-hide">
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
                        <svg className='w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0' xmlns="http://www.w3.org/2000/svg" width="207" height="208" viewBox="0 0 207 208" fill="none">
                          <g>
                          <path d="M21.8777 53.5284C21.8784 48.7668 23.7702 44.2005 27.1371 40.8336C30.5041 37.4666 35.0704 35.5748 39.8319 35.5741L154.11 35.5741C158.871 35.5748 163.437 37.4666 166.804 40.8336C170.171 44.2005 172.063 48.7668 172.064 53.5284L172.064 167.806C171.982 172.514 170.054 177.001 166.696 180.301C163.338 183.602 158.818 185.451 154.11 185.451C149.401 185.451 144.881 183.602 141.523 180.301C138.165 177.001 136.237 172.514 136.155 167.806L135.063 97.9697L65.2287 167.804C61.8611 171.172 57.2936 173.064 52.5312 173.064C47.7687 173.064 43.2012 171.172 39.8336 167.804C36.466 164.437 34.5742 159.869 34.5742 155.107C34.5742 150.344 36.466 145.777 39.8336 142.409L109.668 72.5746L39.8319 71.4827C35.0704 71.4819 30.5041 69.5901 27.1371 66.2232C23.7702 62.8563 21.8784 58.2899 21.8777 53.5284Z" fill="black"/>
                          </g>
                          <defs>
                          <clipPath id="clip0_1358_1029">
                          <rect width="207" height="208" fill="white"/>
                          </clipPath>
                          </defs>
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