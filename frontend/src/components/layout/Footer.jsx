export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="section-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground font-display">S</span>
              </div>
              <span className="text-lg font-bold font-display">Setu</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bridging citizens to government services across Nepal. One portal, all services.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a></li>
              <li><a href="/appointment" className="hover:text-foreground transition-colors">Book Appointment</a></li>
              <li><a href="/portals" className="hover:text-foreground transition-colors">Government Portals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Singha Durbar, Kathmandu</li>
              <li>support@setu.gov.np</li>
              <li>+977-01-4211000</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Setu — Government of Nepal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
