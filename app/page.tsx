import GetStartedButton from '@/components/GetStartedButton';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 md:py-32 bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            Cooking the Perfect README <br className="hidden md:block" />
            <span className="text-amber-500">Every Single Time</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mb-10">
            Stop ignoring your README files. ReadmeChef helps developers and organizations create
            beautiful, comprehensive documentation for their GitHub repositories in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <GetStartedButton />
            <a
              href="#features"
              className="rounded-full border border-gray-300 dark:border-gray-600 px-8 py-3 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Features that Make README Creation <span className="text-amber-500">Delicious</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Template Library
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Choose from dozens of professionally designed README templates tailored for
                different project types.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500"
                >
                  <path d="M12 3v12"></path>
                  <path d="m8 11 4 4 4-4"></path>
                  <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                One-Click Import
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Import your project details directly from GitHub to automatically populate your
                README.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Live Preview
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                See your README changes in real-time with our live Markdown preview editor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-amber-50 dark:bg-slate-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Cook Up a Perfect README?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have improved their project documentation with
            ReadmeChef.
          </p>
          <GetStartedButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 px-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="text-amber-500">Readme</span>Chef
              </span>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Cooking the perfect README every time
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} ReadmeChef. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
