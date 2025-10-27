import {CourseShowcase} from "./CourseShowcase"


const topImages = [
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Students in classroom"
  },
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Educational books"
  },
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Motivational phone display"
  },
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Learning environment"
  }
]

const bottomImages = [
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Learning session"
  },
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Mobile learning app"
  },
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Study materials"
  },
  {
    src: "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Online learning"
  }
]


const CourseList: React.FC = () => {
  return (
    <div className=" w-[100vw] md:w-[130vw] overflow-hidden ">
       <CourseShowcase topImages={topImages} bottomImages={bottomImages} />
    </div>
  )
}

export default CourseList;
