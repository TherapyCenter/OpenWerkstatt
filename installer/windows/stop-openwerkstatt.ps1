# Stop OpenWerkstatt (called by the installer before update/uninstall)
#
#   stop-openwerkstatt.ps1 -AppDir "C:\Program Files\OpenWerkstatt"
#
# First stop cleanly through the server (the database is closed properly), then kill
# any remaining processes from the program folder.
# Exit code: 0 = was not running, 1 = was running (locally), 2 = was running in network mode
param([Parameter(Mandatory = $true)][string]$AppDir, [int]$Port = 3700)
$ErrorActionPreference = 'SilentlyContinue'
$app = ([IO.Path]::GetFullPath($AppDir)).TrimEnd('\') + '\'

function Find-OpenWerkstatt {
  $all = @(Get-CimInstance Win32_Process)
  # console windows running "OpenWerkstatt starten.bat" from the program folder
  $shells = @($all | Where-Object { $_.Name -ieq 'cmd.exe' -and $_.CommandLine -and $_.CommandLine.IndexOf($app, [StringComparison]::OrdinalIgnoreCase) -ge 0 -and $_.CommandLine -match '\.bat' })
  $shellIds = @($shells | ForEach-Object { $_.ProcessId })
  # node.exe from the program folder or started from one of these windows
  $nodes = @($all | Where-Object { $_.Name -ieq 'node.exe' -and (($_.ExecutablePath -and $_.ExecutablePath.StartsWith($app, [StringComparison]::OrdinalIgnoreCase)) -or ($shellIds -contains $_.ParentProcessId)) })
  [pscustomobject]@{ Shells = $shells; Nodes = $nodes }
}

$k = Find-OpenWerkstatt
if (-not $k.Nodes.Count -and -not $k.Shells.Count) { exit 0 }
$network = [bool]($k.Shells | Where-Object { $_.CommandLine -match 'Netzwerk' })

# 1. stop cleanly
if ($k.Nodes.Count) {
  try { Invoke-WebRequest "http://127.0.0.1:$Port/api/system/beenden" -Method Post -Headers @{ 'X-OpenWerkstatt-Beenden' = '1' } -UseBasicParsing -TimeoutSec 5 | Out-Null } catch { }
  for ($i = 0; $i -lt 20; $i++) { Start-Sleep -Milliseconds 250; if (-not (Find-OpenWerkstatt).Nodes.Count) { break } }
}

# 2. kill what is left (server and console windows)
$k = Find-OpenWerkstatt
foreach ($p in @($k.Nodes) + @($k.Shells)) { Stop-Process -Id $p.ProcessId -Force }
for ($i = 0; $i -lt 20; $i++) { $r = Find-OpenWerkstatt; if (-not $r.Nodes.Count -and -not $r.Shells.Count) { break }; Start-Sleep -Milliseconds 250 }

if ($network) { exit 2 } else { exit 1 }
