import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant mt-margin border-t border-outline-variant/30">
      <div className="w-full px-margin py-space-xl max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter mb-space-xl">
          <div className="lg:col-span-2 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="ArogyaCare+ Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UgD4QbDGJ9GDNhQ66TmcODNXT67vwE3ybZ5XSzV_wJoDx888v7lKZrjNVAxeY8kcOmBRnjxZF3o8VohzUkSSiaObAlESIPW4va6Emu5chdon5Yq4XypT_hy-etFYGrm55C4uEjXp4KgvY3W7NcoCw2b2JkaENp9uEZFo02OUKXTbvKdPek7co8yIJkYSowlQpSGhfH4mkY7ebl-o89ElverE83TVmqzA5iT64Ok4LioQaOECNSjdYqvQ"
              />
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                ArogyaCare<span className="text-secondary">+</span>
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Integrated clinical management, doorstep pharmacy fulfillment, and next-gen AI diagnostics architected for continuous, compassionate health journeys.
            </p>
            <div className="p-space-md bg-error-container/40 rounded-xl space-y-space-xs">
              <div className="flex items-center gap-space-xs text-error">
                <span className="material-symbols-outlined text-[20px]">emergency</span>
                <span className="font-label-lg text-label-lg font-bold">Emergency Medical Response</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Toll-Free National Ambulance: <strong className="text-error">108</strong> | State Tele-Health Line: <strong className="text-error">104</strong>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">Care Services</h4>
            <ul className="space-y-space-sm font-body-md text-body-md">
              <li>
                <Link className="hover:text-primary transition-colors" href="/doctors">
                  Doctor Video Consult
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/pharmacy">
                  Diagnostic Lab Tests
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/pharmacy">
                  Prescription Refills
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/#hero-ai-trigger">
                  AI Symptom Checker
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/doctors">
                  Specialty Clinics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">Patient Support</h4>
            <ul className="space-y-space-sm font-body-md text-body-md">
              <li>
                <Link className="hover:text-primary transition-colors" href="/appointments">
                  Care Wallet &amp; Refunds
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/appointments">
                  Insurance &amp; TPA Claims
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/appointments">
                  Medical Record Vault
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/appointments">
                  Plus Membership Perks
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/appointments">
                  Track Deliveries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">Accreditations</h4>
            <div className="space-y-space-sm">
              <div className="flex items-center gap-space-xs p-space-xs bg-surface-container rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">NABH Certified Facilities</span>
              </div>
              <div className="flex items-center gap-space-xs p-space-xs bg-surface-container rounded-lg">
                <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">ISO 27001 &amp; HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-space-xs p-space-xs bg-surface-container rounded-lg">
                <span className="material-symbols-outlined text-tertiary text-[20px]">support_agent</span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">24/7 Clinical Desk Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-space-lg border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm">
          <p className="text-on-surface-variant max-w-2xl">
            <strong>Medical Disclaimer:</strong> ArogyaCare+ provides digital health coordination, remote consultations, and delivery tracking. In case of life-threatening emergencies, please immediately dial 108 or proceed to the nearest emergency ward. Consultations are regulated by Telemedicine Practice Guidelines.
          </p>
          <p className="text-on-surface-variant shrink-0">© 2025 ArogyaCare+ Health Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
