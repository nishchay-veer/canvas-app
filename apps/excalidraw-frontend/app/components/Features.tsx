import { Pencil, Users, Lock, Zap, Download, Layers } from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Hand-drawn feel",
    description: "Natural, sketched diagrams that feel personal and authentic.",
  },
  {
    icon: Users,
    title: "Real-time collab",
    description: "See your team's changes instantly. No refresh needed.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description: "End-to-end encrypted. Your data stays yours.",
  },
  {
    icon: Zap,
    title: "Blazing fast",
    description: "Smooth performance, even with complex diagrams.",
  },
  {
    icon: Download,
    title: "Export anywhere",
    description: "PNG, SVG, or shareable link. Your choice.",
  },
  {
    icon: Layers,
    title: "Infinite canvas",
    description: "Never run out of space. Zoom and pan freely.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Simple tools, powerful results
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Everything you need to bring ideas to life—nothing you don&apos;t.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-4 group-hover:border-gray-200 transition-colors">
                  <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom accent */}
        <div
          className="mt-16 text-center animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
            <span className="text-sm text-gray-500">And much more—</span>
            <a
              href="#"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              View all features →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
