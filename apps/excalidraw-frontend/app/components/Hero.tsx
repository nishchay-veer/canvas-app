import { ArrowRight, Github } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Virtual whiteboard for{" "}
            <span className="text-blue-600">sketching</span> hand-drawn like
            diagrams
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Collaborative and end-to-end encrypted. Create beautiful diagrams
            with a hand-drawn feel. Free and open source.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center space-x-2">
              <span>Start drawing</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition shadow-md hover:shadow-lg flex items-center space-x-2">
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            No sign-up required • Works offline • Privacy-first
          </p>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl blur-3xl opacity-30"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 sm:p-8">
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <svg
                viewBox="0 0 800 450"
                className="w-full h-full p-8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="50"
                  y="80"
                  width="200"
                  height="120"
                  rx="8"
                  stroke="#2563eb"
                  strokeWidth="3"
                  fill="#dbeafe"
                />
                <text
                  x="150"
                  y="145"
                  textAnchor="middle"
                  className="text-lg font-medium"
                  fill="#1e40af"
                >
                  Component
                </text>

                <rect
                  x="550"
                  y="80"
                  width="200"
                  height="120"
                  rx="8"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="#d1fae5"
                />
                <text
                  x="650"
                  y="145"
                  textAnchor="middle"
                  className="text-lg font-medium"
                  fill="#047857"
                >
                  Database
                </text>

                <rect
                  x="300"
                  y="250"
                  width="200"
                  height="120"
                  rx="8"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  fill="#fef3c7"
                />
                <text
                  x="400"
                  y="315"
                  textAnchor="middle"
                  className="text-lg font-medium"
                  fill="#b45309"
                >
                  API
                </text>

                <path
                  d="M 250 140 L 300 140"
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 500 140 L 550 140"
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 150 200 L 350 250"
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 650 200 L 450 250"
                  stroke="#6b7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />

                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
                  </marker>
                </defs>
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Rectangle</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Ellipse</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-8 h-0.5 bg-gray-500"></div>
                  <span>Arrow</span>
                </span>
              </div>
              <span className="text-gray-500">Live collaboration enabled</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
