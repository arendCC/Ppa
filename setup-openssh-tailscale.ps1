#Requires -RunAsAdministrator
<#
  Installiert und konfiguriert den OpenSSH-Server so, dass er nur aus dem
  Tailscale-Netz (100.64.0.0/10) erreichbar ist.

  Ausführen: PowerShell als Administrator öffnen, dann:
    cd "C:\Users\Admin\Desktop\Claude Projekte"
    .\setup-openssh-tailscale.ps1
#>

$ErrorActionPreference = 'Stop'

# 1. OpenSSH-Server-Feature installieren (falls nötig)
$capability = Get-WindowsCapability -Online -Name 'OpenSSH.Server~~~~0.0.1.0'
if ($capability.State -ne 'Installed') {
    Write-Host 'Installiere OpenSSH-Server...'
    Add-WindowsCapability -Online -Name 'OpenSSH.Server~~~~0.0.1.0' | Out-Null
} else {
    Write-Host 'OpenSSH-Server ist bereits installiert.'
}

# 2. sshd-Dienst aktivieren und starten
Set-Service -Name sshd -StartupType Automatic
Start-Service sshd

# 3. ssh-agent (optional, für Key-basierte Logins nützlich)
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent

# 4. Firewall-Regel auf das Tailscale-Netz (100.64.0.0/10) einschränken
$rule = Get-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -ErrorAction SilentlyContinue
if ($rule) {
    Set-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -RemoteAddress 100.64.0.0/10 -Enabled True
    Write-Host 'Bestehende Firewall-Regel auf Tailscale-Netz (100.64.0.0/10) eingeschränkt.'
} else {
    New-NetFirewallRule -Name 'OpenSSH-Server-Tailscale-In-TCP' `
        -DisplayName 'OpenSSH Server (Tailscale, Port 22)' `
        -Enabled True -Direction Inbound -Protocol TCP -Action Allow `
        -LocalPort 22 -RemoteAddress 100.64.0.0/10
    Write-Host 'Neue Firewall-Regel für Tailscale-Netz (100.64.0.0/10) erstellt.'
}

# 5. Standard-Shell für SSH-Sessions auf PowerShell setzen (optional, komfortabler)
New-ItemProperty -Path 'HKLM:\SOFTWARE\OpenSSH' -Name DefaultShell `
    -Value 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe' `
    -PropertyType String -Force | Out-Null

Write-Host ''
Write-Host '=== Fertig ==='
Write-Host 'sshd-Status:'
Get-Service sshd | Format-Table Name, Status, StartType -AutoSize
Write-Host ''
Write-Host 'Verbinden via Tailscale:'
Write-Host "  ssh $($env:USERNAME)@100.103.7.64"
