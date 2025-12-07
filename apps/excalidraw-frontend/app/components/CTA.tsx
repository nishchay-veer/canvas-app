import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Free forever • No credit card required</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Start creating amazing diagrams today
        </h2>

        <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
          Join millions of people who trust Excalidraw for their visual
          collaboration needs
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition shadow-xl hover:shadow-2xl flex items-center space-x-2">
            <span>Launch Excalidraw</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 transition flex items-center space-x-2">
            <span>View Documentation</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">10M+</div>
            <div className="text-sm">Active users</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-sm">GitHub stars</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-sm">Open source</div>
          </div>
        </div>
      </div>
    </section>
  );
}
