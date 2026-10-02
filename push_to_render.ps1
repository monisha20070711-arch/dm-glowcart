Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Pushing DM-GLOWCART Fixes to GitHub for Render Deploy" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location -Path "C:\Users\Monisha\.gemini\antigravity\scratch\dm-glowcart"
git add .
git commit -m "Fix Render build dependencies, Under 20rs deals, Glow Match survey & unique images"
git push origin main --force

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "DONE! Render auto-deploy triggered at https://dm-glowcart1.onrender.com/" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
