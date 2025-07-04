---
title: Downloads
description: Download Snowflake for your operating system
---

# Downloads

Snowflake is available for Windows, macOS, and Linux. Choose the version for your operating system.

<div class="downloads-container">
  <div class="download-hero">
    <h2>Download Snowflake</h2>
    <p>Book manager for writers. Free and open source.</p>
  </div>

  <div class="download-buttons">
    <div class="download-card primary">
      <div class="download-icon">🪟</div>
      <h3>Windows</h3>
      <p>Windows 10 or newer</p>
      <div class="download-actions">
        <a href="#" class="btn btn-primary" id="download-windows">
          Download for Windows
        </a>
        <div class="download-options">
          <a href="#" class="download-option" data-platform="windows-msi">MSI Installer</a>
          <a href="#" class="download-option" data-platform="windows-exe">EXE Installer</a>
        </div>
      </div>
    </div>
    <!-- <div class="download-card">
      <div class="download-icon">🍎</div>
      <h3>macOS</h3>
      <p>macOS 10.15 or newer</p>
      <div class="download-actions">
        <a href="#" class="btn btn-secondary" id="download-mac">
          Download for macOS
        </a>
        <div class="download-options">
          <a href="#" class="download-option" data-platform="mac-dmg">DMG</a>
          <a href="#" class="download-option" data-platform="mac-app">APP</a>
        </div>
      </div>
    </div> -->
    <div class="download-card">
      <div class="download-icon">🐧</div>
      <h3>Linux</h3>
      <p>Ubuntu 20.04 or newer</p>
      <div class="download-actions">
        <a href="#" class="btn btn-secondary" id="download-linux">
          Download for Linux
        </a>
        <div class="download-options">
          <a href="#" class="download-option" data-platform="linux-deb">DEB</a>
          <a href="#" class="download-option" data-platform="linux-appimage">AppImage</a>
        </div>
      </div>
    </div>
  </div>
  
  <div class="system-requirements">
    <h3>System Requirements</h3>
    <div class="requirements-grid">
      <div class="requirement-item">
        <h4>Windows</h4>
        <ul>
          <li>Windows 10 or newer</li>
          <li>64-bit processor</li>
          <li>4 GB RAM</li>
          <li>100 MB free space</li>
        </ul>
      </div>
      <!-- <div class="requirement-item">
        <h4>macOS</h4>
        <ul>
          <li>macOS 10.15 (Catalina) or newer</li>
          <li>Intel or Apple Silicon</li>
          <li>4 GB RAM</li>
          <li>100 MB free space</li>
        </ul>
      </div> -->
      <div class="requirement-item">
        <h4>Linux</h4>
        <ul>
          <li>Ubuntu 20.04 or newer</li>
          <li>64-bit processor</li>
          <li>4 GB RAM</li>
          <li>100 MB free space</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="release-info">
    <div class="current-version">
      <h3>Current Version</h3>
      <div class="version-badge" id="current-version">
        <span class="version-number">Loading...</span>
        <span class="version-date"></span>
      </div>
    </div>
    <div class="release-notes">
      <h3>What's New</h3>
      <div class="release-content" id="release-notes">
        <p>Loading release information...</p>
      </div>
    </div>
  </div>

  <div class="all-releases">
    <h3>All Releases</h3>
    <div class="releases-list" id="releases-list">
      <div class="loading">Loading releases...</div>
    </div>
  </div>

  
</div>

<script>
const GITHUB_API_URL = 'https://api.github.com/repos/ikloster03/snowflake-desktop';

