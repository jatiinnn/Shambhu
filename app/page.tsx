import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8 px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Welcome to your DDSoft dashboard. Manage your billing and invoices with ease.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}