Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gfx = [System.Drawing.Graphics]::FromImage($bmp)

$gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background Gradient
$bgRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
$bgColor1 = [System.Drawing.Color]::FromArgb(255, 12, 17, 28) # Dark Navy
$bgColor2 = [System.Drawing.Color]::FromArgb(255, 6, 8, 14)   # Pitch Black Navy
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $bgRect, $bgColor1, $bgColor2, 45.0
$gfx.FillRectangle($bgBrush, $bgRect)
$bgBrush.Dispose()

# Red Ambient Glow
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(450, -80, 700, 600)
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(50, 239, 68, 68) # Red glow
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
$gfx.FillPath($glowBrush, $glowPath)
$glowBrush.Dispose()
$glowPath.Dispose()

# Secondary Purple Ambient Glow
$glowPath2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath2.AddEllipse(100, 250, 600, 500)
$glowBrush2 = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath2)
$glowBrush2.CenterColor = [System.Drawing.Color]::FromArgb(35, 147, 51, 234) # Violet glow
$glowBrush2.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
$gfx.FillPath($glowBrush2, $glowPath2)
$glowBrush2.Dispose()
$glowPath2.Dispose()

# Outer Card Border / Subtle Frame
$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(50, 255, 255, 255)), 2
$gfx.DrawRectangle($borderPen, 20, 20, ($width - 40), ($height - 40))
$borderPen.Dispose()

# Top Badge Pill
$pillRect = New-Object System.Drawing.Rectangle 80, 70, 310, 42
$pillPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$pr = 20
$pillPath.AddArc($pillRect.X, $pillRect.Y, ($pr * 2), ($pr * 2), 180, 90)
$pillPath.AddArc(($pillRect.Right - $pr * 2), $pillRect.Y, ($pr * 2), ($pr * 2), 270, 90)
$pillPath.AddArc(($pillRect.Right - $pr * 2), ($pillRect.Bottom - $pr * 2), ($pr * 2), ($pr * 2), 0, 90)
$pillPath.AddArc($pillRect.X, ($pillRect.Bottom - $pr * 2), ($pr * 2), ($pr * 2), 90, 90)
$pillPath.CloseFigure()

$pillBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(35, 239, 68, 68))
$gfx.FillPath($pillBrush, $pillPath)
$pillBrush.Dispose()

$pillPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 239, 68, 68)), 1.5
$gfx.DrawPath($pillPen, $pillPath)
$pillPen.Dispose()
$pillPath.Dispose()

$pillFont = New-Object System.Drawing.Font "Segoe UI", 12, ([System.Drawing.FontStyle]::Bold)
$pillTextBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 113, 113))
$gfx.DrawString("⚡ 100% FREE CREATOR TOOLS", $pillFont, $pillTextBrush, 98, 81)
$pillFont.Dispose()
$pillTextBrush.Dispose()

# YouTube Red Rounded Icon Box
$iconX = 80
$iconY = 145
$iconW = 105
$iconH = 75
$ir = 22

$iconPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$iconPath.AddArc($iconX, $iconY, ($ir * 2), ($ir * 2), 180, 90)
$iconPath.AddArc(($iconX + $iconW - $ir * 2), $iconY, ($ir * 2), ($ir * 2), 270, 90)
$iconPath.AddArc(($iconX + $iconW - $ir * 2), ($iconY + $iconH - $ir * 2), ($ir * 2), ($ir * 2), 0, 90)
$iconPath.AddArc($iconX, ($iconY + $iconH - $ir * 2), ($ir * 2), ($ir * 2), 90, 90)
$iconPath.CloseFigure()

$iconRect = New-Object System.Drawing.Rectangle $iconX, $iconY, $iconW, $iconH
$iconGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush $iconRect, ([System.Drawing.Color]::FromArgb(255, 239, 68, 68)), ([System.Drawing.Color]::FromArgb(255, 220, 38, 38)), 45.0
$gfx.FillPath($iconGrad, $iconPath)
$iconGrad.Dispose()
$iconPath.Dispose()

