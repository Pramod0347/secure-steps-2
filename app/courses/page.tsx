'use client'

import React from 'react';

const CoursesPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-20">
      <iframe
        src="https://coursesite.framer.website/"
        className="w-full h-full border-0"
        title="Courses"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default CoursesPage;
