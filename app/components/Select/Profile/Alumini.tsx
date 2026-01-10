import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";

const alumni = [
  {
    name: "Mariam Pustilnik",
    title: "Business Development",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=500&q=80", // demo image
    linkedin: "#",
  },
  {
    name: "John Doe",
    title: "Marketing Strategist",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=500&q=80",
    linkedin: "#",
  },
  {
    name: "Emily Carter",
    title: "Finance Analyst",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=500&q=80",
    linkedin: "#",
  },
  {
    name: "Liam Nguyen",
    title: "Operations Manager",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    linkedin: "#",
  },
];

export default function AlumniSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8">
      <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
        Contact Alumni from this college
      </h2>
      <div className="flex justify-center flex-wrap gap-6">
        {alumni.map((person, index) => (
          <div
            key={index}
            className="relative w-60 h-60 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Image
              src={person.image}
              alt={person.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* LinkedIn icon */}
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 bg-black/70 rounded-full p-2 hover:bg-black transition"
            >
              <FaLinkedinIn className="text-white text-sm" />
            </a>

            {/* Text content */}
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold">{person.name}</p>
              <p className="text-sm opacity-80">{person.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
