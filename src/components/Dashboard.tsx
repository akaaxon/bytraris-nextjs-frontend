"use client";
import { FileText, CreditCard, UploadCloud, File, Settings} from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 p-4">
        <div className="flex items-center space-x-2 p-4 border-b border-neutral-800">
          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="font-bold">{session?.user?.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-xs text-neutral-400">Premium Plan</p>
          </div>
        </div>

        <nav className="mt-6">
          <div className="space-y-1">
            <button className="flex items-center w-full p-3 rounded-lg bg-neutral-800 text-orange-400">
              <FileText className="h-5 w-5 mr-3" />
              <span>Documents</span>
            </button>
            
            <button className="flex items-center w-full p-3 rounded-lg hover:bg-neutral-800 hover:text-orange-400 transition-colors">
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Manage Plan</span>
            </button>
            
            <button className="flex items-center w-full p-3 rounded-lg hover:bg-neutral-800 hover:text-orange-400 transition-colors">
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-orange-400">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
              <p className="text-sm">Premium Plan</p>
            </div>
            <button className="p-2 rounded-full bg-neutral-900 border border-neutral-800">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Documents Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Documents</h2>
            <button className="flex items-center bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-lg transition-colors">
              <UploadCloud className="h-5 w-5 mr-2" />
              Upload Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Document Cards */}
            {[1, 2, 3].map((doc) => (
              <div key={doc} className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 hover:border-orange-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <File className="h-6 w-6 text-orange-400" />
                  <div className="flex space-x-2">
                    <button className="text-neutral-400 hover:text-orange-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="font-medium mb-1">Document_{doc}.pdf</h3>
                <p className="text-sm text-neutral-400 mb-3">Uploaded 2 days ago</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-neutral-800 rounded">PDF</span>
                  <span className="text-xs text-neutral-400">2.4 MB</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Manage Plan Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Manage Your Plan</h2>
          
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-lg font-medium mb-1">Premium Plan</h3>
                <p className="text-neutral-400">Unlimited documents, priority support</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-2xl font-bold text-orange-400">$29</span>
                <span className="text-neutral-400">/month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border border-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Document Storage</h4>
                <p className="text-orange-400 text-lg font-bold">Unlimited</p>
              </div>
              <div className="border border-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Processing Speed</h4>
                <p className="text-orange-400 text-lg font-bold">Priority</p>
              </div>
              <div className="border border-neutral-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Support</h4>
                <p className="text-orange-400 text-lg font-bold">24/7</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button className="px-6 py-2 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors">
                Change Plan
              </button>
              <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg transition-colors">
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}