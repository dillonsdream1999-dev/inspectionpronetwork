export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 mb-4">
            We collect information you provide directly, including:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Account information (email address)</li>
            <li>Company profile (name, phone, website, billing email)</li>
            <li>Payment information (processed securely by Stripe)</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Lead Information</h2>
          <p className="text-slate-600 mb-4">
            When a homeowner requests help through the Bed Bug Inspection Pro app, we share their 
            contact information with the territory operator. This may include name, contact preference, 
            ZIP code, and room type inspected.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-slate-600 mb-4">
            We use collected information to:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Provide and maintain our services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Route leads to appropriate territory operators</li>
            <li>Send service-related communications</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Data Security</h2>
          <p className="text-slate-600 mb-4">
            We implement appropriate security measures to protect your information. Payment processing 
            is handled by Stripe and we do not store your credit card details.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Data Sharing</h2>
          <p className="text-slate-600 mb-4">
            We do not sell your personal information. We share data only with:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Service providers (Stripe for payments, Supabase for data storage)</li>
            <li>Territory operators (lead information only)</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
          <p className="text-slate-600 mb-4">
            You may request access to, correction of, or deletion of your personal information by 
            contacting us through the platform.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Contact</h2>
          <p className="text-slate-600 mb-4">
            For privacy-related questions, please contact us through the platform.
          </p>
        </div>
      </div>
    </div>
  )
}

