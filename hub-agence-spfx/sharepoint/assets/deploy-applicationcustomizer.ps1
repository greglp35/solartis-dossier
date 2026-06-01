# ============================================================
# deploy-applicationcustomizer.ps1
# Déploiement du Hub Agence SPFx sur un tenant Microsoft 365
# Prérequis : PnP PowerShell (Install-Module PnP.PowerShell)
# ============================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$TenantUrl,

    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $false)]
    [string]$PackagePath = "../../solution/hub-agence.sppkg"
)

# ---- Connexion ----
Write-Host "Connexion à $TenantUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url "$TenantUrl/sites/appcatalog" -Interactive

# ---- Upload dans l'App Catalog du tenant ----
Write-Host "Upload du package vers l'App Catalog..." -ForegroundColor Cyan
$app = Add-PnPApp -Path $PackagePath -Scope Tenant -Overwrite -Publish

Write-Host "Package déployé : $($app.Title) — ID : $($app.Id)" -ForegroundColor Green

# ---- Approbation des permissions Microsoft Graph ----
Write-Host "Approbation des permissions Graph API..." -ForegroundColor Cyan

$pendingRequests = Get-PnPTenantServicePrincipalPermissionRequests

foreach ($req in $pendingRequests) {
    Write-Host "  Approbation : $($req.Resource) - $($req.Scope)"
    Approve-PnPTenantServicePrincipalPermissionRequest -RequestId $req.Id -Force
}

# ---- Installation sur le site cible ----
Write-Host "Installation sur le site $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive
Install-PnPApp -Identity $app.Id -Scope Tenant

# ---- Création de l'arborescence SharePoint ----
Write-Host "Création de l'arborescence SharePoint..." -ForegroundColor Cyan

$folders = @(
    "Documents/Cockpit_Agence",
    "Documents/Cockpit_Agence/00_CONFIG",
    "Documents/Cockpit_Agence/01_ARCHIVE",
    "Documents/Cockpit_Agence/02_TRAVAIL"
)

foreach ($folder in $folders) {
    try {
        Resolve-PnPFolder -SiteRelativePath $folder | Out-Null
        Write-Host "  Dossier existant : $folder" -ForegroundColor Gray
    }
    catch {
        Add-PnPFolder -Name ($folder -split '/')[-1] `
                      -Folder ($folder -replace '/[^/]+$', '') | Out-Null
        Write-Host "  Dossier créé : $folder" -ForegroundColor Green
    }
}

# ---- Dépôt du fichier applications.json exemple ----
$applicationsJson = @'
[
  {
    "id": "app-001",
    "title": "Gestion des commandes",
    "description": "Suivi et gestion des commandes fournisseurs",
    "category": "Fournisseurs",
    "profile": "Chef agence",
    "path": "https://votre-tenant.sharepoint.com/sites/hub/commandes",
    "icon": "📦",
    "priority": 1,
    "status": "actif",
    "tags": ["commandes", "fournisseurs", "achat"],
    "owner": "chef.agence@domaine.fr"
  },
  {
    "id": "app-002",
    "title": "Tableau de bord stock",
    "description": "Vue en temps réel du stock dépôt",
    "category": "Stock",
    "profile": "Dépôt",
    "path": "https://votre-tenant.sharepoint.com/sites/hub/stock",
    "icon": "📊",
    "priority": 2,
    "status": "actif",
    "tags": ["stock", "inventaire", "dépôt"]
  }
]
'@

$tempFile = [System.IO.Path]::GetTempFileName() + ".json"
$applicationsJson | Out-File -FilePath $tempFile -Encoding UTF8

Add-PnPFile -Path $tempFile `
            -Folder "Documents/Cockpit_Agence/00_CONFIG" `
            -NewFileName "applications.json" | Out-Null

Remove-Item $tempFile -Force

Write-Host "Fichier applications.json déposé." -ForegroundColor Green
Write-Host ""
Write-Host "=== Déploiement terminé ===" -ForegroundColor Green
Write-Host "Le Hub Agence est prêt sur : $SiteUrl" -ForegroundColor Cyan
