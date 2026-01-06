import { Link } from "wouter";
import { FileText, Shield, Scale, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Legal() {
  const legalDocs = [
    {
      title: "Impressum",
      description: "Angaben gemäß § 5 TMG und Kontaktinformationen",
      icon: FileText,
      href: "/impressum.html",
      color: "text-blue-500",
    },
    {
      title: "Datenschutzerklärung",
      description: "DSGVO-konforme Informationen zur Datenverarbeitung",
      icon: Shield,
      href: "/datenschutz.html",
      color: "text-green-500",
    },
    {
      title: "AGB",
      description: "Allgemeine Geschäftsbedingungen für die Nutzung von Infinity Creators",
      icon: Scale,
      href: "/agb.html",
      color: "text-purple-500",
    },
    {
      title: "Widerrufsbelehrung",
      description: "Informationen zum Widerrufsrecht bei digitalen Produkten",
      icon: RotateCcw,
      href: "/widerruf.html",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                Infinity Creators
              </a>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Rechtliche Informationen</h1>
          <p className="text-muted-foreground mb-8">
            Hier finden Sie alle rechtlichen Dokumente und Informationen zu Infinity Creators.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {legalDocs.map((doc) => {
              const Icon = doc.icon;
              return (
                <a
                  key={doc.title}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform hover:scale-105"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${doc.color}`} />
                        <CardTitle>{doc.title}</CardTitle>
                      </div>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Klicken Sie hier, um das vollständige Dokument zu öffnen.
                      </p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Kontakt</h2>
            <p className="mb-2">
              Bei Fragen zu rechtlichen Themen oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter:
            </p>
            <p className="font-medium">
              E-Mail:{" "}
              <a href="mailto:info.infinitycreators@gmail.com" className="text-primary hover:underline">
                info.infinitycreators@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Infinity Creators. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/impressum.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                Impressum
              </a>
              <a href="/datenschutz.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                Datenschutz
              </a>
              <a href="/agb.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                AGB
              </a>
              <a href="/widerruf.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                Widerruf
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
