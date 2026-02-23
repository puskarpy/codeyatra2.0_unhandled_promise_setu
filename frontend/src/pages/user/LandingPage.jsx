import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, FileText, CheckSquare, ArrowRight, 
  Building2, Users, Clock, Zap, Globe, Star
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Document Services",
    description: "Apply for citizenship, passports, and vital documents online.",
  },
  {
    icon: CheckSquare,
    title: "Eligibility Checker",
    description: "Instantly check your eligibility for government schemes and services.",
  },
  {
    icon: Building2,
    title: "Portal Directory",
    description: "Access all government ministry portals from a single gateway.",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    description: "Your data is protected with government-grade encryption.",
  },
];

const stats = [
  { value: "50+", label: "Government Services", icon: Globe },
  { value: "77", label: "Districts Covered", icon: Users },
  { value: "24/7", label: "Service Availability", icon: Clock },
  { value: "Fast", label: "Processing Time", icon: Zap },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="section-container py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-1.5 text-sm text-primary-foreground/90 mb-6">
              <Star className="h-3.5 w-3.5" />
              Nepal's Unified e-Government Portal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Your Bridge to{" "}
              <span className="text-accent">Government Services</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl leading-relaxed">
              Setu connects you to all government services in Nepal through one simple, 
              secure portal. Check eligibility, submit applications, and track your requests — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/auth?register=true">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold text-base px-8">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/portals">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold text-base px-8">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="section-container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground font-display">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Do</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access essential government services from the comfort of your home.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="card-elevated rounded-xl border bg-card p-6 flex flex-col"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-sans">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Create your Setu account today and access all government services through a single portal.
          </p>
          <Link to="/auth?register=true">
            <Button size="lg" variant="secondary" className="gap-2 font-semibold px-8">
              Create Your Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
