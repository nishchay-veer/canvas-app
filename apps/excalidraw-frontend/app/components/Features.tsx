import {
  Pencil,
  Users,
  Lock,
  Zap,
  Download,
  Layers,
  Smartphone,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Hand-drawn Feel",
    description:
      "Create diagrams with a natural, sketched appearance that feels personal and engaging.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. See changes as they happen.",
  },
  {
    icon: Lock,
    title: "End-to-end Encrypted",
    description:
      "Your data is encrypted in transit and at rest. Privacy is built-in by default.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance ensures smooth drawing even with complex diagrams.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "Export to PNG, SVG, clipboard, or shareable links. Your data, your way.",
  },
  {
    icon: Layers,
    title: "Infinite Canvas",
    description:
      "Never run out of space. Zoom and pan across an unlimited workspace.",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description:
      "Progressive web app that works without an internet connection.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "Community-driven development. Transparent, auditable, and free forever.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to visualize ideas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features wrapped in a simple, intuitive interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
