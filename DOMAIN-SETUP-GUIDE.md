# Hostinger Domain mit Manus-App Verbinden

**Anleitung für: Infinity Creators Micro-SaaS**  
**Erstellt: Dezember 2024**  
**Geschätzte Dauer: 15-30 Minuten**

---

## 📋 Übersicht

Diese Anleitung zeigt Ihnen, wie Sie Ihre eigene Domain von Hostinger mit Ihrer auf Manus gehosteten Infinity Creators App verbinden. Nach Abschluss dieser Schritte wird Ihre App unter Ihrer eigenen Domain (z.B. `infinity-creators.com`) erreichbar sein, mit automatischem SSL-Zertifikat (HTTPS) und globalem CDN.

**Was Sie benötigen:**
- Zugang zu Ihrem Hostinger-Account (hPanel)
- Zugang zum Manus Management UI Ihrer App
- Ihre Domain (bereits bei Hostinger registriert)
- Ca. 15-30 Minuten Zeit (DNS-Propagierung kann 24-48 Stunden dauern)

**Was Sie NICHT benötigen:**
- Domain-Übertragungscode (Domain bleibt bei Hostinger)
- Hosting-Paket bei Hostinger (nur DNS-Verwaltung wird genutzt)
- Technische Server-Kenntnisse

---

## 🎯 Schritt 1: Manus-App Veröffentlichen (Publish)

Bevor Sie eine Custom Domain verbinden können, muss Ihre App auf Manus veröffentlicht sein.

### 1.1 Checkpoint Erstellen (Falls noch nicht geschehen)

Ihre App hat bereits einen aktuellen Checkpoint (`0d1ef527`), daher können Sie diesen Schritt überspringen. Falls Sie Änderungen vorgenommen haben, erstellen Sie einen neuen Checkpoint:

1. Öffnen Sie das Manus Management UI (rechtes Panel in der Chatbox)
2. Alle Änderungen werden automatisch gespeichert
3. Ein Checkpoint wurde bereits erstellt

### 1.2 App Veröffentlichen

1. **Öffnen Sie das Manus Management UI** (Icon oben rechts in der Chatbox)
2. **Klicken Sie auf den "Publish"-Button** (oben rechts im Management UI)
3. **Warten Sie auf die Bestätigung** (ca. 30-60 Sekunden)
4. **Notieren Sie sich die automatisch generierte Manus-Domain**, z.B.:
   ```
   https://infinity-creators-saas.manus.space
   ```

Nach erfolgreicher Veröffentlichung ist Ihre App unter der Manus-Domain erreichbar.

---

## 🌐 Schritt 2: Custom Domain in Manus Hinzufügen

Jetzt verbinden Sie Ihre eigene Domain mit der veröffentlichten App.

### 2.1 Domain-Einstellungen Öffnen

1. **Öffnen Sie das Manus Management UI** (falls nicht bereits geöffnet)
2. **Navigieren Sie zu "Settings"** (linke Seitenleiste im Management UI)
3. **Klicken Sie auf "Domains"** im Settings-Menü

### 2.2 Neue Domain Hinzufügen

1. **Klicken Sie auf "Add Custom Domain"** oder "+ Domain hinzufügen"
2. **Geben Sie Ihre Domain ein**, z.B.:
   - `infinity-creators.com` (Hauptdomain)
   - ODER `www.infinity-creators.com` (mit www-Subdomain)
   - ODER beides (empfohlen, siehe unten)

3. **Klicken Sie auf "Add" oder "Hinzufügen"**

### 2.3 DNS-Anweisungen Notieren

Nach dem Hinzufügen der Domain zeigt Manus Ihnen die erforderlichen DNS-Einstellungen an. Diese sehen typischerweise so aus:

**Für Hauptdomain (infinity-creators.com):**
```
Type: A
Name: @
Value: [IP-Adresse von Manus, z.B. 76.76.21.21]
TTL: 3600 (oder Auto)
```

**Für www-Subdomain (www.infinity-creators.com):**
```
Type: CNAME
Name: www
Value: [Manus-Ziel, z.B. cname.manus.space]
TTL: 3600 (oder Auto)
```

**WICHTIG:** Notieren Sie sich diese Werte genau! Sie benötigen sie im nächsten Schritt bei Hostinger.

---

