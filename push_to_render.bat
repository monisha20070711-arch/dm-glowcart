@echo off
echo ========================================================
echo Pushing DM-GLOWCART Fixes to GitHub for Render Deploy
echo ========================================================
cd /d "C:\Users\Monisha\.gemini\antigravity\scratch\dm-glowcart"
git add .
git commit -m "Fix Render build dependencies, Under 20rs deals, Glow Match survey & unique images"
git push origin main --force
echo ========================================================
echo DONE! Render auto-deploy triggered at https://dm-glowcart1.onrender.com/
echo ========================================================
pause
