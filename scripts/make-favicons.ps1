Add-Type -AssemblyName System.Drawing

function Create-AppIconImage([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Transparent background
    $gfx.Clear([System.Drawing.Color]::Transparent)

    # Red-rose gradient rounded rectangle
    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $color1 = [System.Drawing.Color]::FromArgb(255, 239, 68, 68) # red-500 (#ef4444)
    $color2 = [System.Drawing.Color]::FromArgb(255, 225, 29, 72) # rose-600 (#e11d48)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $color1, $color2, 45.0

    $radius = [float]($size * 0.28) # Squircle curvature matching rounded-xl
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
    $path.AddArc(($size - $diameter), 0, $diameter, $diameter, 270, 90)
    $path.AddArc(($size - $diameter), ($size - $diameter), $diameter, $diameter, 0, 90)
    $path.AddArc(0, ($size - $diameter), $diameter, $diameter, 90, 90)
    $path.CloseFigure()

    $gfx.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()

    # White Play Triangle
    # Scale points relative to size
    $x1 = [float]($size * 0.38)
    $y1 = [float]($size * 0.28)
    $x2 = [float]($size * 0.72)
    $y2 = [float]($size * 0.50)
    $x3 = [float]($size * 0.38)
    $y3 = [float]($size * 0.72)

    $triPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $triPath.AddLine($x1, $y1, $x2, $y2)
    $triPath.AddLine($x2, $y2, $x3, $y3)
    $triPath.CloseFigure()

    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $gfx.FillPath($whiteBrush, $triPath)
    $whiteBrush.Dispose()
    $triPath.Dispose()

    $gfx.Dispose()
    return $bmp
}

# 1. Generate Apple Touch Icon (180x180)
$appleIcon = Create-AppIconImage 180
$appleIconPath = "E:\My Tools\youtube-creator-toolkit-pro\public\apple-touch-icon.png"
$appleIcon.Save($appleIconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$appleIcon.Dispose()
Write-Output "Created $appleIconPath"

# Also copy to src/app/apple-touch-icon.png
Copy-Item $appleIconPath "E:\My Tools\youtube-creator-toolkit-pro\src\app\apple-touch-icon.png" -Force

# 2. Generate PNGs for ICO (16, 32, 48)
$sizes = @(16, 32, 48)
$pngBytesList = @()

foreach ($sz in $sizes) {
    $img = Create-AppIconImage $sz
    $ms = New-Object System.IO.MemoryStream
    $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytesList += ,$ms.ToArray()
    $ms.Dispose()
    $img.Dispose()
}

# 3. Build Multi-Resolution ICO File
$icoMs = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter $icoMs

# ICONDIR header
$bw.Write([uint16]0) # Reserved
$bw.Write([uint16]1) # Type (1 = ICO)
$bw.Write([uint16]$sizes.Count) # Number of images

$offset = 6 + (16 * $sizes.Count)

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $sz = $sizes[$i]
    $data = $pngBytesList[$i]
    
    # ICONDIRENTRY
    $bw.Write([byte]$sz) # Width
    $bw.Write([byte]$sz) # Height
    $bw.Write([byte]0)   # ColorCount
    $bw.Write([byte]0)   # Reserved
    $bw.Write([uint16]1) # Planes
    $bw.Write([uint16]32)# BitCount
    $bw.Write([uint32]$data.Length) # BytesInRes
    $bw.Write([uint32]$offset)      # ImageOffset
    
    $offset += $data.Length
}

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $bw.Write($pngBytesList[$i])
}

$icoBytes = $icoMs.ToArray()
$bw.Dispose()
$icoMs.Dispose()

[System.IO.File]::WriteAllBytes("E:\My Tools\youtube-creator-toolkit-pro\src\app\favicon.ico", $icoBytes)
[System.IO.File]::WriteAllBytes("E:\My Tools\youtube-creator-toolkit-pro\public\favicon.ico", $icoBytes)
Write-Output "Created src\app\favicon.ico and public\favicon.ico ($($icoBytes.Length) bytes)"

# 4. Generate SVG Icon
$svgContent = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="28" fill="url(#redGradient)" />
  <polygon points="38,28 74,50 38,72" fill="#ffffff" />
</svg>
'@

[System.IO.File]::WriteAllText("E:\My Tools\youtube-creator-toolkit-pro\public\icon.svg", $svgContent)
[System.IO.File]::WriteAllText("E:\My Tools\youtube-creator-toolkit-pro\src\app\icon.svg", $svgContent)
Write-Output "Created public\icon.svg and src\app\icon.svg"
