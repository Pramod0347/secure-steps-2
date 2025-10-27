// SettingsMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineDotsHorizontal as SettingIcon } from "react-icons/hi";
import { MdEdit, MdEvent, MdForum, MdArticle } from "react-icons/md";
import CreateEventModal from './CreateEventForm';
import CreateForumModal from './CreateForumForm';
import CreateArticleModal from './CreateArticleForm';

interface SettingsMenuProps {
  groupId: string;
}

const SettingsMenu: React.FC<SettingsMenuProps> = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showForumModal, setShowForumModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <div className="relative">
      <div
        className="p-2 text-sm md:text-[20px] cursor-pointer hover:bg-gray-100  rounded-full  text-gray-400"
        onMouseEnter={() => setShowPopup(true)}
        onClick={() => setShowPopup(!showPopup)}
      >
        <SettingIcon />
      </div>

      

      {/* Modals */}
      {showEventModal && (
        <CreateEventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
        />
      )}

      {showForumModal && (
        <CreateForumModal
          isOpen={showForumModal}
          onClose={() => setShowForumModal(false)}
        />
      )}

      {showArticleModal && (
        <CreateArticleModal
          isOpen={showArticleModal}
          onClose={() => setShowArticleModal(false)}
        />
      )}
    </div>
  );
};

export default SettingsMenu;