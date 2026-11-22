$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$records = Get-Content -Raw -Encoding UTF8 '.\HEYGEN_350_CORRECTED_RECORDINGS.json' | ConvertFrom-Json
if (@($records).Count -ne 350) { throw 'Expected 350 recordings' }
$client = New-Object Net.WebClient
$client.Headers.Add('User-Agent','Mozilla/5.0')
$errors = New-Object System.Collections.ArrayList
$i=0
foreach ($rec in $records) {
  $i++
  $rel=[string]$rec.target_file
  if ($rel -notmatch '^(narr|narr_f|audio)/[A-Za-z0-9_-]+\.mp3$') { throw "Invalid recording target: $rel" }
  $url=[string]$rec.heygen_url
  if (!$url.StartsWith('https://resource2.heygen.ai/')) { throw "Invalid source: $rel" }
  $target=Join-Path $PSScriptRoot ($rel.Replace('/','\'))
  $dir=Split-Path -Parent $target
  if (!(Test-Path $dir)) { New-Item -Path $dir -ItemType Directory -Force | Out-Null }
  $valid=(Test-Path $target) -and ((Get-Item $target).Length -gt 500)
  if (!$valid) {
    for($attempt=1; $attempt -le 3 -and !$valid; $attempt++) {
      $tmp="$target.part"
      try {
        $client.DownloadFile($url,$tmp)
        $size=(Get-Item $tmp).Length
        if ($size -lt 500) { throw "File too short: $size bytes" }
        $bin=[System.IO.File]::ReadAllBytes($tmp)
        $id3=($bin[0] -eq 73 -and $bin[1] -eq 68 -and $bin[2] -eq 51)
        $frame=($bin[0] -eq 255 -and (($bin[1] -band 224) -eq 224))
        if (!($id3 -or $frame)) { throw 'Not MP3 audio data' }
        Move-Item $tmp $target -Force
        $valid=$true
      } catch {
        Remove-Item -Force $tmp -ErrorAction SilentlyContinue
        if ($attempt -eq 3) { [void]$errors.Add("$rel : $($_.Exception.Message)") }
        else { Start-Sleep -Seconds $attempt }
      }
    }
  }
  if (($i % 20) -eq 0 -or $i -eq 350) { Write-Host "Processed $i / 350 recordings" }
}
$client.Dispose()
if ($errors.Count -gt 0) {
  Write-Host "Failed: $($errors.Count) recordings; run again to resume." -ForegroundColor Red
  $errors | Select-Object -First 20 | ForEach-Object { Write-Host $_ }
  exit 1
}
$index=Join-Path $PSScriptRoot 'index.html'
$html=[System.IO.File]::ReadAllText($index,[System.Text.Encoding]::UTF8)
if (!$html.Contains('window.MT_NEW_AUDIO_READY = false;') -and !$html.Contains('window.MT_NEW_AUDIO_READY = true;')) { throw 'Unsupported application version' }
$html=$html.Replace('window.MT_NEW_AUDIO_READY = false;','window.MT_NEW_AUDIO_READY = true;')
[System.IO.File]::WriteAllText($index,$html,([System.Text.UTF8Encoding]::new($false)))
$path=Join-Path $PSScriptRoot 'files.json'
$meta=Get-Content -Raw -Encoding UTF8 $path | ConvertFrom-Json
$files=@{}
foreach($entry in $meta.files) { $files[[string]$entry[0]]=[long]$entry[1] }
foreach($rec in $records) {
  $name=[string]$rec.target_file
  $filename=Join-Path $PSScriptRoot ($name.Replace('/','\'))
  $files[$name]=[long](Get-Item $filename).Length
}
$list=New-Object System.Collections.ArrayList
foreach ($name in ($files.Keys | Sort-Object)) { [void]$list.Add(@($name, [long]$files[$name])) }
$meta.files=@($list)
$sum=[long]0
foreach ($size in $files.Values) { $sum += [long]$size }
$meta.bytes=$sum; $meta.v='v1.2.18-voices-installed-20261122'
$meta | ConvertTo-Json -Depth 8 -Compress | Set-Content -Encoding UTF8 $path
$sw=Join-Path $PSScriptRoot 'sw.js'
$swtext=[System.IO.File]::ReadAllText($sw,[System.Text.Encoding]::UTF8).Replace('v1218-onefile','v1218-voices-ready')
[System.IO.File]::WriteAllText($sw,$swtext,([System.Text.UTF8Encoding]::new($false)))
'All 350 corrected HeyGen voice recordings installed.' | Set-Content -Encoding UTF8 'UPDATED_VOICES_INSTALLED.txt'
Write-Host 'SUCCESS: all 350 recordings installed in this one app.' -ForegroundColor Green
exit 0
