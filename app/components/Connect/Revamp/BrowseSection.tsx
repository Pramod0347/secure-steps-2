"use client";

import { useMemo, useState } from "react";
import AlumniCardItem from "./AlumniCardItem";
import { collegeGroups, courseGroups, filterChips } from "./data";
import { Mode } from "./types";

export default function BrowseSection() {
  const [mode, setMode] = useState<Mode>("college");
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("All");

  const groups = mode === "college" ? collegeGroups : courseGroups;

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    return groups
      .map((group) => {
        const cards = group.cards.filter((card) => {
          const combined = `${group.name} ${card.code} ${card.title} ${card.subtitle}`.toLowerCase();
          if (term && !combined.includes(term)) return false;
          if (chip === "Available now") return card.available;
          if (chip !== "All" && !group.meta.includes(chip)) return false;
          return true;
        });
        return { ...group, cards };
      })
      .filter((group) => group.cards.length > 0);
  }, [groups, search, chip]);

  return (
    <section className="browse" id="browse">
      <div className="wrap">
        <div className="browse-head">
          <h2>Meet our alumni</h2>
          <p>120 verified mentors across 40+ universities. Sort and filter to find your match.</p>
        </div>

        <div className="controls">
          <div className="sort-toggle">
            <button className={`sort-btn ${mode === "college" ? "active" : ""}`} onClick={() => setMode("college")}>⌂ Sort by College</button>
            <button className={`sort-btn ${mode === "course" ? "active" : ""}`} onClick={() => setMode("course")}>⌘ Sort by Course</button>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Search alumni, college, or course..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="filter-chips">
          {filterChips.map((item) => (
            <button key={item} className={`filter-chip ${chip === item ? "active" : ""}`} onClick={() => setChip(item)}>{item}</button>
          ))}
        </div>

        {filteredGroups.map((group) => (
          <div key={group.key}>
            <div className="group-header">
              <div className={`group-icon ${group.iconClass}`}>{group.short}</div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-meta">{group.meta}</div>
              </div>
              <a href="#" className="group-view-all">View all {group.cards.length} →</a>
            </div>
            <div className="alumni-grid">{group.cards.map((card) => <AlumniCardItem key={`${card.code}-${card.initials}`} card={card} />)}</div>
          </div>
        ))}

        {!filteredGroups.length && <p style={{ textAlign: "center", color: "#6f6f6f" }}>No alumni found for this filter.</p>}
      </div>
    </section>
  );
}
