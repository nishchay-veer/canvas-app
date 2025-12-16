import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-gray-900 rounded-2xl px-8 py-16 sm:px-12 sm:py-20 overflow-hidden">
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Content */}
          <div className="relative text-center animate-fade-up">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to sketch your next idea?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of teams using our whiteboard for brainstorming,
              planning, and collaboration.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-gray-600 hover:text-white transition-all"
              >
                <span>View examples</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap justify-center gap-8 sm:gap-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-heading">
                  10K+
                </div>
                <div className="text-sm text-gray-500">Active users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-heading">
                  50K+
                </div>
                <div className="text-sm text-gray-500">Diagrams created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-heading">
                  100%
                </div>
                <div className="text-sm text-gray-500">Open source</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
