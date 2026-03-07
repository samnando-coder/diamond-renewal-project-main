# PowerShell script om shared dependencies te kopiëren naar webshop folder

# UI Components
Write-Host "Copying UI components..."
Copy-Item -Path "..\src\components\ui\*" -Destination "src\components\ui\" -Recurse -Force

# Layout Components
Write-Host "Copying layout components..."
New-Item -ItemType Directory -Force -Path "src\components\layout" | Out-Null
Copy-Item -Path "..\src\components\layout\Container.tsx" -Destination "src\components\layout\" -Force
Copy-Item -Path "..\src\components\layout\Section.tsx" -Destination "src\components\layout\" -Force
Copy-Item -Path "..\src\components\layout\PageHeader.tsx" -Destination "src\components\layout\" -Force
Copy-Item -Path "..\src\components\layout\FilterSidebar.tsx" -Destination "src\components\layout\" -Force

# Hooks
Write-Host "Copying hooks..."
New-Item -ItemType Directory -Force -Path "src\hooks" | Out-Null
Copy-Item -Path "..\src\hooks\useAuth.ts" -Destination "src\hooks\" -Force
Copy-Item -Path "..\src\hooks\useSEO.ts" -Destination "src\hooks\" -Force
Copy-Item -Path "..\src\hooks\use-toast.ts" -Destination "src\hooks\" -Force

# Auth Provider
Write-Host "Copying auth components..."
New-Item -ItemType Directory -Force -Path "src\components\auth" | Out-Null
Copy-Item -Path "..\src\components\auth\*" -Destination "src\components\auth\" -Recurse -Force

# Analytics
Write-Host "Copying analytics components..."
New-Item -ItemType Directory -Force -Path "src\components\analytics" | Out-Null
Copy-Item -Path "..\src\components\analytics\*" -Destination "src\components\analytics\" -Recurse -Force

# Cloudinary mapping JSON
Write-Host "Copying cloudinary mapping..."
Copy-Item -Path "..\src\lib\cloudinary-mapping.json" -Destination "src\lib\" -Force -ErrorAction SilentlyContinue

Write-Host "Done!"
