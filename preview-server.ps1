# LEVEL 0 사이트 미리보기 서버
# "미리보기.bat"을 더블클릭하면 이 파일이 실행됩니다. (Python 등 별도 설치 필요 없음)
# 창을 닫으면 미리보기가 끝납니다.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.htm' = 'text/html; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.txt' = 'text/plain; charset=utf-8'; '.md' = 'text/plain; charset=utf-8'
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.gif' = 'image/gif'
  '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'; '.webp' = 'image/webp'
  '.wasm' = 'application/wasm'; '.data' = 'application/octet-stream'; '.unityweb' = 'application/octet-stream'
  '.mp3' = 'audio/mpeg'; '.ogg' = 'audio/ogg'; '.wav' = 'audio/wav'; '.mp4' = 'video/mp4'; '.webm' = 'video/webm'
  '.woff' = 'font/woff'; '.woff2' = 'font/woff2'; '.ttf' = 'font/ttf'; '.pck' = 'application/octet-stream'
}

# 비어 있는 포트 찾기 (8000번부터)
$listener = $null
$port = 0
foreach ($p in 8000..8020) {
  try {
    $l = New-Object System.Net.HttpListener
    $l.Prefixes.Add("http://localhost:$p/")
    $l.Start()
    $listener = $l; $port = $p; break
  } catch { }
}
if (-not $listener) {
  Write-Host ""
  Write-Host "  [오류] 미리보기 서버를 시작하지 못했습니다. (8000~8020 포트가 모두 사용 중)" -ForegroundColor Red
  exit 1
}

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "  LEVEL 0 사이트 미리보기 중: $url" -ForegroundColor Green
Write-Host "  브라우저가 자동으로 열립니다. 끝내려면 이 창을 닫으세요."
Write-Host ""
try { Start-Process $url } catch { Write-Host "  브라우저에서 $url 을 직접 열어주세요." }

$rootFull = [System.IO.Path]::GetFullPath($root).TrimEnd('\', '/')

while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($rel.EndsWith('/')) { $rel += 'index.html' }
    $full = [System.IO.Path]::GetFullPath((Join-Path $rootFull ($rel.TrimStart('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar)))

    if (-not $full.StartsWith($rootFull) -or -not [System.IO.File]::Exists($full)) {
      if ([System.IO.Directory]::Exists($full) -and [System.IO.File]::Exists((Join-Path $full 'index.html'))) {
        $res.StatusCode = 301
        $res.RedirectLocation = $ctx.Request.Url.AbsolutePath + '/'
      } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host "  404  $rel" -ForegroundColor DarkYellow
      }
    } else {
      $name = [System.IO.Path]::GetFileName($full).ToLower()
      # Unity 압축 빌드(.gz / .br)도 지원
      if ($name.EndsWith('.gz')) { $res.AddHeader('Content-Encoding', 'gzip'); $name = $name.Substring(0, $name.Length - 3) }
      elseif ($name.EndsWith('.br')) { $res.AddHeader('Content-Encoding', 'br'); $name = $name.Substring(0, $name.Length - 3) }
      $ext = [System.IO.Path]::GetExtension($name)
      if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] } else { $res.ContentType = 'application/octet-stream' }
      $res.AddHeader('Cache-Control', 'no-cache')
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch {
    try { $res.StatusCode = 500 } catch { }
  } finally {
    try { $res.OutputStream.Close() } catch { }
  }
}
