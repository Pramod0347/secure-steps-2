import { StatCircle } from "./StatCircle"

export function StatsSection() {
  const stats = [
    { number: "75+", label: "Happy Students" },
    { number: "150+", label: "Student Enquiries" },
    { number: "100%", label: "Transparency" },
    { number: "100%", label: "Reliable" },
  ]

  return (
    <div className="flex justify-around 2xl:px-60 md:px-36  w-screen -mt-10">
      {stats.map((stat, index) => (
        <StatCircle key={index} number={stat.number} label={stat.label} />
      ))}
    </div>
  )
}