async function fetchLatestRelease() {
  try {
    const response = await fetch(`${GITHUB_API_URL}/releases/latest`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const release = await response.json();
    return release;
  } catch (error) {
    console.error('Error loading latest release:', error);
    return null;
  }
}

async function fetchAllReleases() {
  try {
    const response = await fetch(`${GITHUB_API_URL}/releases`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const releases = await response.json();
    return releases;
  } catch (error) {
    console.error('Error loading all releases:', error);
    return [];
  }
}

function getAssetByPlatform(assets, platform) {
  const platformMap = {
    'windows-msi': /\.msi$/i,
    'windows-exe': /\.exe$/i,
    'mac-dmg': /\.dmg$/i,
    'mac-app': /\.app\.tar\.gz$/i,
    'linux-deb': /\.deb$/i,
    'linux-appimage': /\.AppImage$/i
  };
  
  const pattern = platformMap[platform];
  if (!pattern) return null;
  
  return assets.find(asset => pattern.test(asset.name));
}

function getPrimaryAssetByPlatform(assets, platform) {
  const platformMap = {
    'windows': [/\.msi$/i, /\.exe$/i],
    'mac': [/\.dmg$/i, /\.app\.tar\.gz$/i],
    'linux': [/\.deb$/i, /\.AppImage$/i]
  };
  
  const patterns = platformMap[platform];
  if (!patterns) return null;
  
  for (const pattern of patterns) {
    const asset = assets.find(asset => pattern.test(asset.name));
    if (asset) return asset;
  }
  
  return null;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function updateDownloadPage() {
  try {
    const latestRelease = await fetchLatestRelease();
    const allReleases = await fetchAllReleases();
    
    if (latestRelease) {
      // Update current version info
      const versionElement = document.getElementById('current-version');
      if (versionElement) {
        versionElement.innerHTML = `
          <span class="version-number">${latestRelease.tag_name}</span>
          <span class="version-date">${formatDate(latestRelease.published_at)}</span>
        `;
      }
      
      // Update release notes
      const releaseNotesElement = document.getElementById('release-notes');
      if (releaseNotesElement) {
        const releaseBody = latestRelease.body || 'Release information not available';
        releaseNotesElement.innerHTML = `<div class="release-body">${releaseBody}</div>`;
      }
      
      // Update download links
      const assets = latestRelease.assets || [];
      
      // Primary download buttons
      const windowsBtn = document.getElementById('download-windows');
      const macBtn = document.getElementById('download-mac');
      const linuxBtn = document.getElementById('download-linux');
      
      const windowsAsset = getPrimaryAssetByPlatform(assets, 'windows');
      const macAsset = getPrimaryAssetByPlatform(assets, 'mac');
      const linuxAsset = getPrimaryAssetByPlatform(assets, 'linux');
      
      if (windowsAsset && windowsBtn) {
        windowsBtn.href = windowsAsset.browser_download_url;
        windowsBtn.style.display = 'inline-block';
      }
      if (macAsset && macBtn) {
        macBtn.href = macAsset.browser_download_url;
        macBtn.style.display = 'inline-block';
      }
      if (linuxAsset && linuxBtn) {
        linuxBtn.href = linuxAsset.browser_download_url;
        linuxBtn.style.display = 'inline-block';
      }
      
      // Additional download options
      document.querySelectorAll('.download-option').forEach(option => {
        const platform = option.getAttribute('data-platform');
        const asset = getAssetByPlatform(assets, platform);
        if (asset) {
          option.href = asset.browser_download_url;
          option.innerHTML = `${asset.name} (${formatFileSize(asset.size)})`;
          option.style.display = 'block';
        } else {
          option.style.display = 'none';
        }
      });
    }
    
    // Update all releases list
    const releasesListElement = document.getElementById('releases-list');
    if (releasesListElement) {
      // Remove current release from all releases list
      const filteredReleases = allReleases.filter(release => 
        !latestRelease || release.tag_name !== latestRelease.tag_name
      );
      
      if (filteredReleases.length > 0) {
        releasesListElement.innerHTML = filteredReleases.map(release => `
          <div class="release-item">
            <div class="release-header">
              <h4>${release.tag_name}${release.prerelease ? ' (Pre-release)' : ''}</h4>
              <span class="release-date">${formatDate(release.published_at)}</span>
            </div>
            ${release.body ? `<div class="release-description">${release.body}</div>` : ''}
            <div class="release-assets">
              ${release.assets
                .filter(asset => !asset.name.endsWith('.sig') && asset.name !== 'latest.json')
                .map(asset => `
                  <a href="${asset.browser_download_url}" class="asset-link" download>
                    ${asset.name} (${formatFileSize(asset.size)})
                  </a>
                `).join('')}
            </div>
          </div>
        `).join('');
      } else {
        releasesListElement.innerHTML = '<p>No previous releases found</p>';
      }
    }
  } catch (error) {
    console.error('Error in updateDownloadPage:', error);
  }
}

// Launch function on page load
document.addEventListener('DOMContentLoaded', updateDownloadPage);
window.addEventListener('load', updateDownloadPage);

if (document.readyState !== 'loading') {
  updateDownloadPage();
}
</script>

<style>
.downloads-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.download-hero {
  text-align: center;
  padding: 3rem 0;
}

.download-hero h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.download-hero p {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

.download-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.download-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.download-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(var(--vp-c-brand-rgb), 0.05));
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.download-card:hover::before {
  opacity: 1;
}

.download-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-light);
}

.download-card.primary {
  border-color: var(--vp-c-brand);
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-brand-softer));
  box-shadow: 0 4px 20px rgba(var(--vp-c-brand-rgb), 0.2);
}

.download-card.primary:hover {
  box-shadow: 0 12px 40px rgba(var(--vp-c-brand-rgb), 0.3);
}

.download-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.download-card h3 {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.download-card p {
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.download-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.btn {
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none !important;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: inline-block;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: inherit;
}

.btn:focus,
.btn:active,
.btn:visited {
  text-decoration: none !important;
  color: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-dark));
  color: white !important;
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 15px rgba(var(--vp-c-brand-rgb), 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-light), var(--vp-c-brand));
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(var(--vp-c-brand-rgb), 0.4);
  color: white !important;
}

.btn-primary:focus,
.btn-primary:active,
.btn-primary:visited {
  color: white !important;
}

.btn-secondary {
  background: linear-gradient(135deg, transparent, rgba(var(--vp-c-brand-rgb), 0.1));
  color: var(--vp-c-brand) !important;
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 15px rgba(var(--vp-c-brand-rgb), 0.2);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-brand-lighter));
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(var(--vp-c-brand-rgb), 0.3);
  color: var(--vp-c-brand) !important;
}

.btn-secondary:focus,
.btn-secondary:active,
.btn-secondary:visited {
  color: var(--vp-c-brand) !important;
}

.download-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.download-option {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.download-option:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.release-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin: 3rem 0;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.current-version h3,
.release-notes h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.version-badge {
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand);
}

.version-number {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-brand);
}

.version-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.release-content {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.release-body {
  white-space: pre-wrap;
}

.all-releases {
  margin: 3rem 0;
}

.all-releases h3 {
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.releases-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.release-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
}

.release-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.release-header h4 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.release-date {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.release-assets {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.asset-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-brand);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.asset-link:hover {
  background: var(--vp-c-brand-soft);
}

.system-requirements {
  margin: 3rem 0;
}

.system-requirements h3 {
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.requirement-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
}

.requirement-item h4 {
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.requirement-item ul {
  list-style: none;
  padding: 0;
}

.requirement-item li {
  color: var(--vp-c-text-2);
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.requirement-item li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--vp-c-brand);
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .download-buttons {
    grid-template-columns: 1fr;
  }
  
  .release-info {
    grid-template-columns: 1fr;
  }
  
  .release-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .release-assets {
    flex-direction: column;
  }
  
  .requirements-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
