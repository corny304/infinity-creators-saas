# fix-all.ps1
# MASTER-SCRIPT: Führt ALLE Fixes auf einmal durch!
# Führe dieses Script im Root deines Projekts aus (im Ordner wo client/ ist)

Write-Host "
╔════════════════════════════════════════════════════════════╗
║  🚀 INFINITY SHORTS - MASTER FIX SCRIPT                   ║
║  Behebt: Domain, Title, Sitemap, Robots.txt              ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# 1. BACKUP ERSTELLEN
Write-Host "`n📦 SCHRITT 1: Erstelle Backup..." -ForegroundColor Yellow
$backupFolder = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null

$itemsToBackup = @("client", "package.json")
foreach ($item in $itemsToBackup) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination "$backupFolder/$item" -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "   ✅ Backup erstellt in: $backupFolder" -ForegroundColor Green

# 2. DOMAIN FIX
Write-Host "`n🌐 SCHRITT 2: Domain-Migration (infinity-creators.com → infinityshorts.com)..." -ForegroundColor Yellow
$allFiles = Get-ChildItem -Path . -Include *.html,*.tsx,*.ts,*.jsx,*.js,*.json,*.xml,*.txt,*.md -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\dist\\|\\build\\|\\.git\\|\\backup-' }

$domainChanges = 0
foreach ($file in $allFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -match 'infinity-creators\.com') {
            $newContent = $content -replace 'infinity-creators\.com', 'infinityshorts.com'
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "   ✅ $($file.Name)" -ForegroundColor Gray
            $domainChanges++
        }
    }
    catch {
        Write-Host "   ⚠️  Fehler bei: $($file.Name)" -ForegroundColor Red
    }
}
Write-Host "   📊 $domainChanges Dateien geändert" -ForegroundColor Green

# 3. TITLE FIX
Write-Host "`n📝 SCHRITT 3: Title-Fix (Generater → Generator)..." -ForegroundColor Yellow
$titleChanges = 0
foreach ($file in $allFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -match 'Generater') {
            $newContent = $content -replace 'Generater', 'Generator'
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "   ✅ $($file.Name)" -ForegroundColor Gray
            $titleChanges++
        }
    }
    catch {
        Write-Host "   ⚠️  Fehler bei: $($file.Name)" -ForegroundColor Red
    }
}
Write-Host "   📊 $titleChanges Dateien geändert" -ForegroundColor Green

# 4. SITEMAP & ROBOTS.TXT
Write-Host "`n📄 SCHRITT 4: Sitemap & Robots.txt..." -ForegroundColor Yellow

# Sitemap erstellen
$sitemapPath = "client\public\sitemap.xml"
if (Test-Path $sitemapPath) {
    $sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://infinityshorts.com/</loc>
    <lastmod>2026-01-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://infinityshorts.com/dashboard</loc>
    <lastmod>2026-01-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://infinityshorts.com/generator</loc>
    <lastmod>2026-01-06</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://infinityshorts.com/pricing</loc>
    <lastmod>2026-01-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://infinityshorts.com/privacy-policy</loc>
    <lastmod>2026-01-06</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://infinityshorts.com/terms-of-service</loc>
    <lastmod>2026-01-06</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
"@
    Set-Content -Path $sitemapPath -Value $sitemap
    Write-Host "   ✅ sitemap.xml aktualisiert" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️  sitemap.xml nicht gefunden - erstelle sie in client/public/" -ForegroundColor Yellow
}

# Robots.txt erstellen
$robotsPath = "client\public\robots.txt"
if (Test-Path $robotsPath) {
    $robots = @"
# robots.txt for infinityshorts.com

User-agent: *
Allow: /

# Sitemaps
Sitemap: https://infinityshorts.com/sitemap.xml

# Disallow admin/internal pages
Disallow: /admin/
Disallow: /api/
Disallow: /.well-known/

# Allow important pages
Allow: /dashboard
Allow: /generator
Allow: /pricing
Allow: /privacy-policy
Allow: /terms-of-service

# Crawl-delay (optional, for politeness)
Crawl-delay: 1
"@
    Set-Content -Path $robotsPath -Value $robots
    Write-Host "   ✅ robots.txt aktualisiert" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️  robots.txt nicht gefunden - erstelle sie in client/public/" -ForegroundColor Yellow
}

# 5. INDEX.HTML SPEZIAL-CHECK
Write-Host "`n🔍 SCHRITT 5: Index.html Spezial-Check..." -ForegroundColor Yellow
$indexPath = "client\index.html"
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath -Raw
    
    $issues = @()
    if ($indexContent -match 'infinity-creators\.com') {
        $issues += "❌ Alte Domain gefunden"
    }
    if ($indexContent -match 'Generater') {
        $issues += "❌ Typo 'Generater' gefunden"
    }
    if ($indexContent -match '/home"') {
        $issues += "⚠️  Canonical hat '/home' - sollte '/' sein"
    }
    
    if ($issues.Count -eq 0) {
        Write-Host "   ✅ index.html ist sauber!" -ForegroundColor Green
    }
    else {
        Write-Host "   🔧 Gefundene Probleme:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "      $issue" -ForegroundColor Red
        }
    }
}

# 6. ZUSAMMENFASSUNG
Write-Host "
╔════════════════════════════════════════════════════════════╗
║  ✨ FERTIG!                                                ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Green

Write-Host "📊 ÄNDERUNGEN:" -ForegroundColor Cyan
Write-Host "   • Domain-Fixes: $domainChanges Dateien" -ForegroundColor White
Write-Host "   • Title-Fixes: $titleChanges Dateien" -ForegroundColor White
Write-Host "   • Sitemap.xml: Aktualisiert" -ForegroundColor White
Write-Host "   • Robots.txt: Aktualisiert" -ForegroundColor White
Write-Host "   • Backup: $backupFolder" -ForegroundColor White

Write-Host "`n🚀 NÄCHSTE SCHRITTE:" -ForegroundColor Cyan
Write-Host "   1. cd client" -ForegroundColor Gray
Write-Host "   2. npm run dev      (Test lokal)" -ForegroundColor Gray
Write-Host "   3. Prüfe http://localhost:5173" -ForegroundColor Gray
Write-Host "   4. npm run build    (Production Build)" -ForegroundColor Gray
Write-Host "   5. git add ." -ForegroundColor Gray
Write-Host "   6. git commit -m 'fix: migrate to infinityshorts.com'" -ForegroundColor Gray
Write-Host "   7. git push origin main" -ForegroundColor Gray

Write-Host "`n💡 TIPPS:" -ForegroundColor Yellow
Write-Host "   • Öffne DevTools (F12) und suche nach 'infinity-creators'" -ForegroundColor Gray
Write-Host "   • Prüfe /sitemap.xml und /robots.txt im Browser" -ForegroundColor Gray
Write-Host "   • Submit neue Sitemap in Google Search Console" -ForegroundColor Gray

Write-Host "`n📧 Bei Problemen oder Fragen: Schreib mir!" -ForegroundColor Cyan
Write-Host ""
