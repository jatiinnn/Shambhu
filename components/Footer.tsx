export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 sm:py-6">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">About DDSoft</h3>
            <p className="text-xs sm:text-sm mb-2">
              DDSoft is a comprehensive billing software solution designed to streamline your business operations. 
              Our software offers powerful features for invoice management, inventory tracking, and financial reporting.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Key Features</h3>
            <ul className="list-disc list-inside text-xs sm:text-sm">
              <li>Easy invoice generation</li>
              <li>Real-time inventory management</li>
              <li>Comprehensive financial reports</li>
              <li>Multi-user support</li>
              <li>Secure data storage</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Contact Us</h3>
            <p className="text-xs sm:text-sm">Email: dkv_ddsoft@rediffmail.com</p>
            <p className="text-xs sm:text-sm">Phone: +91 98978 30400</p>
            <p className="text-xs sm:text-sm">Address: 16/41 Babari Mandi Meetha Kua, Aligarh, U.P.</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} DDSoft Billing Software. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}