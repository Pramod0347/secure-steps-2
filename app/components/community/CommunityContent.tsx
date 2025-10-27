import { useState } from "react";
import CommunityArticles from "./Articles";
import Events from "./Events";
import Forums from "./Forums";
import Groups from "./Groups";
import CreateGroupForm from "./Models/CreateGroupForm";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommunityContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'groups' | 'events' | 'forums' | 'articles'>('groups');
  const [showModal, setShowModal] = useState(false);

  const renderModal = () => {
    const props: FormProps = {
      isOpen: showModal,
      onClose: () => setShowModal(false)
    };

    return <CreateGroupForm {...props} />;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'groups':
        return <Groups />;
      case 'events':
        return <Events />;
      case 'forums':
        return <Forums />;
      case 'articles':
        return <CommunityArticles />;
      default:
        return <Groups />;
    }
  };

  return (
    <div className="w-full p-2">
      <div className="flex justify-end mt-4 mr-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-90"
        >
          Add Group
        </button>
      </div>
      <div className="flex mt-10 text-[16px] md:text-[22px] 2xl:text-[25px] text-[#909090] font-semibold w-full justify-evenly">
        {[
          { key: 'groups', label: 'Groups' },
          { key: 'events', label: 'Events' },
          { key: 'forums', label: 'Forums' },
          { key: 'articles', label: 'Articles' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as 'groups' | 'events' | 'forums' | 'articles')}
            className={`${
              activeSection === key
                ? 'text-[#E50914]'
                : 'hover:text-[#E50914]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {renderModal()}
      {renderContent()}
    </div>
  );
};

export default CommunityContent;