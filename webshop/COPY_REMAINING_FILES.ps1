# PowerShell script om alle resterende bestanden te kopiëren
# Run dit vanuit de root directory van het project

Write-Host "Copying remaining files for standalone webshop..."

# UI Components (alle)
Write-Host "Copying UI components..."
Copy-Item -Path "src\components\ui\*" -Destination "webshop\src\components\ui\" -Recurse -Force

# Layout components
Write-Host "Copying layout components..."
Copy-Item -Path "src\components\layout\Container.tsx" -Destination "webshop\src\components\layout\" -Force
Copy-Item -Path "src\components\layout\Section.tsx" -Destination "webshop\src\components\layout\" -Force
Copy-Item -Path "src\components\layout\PageHeader.tsx" -Destination "webshop\src\components\layout\" -Force
Copy-Item -Path "src\components\layout\FilterSidebar.tsx" -Destination "webshop\src\components\layout\" -Force

# Hooks
Write-Host "Copying hooks..."
Copy-Item -Path "src\hooks\useAuth.ts" -Destination "webshop\src\hooks\" -Force
Copy-Item -Path "src\hooks\useSEO.ts" -Destination "webshop\src\hooks\" -Force
Copy-Item -Path "src\hooks\use-toast.ts" -Destination "webshop\src\hooks\" -Force

# Auth
Write-Host "Copying auth components..."
Copy-Item -Path "src\components\auth\*" -Destination "webshop\src\components\auth\" -Recurse -Force

# Analytics
Write-Host "Copying analytics components..."
Copy-Item -Path "src\components\analytics\*" -Destination "webshop\src\components\analytics\" -Recurse -Force

# Routing
Write-Host "Copying routing components..."
New-Item -ItemType Directory -Force -Path "webshop\src\components\routing" | Out-Null
Copy-Item -Path "src\components\routing\ScrollToTop.tsx" -Destination "webshop\src\components\routing\" -Force

# Public assets (logo)
Write-Host "Copying public assets..."
New-Item -ItemType Directory -Force -Path "webshop\public\Blue Diamonds Foto's" | Out-Null
if (Test-Path "public\Blue Diamonds Foto's\bluediamondslogo.png") {
    Copy-Item -Path "public\Blue Diamonds Foto's\bluediamondslogo.png" -Destination "webshop\public\Blue Diamonds Foto's\" -Force
}

Write-Host "Done! Now you need to:"
Write-Host "1. Create webshop/server/index.ts with shop endpoints"
Write-Host "2. Copy server/env.ts, server/auth.ts, server/stripe.ts, server/prisma.ts"
Write-Host "3. Copy prisma schema (only shop models)"
Write-Host "4. Create login/aanmelden pages or link to main site"
Write-Host "5. Test: cd webshop && npm install && npm run build"
