import { Briefcase, GraduationCap, Code, PresentationIcon } from "lucide-react";

const useCases = [
  {
    icon: Briefcase,
    title: "Business",
    description:
      "Create flowcharts, org charts, and process diagrams. Perfect for presentations and planning.",
    color: "bg-blue-500",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Teach concepts visually with diagrams and illustrations. Great for remote learning.",
    color: "bg-green-500",
  },
  {
    icon: Code,
    title: "Development",
    description:
      "Design system architecture, database schemas, and wireframes. Collaborate with your team.",
    color: "bg-orange-500",
  },
  {
    icon: PresentationIcon,
    title: "Presentations",
    description:
      "Create engaging visual aids for your presentations. Export and share with ease.",
    color: "bg-cyan-500",
  },
];

export default function UseCases() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            For every use case
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you brainstorming, planning, or presenting, Excalidraw
            adapts to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-gray-100 hover:border-transparent"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-gray-100 to-transparent rounded-bl-full opacity-50"></div>
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 ${useCase.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {useCase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