# Play Triangle (White)
$triPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$triPath.AddLine([float]($iconX + 42), [float]($iconY + 23), [float]($iconX + 68), [float]($iconY + 37))
$triPath.AddLine([float]($iconX + 68), [float]($iconY + 37), [float]($iconX + 42), [float]($iconY + 52))
$triPath.CloseFigure()
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$gfx.FillPath($whiteBrush, $triPath)
$whiteBrush.Dispose()
$triPath.Dispose()

# Main Title: "YouTube Creator Toolkit Pro"
$titleFont = New-Object System.Drawing.Font "Segoe UI", 48, ([System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$gfx.DrawString("YouTube Creator", $titleFont, $titleBrush, 210, 140)
$gfx.DrawString("Toolkit Pro", $titleFont, $titleBrush, 80, 235)
$titleFont.Dispose()
$titleBrush.Dispose()

# Subtitle
$subFont = New-Object System.Drawing.Font "Segoe UI", 24, ([System.Drawing.FontStyle]::Regular)
$subBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 203, 213, 225))
$gfx.DrawString("60+ Free Pro Tools — Download, AI Scripts, SEO & Analytics", $subFont, $subBrush, 80, 340)
$subFont.Dispose()
$subBrush.Dispose()

# Feature Badges
$tags = @("AI Script Writer", "Tag Extractor", "Monetization Checker", "HD Thumbnails", "Revenue Calculator")
$tagFont = New-Object System.Drawing.Font "Segoe UI", 13, ([System.Drawing.FontStyle]::Bold)
$curX = 80
$tagY = 415

foreach ($t in $tags) {
    $tSize = $gfx.MeasureString($t, $tagFont)
    $tWidth = [int]$tSize.Width + 24
    $tHeight = 38
    
    $tRect = New-Object System.Drawing.Rectangle $curX, $tagY, $tWidth, $tHeight
    $tPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $tr = 12
    $tPath.AddArc($tRect.X, $tRect.Y, ($tr * 2), ($tr * 2), 180, 90)
    $tPath.AddArc(($tRect.Right - $tr * 2), $tRect.Y, ($tr * 2), ($tr * 2), 270, 90)
    $tPath.AddArc(($tRect.Right - $tr * 2), ($tRect.Bottom - $tr * 2), ($tr * 2), ($tr * 2), 0, 90)
    $tPath.AddArc($tRect.X, ($tRect.Bottom - $tr * 2), ($tr * 2), ($tr * 2), 90, 90)
    $tPath.CloseFigure()
    
    $tb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $gfx.FillPath($tb, $tPath)
    $tb.Dispose()
    
    $tp = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(50, 255, 255, 255)), 1
    $gfx.DrawPath($tp, $tPath)
    $tp.Dispose()
    $tPath.Dispose()
    
    $ttb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 226, 232, 240))
    $gfx.DrawString($t, $tagFont, $ttb, ($curX + 12), ($tagY + 8))
    $ttb.Dispose()
    
    $curX += $tWidth + 14
}
$tagFont.Dispose()

# Divider line
$divPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(40, 255, 255, 255)), 1
$gfx.DrawLine($divPen, 80, 495, ($width - 80), 495)
$divPen.Dispose()

# Footer
$domainFont = New-Object System.Drawing.Font "Segoe UI", 20, ([System.Drawing.FontStyle]::Bold)
$domainBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 113, 113))
$gfx.DrawString("freeyoutubetools.com", $domainFont, $domainBrush, 80, 525)
$domainFont.Dispose()
$domainBrush.Dispose()

$badgeFont = New-Object System.Drawing.Font "Segoe UI", 16, ([System.Drawing.FontStyle]::Regular)
$badgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 148, 163, 184))
$gfx.DrawString("No Signup Required • 100% Free Forever • Instant Processing", $badgeFont, $badgeBrush, 470, 530)
$badgeFont.Dispose()
$badgeBrush.Dispose()

$outPath = Join-Path $PSScriptRoot "..\public\og-image.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$gfx.Dispose()
$bmp.Dispose()
Write-Output "Successfully generated og-image.png at ${outPath} - $((Get-Item $outPath).Length) bytes"
