import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search } from "lucide-react";
import React from "react";

const portals = [
  { name: "Department of Passports", url: "https://nepalpassport.gov.np", category: "Immigration", description: "Apply for and renew passports online." },
  { name: "Nagarik App", url: "https://nagarikapp.gov.np", category: "Digital Services", description: "Access digital government services and identity." },
  { name: "Election Commission", url: "https://election.gov.np", category: "Governance", description: "Voter registration and election information." },
  { name: "Department of Transport", url: "https://dotm.gov.np", category: "Transport", description: "Driving license and vehicle registration." },
  { name: "Inland Revenue Department", url: "https://ird.gov.np", category: "Finance", description: "Tax filing and PAN registration." },
  { name: "Nepal Rastra Bank", url: "https://nrb.org.np", category: "Finance", description: "Central bank of Nepal — monetary policies." },
  { name: "Ministry of Education", url: "https://moest.gov.np", category: "Education", description: "Scholarships, academic certifications." },
  { name: "Ministry of Health", url: "https://mohp.gov.np", category: "Health", description: "Public health services and vaccination programs." },
  { name: "Land Revenue Office", url: "https://dolr.gov.np", category: "Land", description: "Land registration and ownership records." },
  { name: "Company Registrar", url: "https://ocr.gov.np", category: "Business", description: "Register companies and businesses." },
  { name: "Social Security Fund", url: "https://ssf.gov.np", category: "Social", description: "Social security contributions and benefits." },
  { name: "Nepal Police", url: "https://nepalpolice.gov.np", category: "Security", description: "Police services, FIR filing, and clearance." },
];

const categories = [...new Set(portals.map((p) => p.category))];

export default function PortalsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = portals.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Government Portals</h1>
        <p className="text-muted-foreground">
          Access official government websites and services across Nepal.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`badge-status px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            !activeCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`badge-status px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((portal) => (
          <a
            key={portal.name}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-elevated rounded-xl border bg-card p-5 flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{portal.name}</h3>
                <span className="badge-status bg-muted text-muted-foreground mt-1">{portal.category}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{portal.description}</p>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No portals found matching your search.</p>
        </div>
      )}
    </div>
  );
}