## 🔧 Schritt 3: DNS-Einstellungen bei Hostinger Konfigurieren

Jetzt ändern Sie die DNS-Einstellungen Ihrer Domain bei Hostinger, damit sie auf Manus zeigt.

### 3.1 Hostinger hPanel Öffnen

1. **Gehen Sie zu** [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
2. **Loggen Sie sich ein** mit Ihren Hostinger-Zugangsdaten
3. **Navigieren Sie zu "Domains"** im Hauptmenü (linke Seitenleiste)

### 3.2 Domain Auswählen

1. **Finden Sie Ihre Domain** in der Domain-Liste (z.B. `infinity-creators.com`)
2. **Klicken Sie auf "Manage"** oder "Verwalten" neben der Domain

### 3.3 DNS-Zone Öffnen

1. **Scrollen Sie nach unten** zu "DNS / Name Servers"
2. **Klicken Sie auf "DNS Zone"** oder "DNS-Einstellungen"
3. Sie sehen jetzt eine Liste aller DNS-Einträge für Ihre Domain

### 3.4 A-Record für Hauptdomain Hinzufügen/Bearbeiten

**Schritt 3.4.1: Alte A-Records Löschen (falls vorhanden)**

Suchen Sie nach bestehenden A-Records mit Name `@` oder leer:

1. **Klicken Sie auf das "Mülleimer"-Icon** neben jedem A-Record mit Name `@`
2. **Bestätigen Sie die Löschung**

**Schritt 3.4.2: Neuen A-Record Erstellen**

1. **Klicken Sie auf "Add Record"** oder "+ Eintrag hinzufügen"
2. **Wählen Sie "A" als Type**
3. **Füllen Sie die Felder aus:**
   - **Type:** A
   - **Name:** `@` (steht für die Hauptdomain)
   - **Points to / Value:** `[IP-Adresse von Manus]` (aus Schritt 2.3)
   - **TTL:** `3600` (oder lassen Sie es auf "Auto")
4. **Klicken Sie auf "Add Record"** oder "Speichern"

### 3.5 CNAME-Record für www-Subdomain Hinzufügen/Bearbeiten

**Schritt 3.5.1: Alte CNAME/A-Records für www Löschen (falls vorhanden)**

Suchen Sie nach bestehenden Records mit Name `www`:

1. **Klicken Sie auf das "Mülleimer"-Icon** neben jedem Record mit Name `www`
2. **Bestätigen Sie die Löschung**

**Schritt 3.5.2: Neuen CNAME-Record Erstellen**

1. **Klicken Sie auf "Add Record"** oder "+ Eintrag hinzufügen"
2. **Wählen Sie "CNAME" als Type**
3. **Füllen Sie die Felder aus:**
   - **Type:** CNAME
   - **Name:** `www`
   - **Points to / Value:** `[Manus CNAME-Ziel]` (aus Schritt 2.3, z.B. `cname.manus.space`)
   - **TTL:** `3600` (oder lassen Sie es auf "Auto")
4. **Klicken Sie auf "Add Record"** oder "Speichern"

### 3.6 DNS-Einstellungen Überprüfen

Nach dem Hinzufügen sollten Ihre DNS-Einträge so aussehen:

| Type  | Name | Value/Points To           | TTL  |
|-------|------|---------------------------|------|
| A     | @    | [Manus IP-Adresse]        | 3600 |
| CNAME | www  | cname.manus.space         | 3600 |

**WICHTIG:** Lassen Sie alle anderen DNS-Einträge (MX, TXT, etc.) unverändert, falls Sie E-Mail-Dienste nutzen!

---

## ⏱️ Schritt 4: DNS-Propagierung Abwarten

Nach der Änderung der DNS-Einstellungen müssen diese weltweit verbreitet werden.

### 4.1 Propagierungszeit

Die DNS-Änderungen können **zwischen 5 Minuten und 48 Stunden** dauern, bis sie weltweit wirksam sind. In den meisten Fällen funktioniert es innerhalb von **1-4 Stunden**.

### 4.2 DNS-Propagierung Überprüfen

Sie können den Status der DNS-Propagierung überprüfen:

**Online-Tools:**
1. **Gehen Sie zu** [https://dnschecker.org](https://dnschecker.org)
2. **Geben Sie Ihre Domain ein** (z.B. `infinity-creators.com`)
3. **Wählen Sie "A" als Record Type**
4. **Klicken Sie auf "Search"**
5. **Prüfen Sie, ob die Manus-IP-Adresse** weltweit angezeigt wird (grüne Häkchen)

**Kommandozeile (für technisch versierte Nutzer):**
```bash
# A-Record prüfen
nslookup infinity-creators.com

# CNAME-Record prüfen
nslookup www.infinity-creators.com
```

### 4.3 Was Sie Während der Wartezeit Tun Können

- ☕ Machen Sie eine Kaffeepause
- 📧 Überprüfen Sie Ihre E-Mails
- 🎨 Arbeiten Sie an Ihrem Marketing-Material
- ⏰ Kommen Sie in 2-4 Stunden zurück und prüfen Sie erneut

---

## ✅ Schritt 5: SSL-Zertifikat Verifizierung in Manus

Sobald die DNS-Propagierung abgeschlossen ist, stellt Manus automatisch ein SSL-Zertifikat aus.

### 5.1 Domain-Status Überprüfen

1. **Öffnen Sie das Manus Management UI**
2. **Navigieren Sie zu "Settings → Domains"**
3. **Prüfen Sie den Status Ihrer Domain:**
   - 🟡 **"Pending" / "Ausstehend":** DNS noch nicht propagiert, warten Sie weiter
   - 🟢 **"Active" / "Aktiv":** Domain ist verbunden, SSL-Zertifikat ausgestellt
   - 🔴 **"Error" / "Fehler":** Siehe Troubleshooting unten

### 5.2 SSL-Zertifikat Testen

Sobald der Status "Active" ist:

1. **Öffnen Sie einen neuen Browser-Tab**
2. **Geben Sie Ihre Domain ein:** `https://infinity-creators.com`
3. **Prüfen Sie das Schloss-Symbol** in der Adressleiste (sollte grün/sicher sein)
4. **Klicken Sie auf das Schloss-Symbol** → "Zertifikat" → Prüfen Sie, ob es von "Let's Encrypt" oder "Manus" ausgestellt wurde

### 5.3 Beide Domains Testen

Testen Sie beide Varianten Ihrer Domain:

- ✅ `https://infinity-creators.com` (Hauptdomain)
- ✅ `https://www.infinity-creators.com` (www-Subdomain)

Beide sollten auf Ihre App zeigen und ein gültiges SSL-Zertifikat haben.

---

## 🎉 Schritt 6: Fertig! Ihre App ist Live

**Herzlichen Glückwunsch!** Ihre Infinity Creators App ist jetzt unter Ihrer eigenen Domain erreichbar.

### 6.1 Finale Checkliste

Überprüfen Sie folgende Punkte:

- ✅ **Domain erreichbar:** `https://infinity-creators.com` lädt Ihre App
- ✅ **www-Subdomain erreichbar:** `https://www.infinity-creators.com` lädt Ihre App
- ✅ **SSL-Zertifikat gültig:** Grünes Schloss-Symbol im Browser
- ✅ **Login funktioniert:** Manus OAuth-Login funktioniert korrekt
- ✅ **Stripe-Zahlungen funktionieren:** Testweise eine Zahlung durchführen
- ✅ **Alle Seiten erreichbar:** Generator, Dashboard, Pricing, Legal-Seiten

### 6.2 Wichtige Nächste Schritte

**Stripe Webhook-URL Aktualisieren:**

Da Ihre App jetzt unter einer neuen Domain läuft, müssen Sie die Webhook-URL in Stripe aktualisieren:

1. **Gehen Sie zu** [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Klicken Sie auf Ihren bestehenden Webhook** (oder erstellen Sie einen neuen)
3. **Aktualisieren Sie die Endpoint-URL:**
   ```
   https://infinity-creators.com/api/webhooks/stripe
   ```
4. **Speichern Sie die Änderungen**
5. **Testen Sie den Webhook** mit einer Test-Zahlung

**Google Analytics / Tracking Aktualisieren:**

Falls Sie Analytics nutzen, aktualisieren Sie die Domain in Ihren Tracking-Einstellungen.

**Social Media Links Aktualisieren:**

Aktualisieren Sie alle Links zu Ihrer App in Social Media Profilen, E-Mail-Signaturen, etc.

---

## 🔧 Troubleshooting: Häufige Probleme

### Problem 1: "Domain Status: Error" in Manus

**Mögliche Ursachen:**
- DNS-Einträge noch nicht propagiert (warten Sie weitere 24 Stunden)
- Falsche DNS-Einträge bei Hostinger
- Alte DNS-Cache

**Lösung:**
1. **Überprüfen Sie die DNS-Einträge bei Hostinger** (Schritt 3.6)
2. **Nutzen Sie dnschecker.org** um zu prüfen, ob die DNS-Einträge weltweit sichtbar sind
3. **Warten Sie weitere 24 Stunden** und prüfen Sie erneut
4. **Kontaktieren Sie Manus Support** falls das Problem nach 48 Stunden weiterhin besteht

### Problem 2: "SSL Certificate Error" / "Not Secure"

**Mögliche Ursachen:**
- SSL-Zertifikat wird noch ausgestellt (kann bis zu 1 Stunde dauern)
- DNS-Einträge nicht korrekt

**Lösung:**
1. **Warten Sie 1-2 Stunden** nach erfolgreicher DNS-Propagierung
2. **Leeren Sie Ihren Browser-Cache:** Strg+Shift+Entf (Windows) oder Cmd+Shift+Delete (Mac)
3. **Versuchen Sie einen Inkognito-Tab** oder anderen Browser
4. **Prüfen Sie den Domain-Status in Manus** (sollte "Active" sein)

### Problem 3: Domain zeigt auf alte Hostinger-Seite

**Mögliche Ursachen:**
- DNS-Einträge noch nicht aktualisiert
- Browser-Cache zeigt alte Version
- DNS-Cache Ihres Internetproviders

**Lösung:**
1. **Überprüfen Sie die DNS-Einträge bei Hostinger** (Schritt 3.6)
2. **Leeren Sie Ihren Browser-Cache**
3. **Leeren Sie Ihren DNS-Cache:**
   - **Windows:** Öffnen Sie CMD als Administrator → `ipconfig /flushdns`
   - **Mac:** Terminal → `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - **Linux:** Terminal → `sudo systemd-resolve --flush-caches`
4. **Warten Sie weitere 24 Stunden** für vollständige DNS-Propagierung

### Problem 4: www-Subdomain funktioniert nicht

**Mögliche Ursachen:**
- CNAME-Record nicht korrekt gesetzt
- CNAME zeigt auf falsche Adresse

**Lösung:**
1. **Überprüfen Sie den CNAME-Record bei Hostinger:**
   - Name: `www`
   - Type: `CNAME`
   - Value: `[Manus CNAME-Ziel]` (aus Manus Domain-Einstellungen)
2. **Löschen Sie alte A-Records für www** (CNAME und A-Record können nicht gleichzeitig existieren)
3. **Warten Sie auf DNS-Propagierung** (1-24 Stunden)

### Problem 5: E-Mails funktionieren nicht mehr

**Mögliche Ursachen:**
- MX-Records versehentlich gelöscht

**Lösung:**
1. **Überprüfen Sie Ihre MX-Records bei Hostinger** (sollten NICHT gelöscht worden sein)
2. **Falls gelöscht:** Stellen Sie die MX-Records wieder her (Hostinger Support kann helfen)
3. **Wichtig:** Ändern Sie NUR A- und CNAME-Records, NIEMALS MX-, TXT- oder andere Records!

### Problem 6: Stripe Webhooks funktionieren nicht

**Mögliche Ursachen:**
- Webhook-URL in Stripe noch nicht aktualisiert
- Alte Domain in Webhook-URL

**Lösung:**
1. **Gehen Sie zu Stripe Dashboard → Webhooks**
2. **Aktualisieren Sie die Endpoint-URL** auf `https://ihre-domain.com/api/webhooks/stripe`
3. **Testen Sie den Webhook** mit einer Test-Zahlung
4. **Überprüfen Sie die Webhook-Logs** in Stripe für Fehler

---

## 📞 Support & Hilfe

### Manus Support

Falls Sie Probleme mit der Domain-Verbindung in Manus haben:

- **Support-Portal:** [https://help.manus.im](https://help.manus.im)
- **Beschreiben Sie Ihr Problem** mit Screenshots vom Domain-Status in Manus

### Hostinger Support

Falls Sie Probleme mit DNS-Einstellungen bei Hostinger haben:

- **Hostinger Support:** [https://www.hostinger.com/contact](https://www.hostinger.com/contact)
- **Live Chat:** Verfügbar 24/7 im hPanel
- **Beschreiben Sie, dass Sie DNS-Einträge für eine externe App ändern möchten**

---

## 📚 Zusätzliche Ressourcen

### DNS-Grundlagen

DNS (Domain Name System) übersetzt Domain-Namen (wie `infinity-creators.com`) in IP-Adressen (wie `76.76.21.21`), die Computer verstehen können.

**Wichtige DNS-Record-Typen:**

| Record Type | Zweck | Beispiel |
|-------------|-------|----------|
| **A** | Zeigt Domain auf IPv4-Adresse | `infinity-creators.com` → `76.76.21.21` |
| **CNAME** | Alias für eine andere Domain | `www.infinity-creators.com` → `cname.manus.space` |
| **MX** | E-Mail-Server für Domain | `mail.hostinger.com` (für E-Mails) |
| **TXT** | Text-Informationen (z.B. SPF, DKIM) | Für E-Mail-Verifizierung |

### Warum Manus Hosting statt Hostinger?

**Manus Hosting Vorteile:**

1. **Automatische Skalierung:** Ihre App skaliert automatisch bei Traffic-Spitzen
2. **Globales CDN:** Schnelle Ladezeiten weltweit
3. **Automatische SSL-Zertifikate:** Kostenlose HTTPS-Verschlüsselung
4. **Zero-Downtime Deployments:** Updates ohne Ausfallzeiten
5. **Automatische Backups:** Ihre Daten sind gesichert
6. **Node.js Optimiert:** Perfekt für React/Express-Apps
7. **Keine Server-Verwaltung:** Sie müssen sich um nichts kümmern

**Hostinger Shared Hosting Nachteile für Node.js-Apps:**

1. ❌ Begrenzte Node.js-Unterstützung
2. ❌ Keine WebSocket-Unterstützung (für Webhooks problematisch)
3. ❌ Shared Resources (langsam bei Traffic-Spitzen)
4. ❌ Komplexe manuelle Konfiguration erforderlich
5. ❌ Keine automatischen Backups für Node.js-Apps
6. ❌ Keine automatische Skalierung

### Domain-Kosten

**Was kostet die Domain-Verbindung?**

- **Manus Custom Domain:** Kostenlos (in Ihrem Manus-Plan enthalten)
- **Hostinger Domain-Registrierung:** Ca. €8-15/Jahr (bereits bezahlt)
- **SSL-Zertifikat:** Kostenlos (automatisch von Manus ausgestellt)

Sie zahlen also nur die jährliche Domain-Gebühr bei Hostinger, alles andere ist kostenlos!

---

## ✅ Zusammenfassung

**Was Sie getan haben:**

1. ✅ App auf Manus veröffentlicht (Publish)
2. ✅ Custom Domain in Manus hinzugefügt
3. ✅ DNS-Einträge bei Hostinger konfiguriert (A-Record + CNAME)
4. ✅ Auf DNS-Propagierung gewartet (1-48 Stunden)
5. ✅ SSL-Zertifikat automatisch von Manus ausgestellt
6. ✅ Stripe Webhook-URL aktualisiert

**Was Sie jetzt haben:**

- 🌐 Ihre App läuft unter Ihrer eigenen Domain
- 🔒 Automatisches SSL-Zertifikat (HTTPS)
- 🚀 Globales CDN für schnelle Ladezeiten
- 📈 Automatische Skalierung bei Traffic-Spitzen
- 💰 Keine zusätzlichen Hosting-Kosten

**Nächste Schritte:**

1. **Marketing starten:** Nutzen Sie die vorbereiteten Social Media Assets
2. **App Store Submission:** Reichen Sie die Mobile Apps ein
3. **Traffic generieren:** Starten Sie Ihre 90-Tage-Marketing-Kampagne
4. **Monetarisierung:** Ihre App ist bereit, Geld zu verdienen!

---

**Viel Erfolg mit Ihrer Infinity Creators App! 🎉**

Bei Fragen oder Problemen können Sie jederzeit den Manus Support unter [https://help.manus.im](https://help.manus.im) kontaktieren.
