---
title: Downloads
description: Download Snowflake for your operating system
---

# Downloads

Download the latest version of Snowflake Desktop for your operating system.

<div class="download-section">
  <div class="latest-release">
    <h2>Latest Version</h2>
    <div class="release-info">
      <div class="version-info">
        <span class="version" id="latest-version">Loading...</span>
        <span class="release-date" id="latest-date"></span>
      </div>
      <div class="download-buttons">
        <a href="#" class="btn btn-primary" id="download-windows" style="display: none;">
          <i class="icon">💻</i>
          Windows
        </a>
        <a href="#" class="btn btn-primary" id="download-linux" style="display: none;">
          <i class="icon">🐧</i>
          Linux
        </a>
        <a href="#" class="btn btn-primary" id="download-macos" style="display: none;">
          <i class="icon">🍎</i>
          macOS
        </a>
      </div>
      <div class="additional-downloads">
        <div class="platform-group" id="windows-group" style="display: none;">
          <h4>Windows</h4>
          <div class="download-links">
            <a href="#" class="download-link" id="download-windows-msi" style="display: none;">MSI Installer</a>
          </div>
        </div>
        <div class="platform-group" id="linux-group" style="display: none;">
          <h4>Linux</h4>
          <div class="download-links">
            <a href="#" class="download-link" id="download-linux-deb" style="display: none;">DEB Package</a>
            <a href="#" class="download-link" id="download-linux-rpm" style="display: none;">RPM Package</a>
          </div>
        </div>
      </div>
    </div>
    <div class="release-notes">
      <h3>What's New</h3>
      <div id="release-notes-content">Loading release information...</div>
    </div>
  </div>

  <div class="all-releases">
    <h2>All Releases</h2>
    <div id="all-releases-content">
      <p>Loading releases list...</p>
    </div>
  </div>
</div>

<script>
// Check if we're in the browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // GitHub API endpoints
  const GITHUB_API_BASE = 'https://api.github.com/repos/ikloster03/snowflake-desktop';
  const LATEST_RELEASE_URL = `${GITHUB_API_BASE}/releases/latest`;
  const ALL_RELEASES_URL = `${GITHUB_API_BASE}/releases`;

  // Function to fetch latest release
  async function fetchLatestRelease() {
    try {
      const response = await fetch(LATEST_RELEASE_URL);
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

  // Function to fetch all releases
  async function fetchAllReleases() {
    try {
      const response = await fetch(ALL_RELEASES_URL);
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

  // Function to find primary asset by platform
  function getPrimaryAssetByPlatform(assets, platform) {
    const patterns = {
      windows: [
        /\.exe$/i,
        /windows.*\.zip$/i,
        /win.*\.zip$/i,
        /\.msi$/i
      ],
      linux: [
        /\.AppImage$/i,
        /linux.*\.tar\.gz$/i,
        /\.deb$/i,
        /\.rpm$/i
      ],
      macos: [
        /\.dmg$/i,
        /darwin.*\.tar\.gz$/i,
        /macos.*\.zip$/i,
        /osx.*\.zip$/i
      ]
    };

    const platformPatterns = patterns[platform] || [];
    
    for (const pattern of platformPatterns) {
      const asset = assets.find(asset => 
        pattern.test(asset.name) && 
        !asset.name.endsWith('.sig') && 
        asset.name !== 'latest.json'
      );
      if (asset) return asset;
    }
    
    return null;
  }

  // Function to update download page
  async function updateDownloadPage() {
    try {
      const [latestRelease, allReleases] = await Promise.all([
        fetchLatestRelease(),
        fetchAllReleases()
      ]);

      if (latestRelease) {
        // Update latest version info
        const versionElement = document.getElementById('latest-version');
        const dateElement = document.getElementById('latest-date');
        
        if (versionElement) {
          versionElement.textContent = latestRelease.tag_name;
        }
        
        if (dateElement) {
          const releaseDate = new Date(latestRelease.published_at);
          dateElement.textContent = releaseDate.toLocaleDateString('en-US');
        }

        // Update download buttons
        const platforms = ['windows', 'linux', 'macos'];
        platforms.forEach(platform => {
          const button = document.getElementById(`download-${platform}`);
          if (button) {
            const asset = getPrimaryAssetByPlatform(latestRelease.assets, platform);
            if (asset) {
              button.href = asset.browser_download_url;
              button.style.display = 'inline-flex';
              button.setAttribute('download', '');
            }
          }
        });

        // Update additional download links
        const additionalDownloads = {
          'windows-msi': /\.msi$/i,
          'linux-deb': /\.deb$/i,
          'linux-rpm': /\.rpm$/i
        };

        Object.entries(additionalDownloads).forEach(([id, pattern]) => {
          const link = document.getElementById(`download-${id}`);
          if (link) {
            const asset = latestRelease.assets.find(asset => 
              pattern.test(asset.name) && 
              !asset.name.endsWith('.sig') && 
              asset.name !== 'latest.json'
            );
            if (asset) {
              link.href = asset.browser_download_url;
              link.style.display = 'inline-flex';
              link.setAttribute('download', '');
            }
          }
        });

        // Show groups with additional links
        const windowsGroup = document.getElementById('windows-group');
        const linuxGroup = document.getElementById('linux-group');
        
        if (windowsGroup && document.getElementById('download-windows-msi').style.display !== 'none') {
          windowsGroup.style.display = 'block';
        }
        
        if (linuxGroup && (document.getElementById('download-linux-deb').style.display !== 'none' || 
                          document.getElementById('download-linux-rpm').style.display !== 'none')) {
          linuxGroup.style.display = 'block';
        }

        // Update release notes
        const notesElement = document.getElementById('release-notes-content');
        if (notesElement) {
          if (latestRelease.body && latestRelease.body.trim()) {
            notesElement.innerHTML = latestRelease.body
              .replace(/\n/g, '<br>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>');
          } else {
            notesElement.innerHTML = '<p>Release information not available.</p>';
          }
        }
      }

      // Update all releases list
      const allReleasesElement = document.getElementById('all-releases-content');
      if (allReleasesElement && allReleases.length > 0) {
        // Filter out current release from all releases list
        const filteredReleases = allReleases.filter(release => 
          !latestRelease || release.id !== latestRelease.id
        );
        
        if (filteredReleases.length > 0) {
          allReleasesElement.innerHTML = filteredReleases.map(release => {
            const releaseDate = new Date(release.published_at);
            const assets = release.assets.filter(asset => 
              !asset.name.endsWith('.sig') && asset.name !== 'latest.json'
            );
            
            const downloadLinks = assets.map(asset => 
              `<a href="${asset.browser_download_url}" class="download-link" download>${asset.name}</a>`
            ).join('');

            const preReleaseNote = release.prerelease ? '<span class="pre-release">Pre-release</span>' : '';

            return `
              <div class="release-item">
                <div class="release-header">
                  <h3>${release.tag_name} ${preReleaseNote}</h3>
                  <span class="release-date">${releaseDate.toLocaleDateString('en-US')}</span>
                </div>
                <div class="release-body">
                  ${release.body ? release.body.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : 'No description available'}
                </div>
                <div class="release-downloads">
                  ${downloadLinks}
                </div>
              </div>
            `;
          }).join('');
        } else {
          allReleasesElement.innerHTML = '<p>No previous releases found.</p>';
        }
      }
    } catch (error) {
      console.error('Error updating download page:', error);
    }
  }

  // Run page update after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDownloadPage);
  } else {
    updateDownloadPage();
  }

  // Additional check for cases when DOMContentLoaded has already passed
  window.addEventListener('load', function() {
    if (document.getElementById('latest-version') && document.getElementById('latest-version').textContent === 'Loading...') {
      updateDownloadPage();
    }
  });
}
</script>

<style>
.download-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.latest-release {
  word-break: break-word;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid var(--vp-c-divider);
}

.latest-release h2 {
  margin-top: 0;
  color: var(--vp-c-text-1);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.release-info {
  margin-bottom: 2rem;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.version {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand);
}

.release-date {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none !important;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 1;
}

.btn:hover {
  text-decoration: none !important;
}

.btn:focus,
.btn:active,
.btn:visited {
  text-decoration: none !important;
}

.btn * {
  position: relative;
  z-index: 2;
}

.btn-primary {
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-darker));
  color: white !important;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--vp-c-brand-darker), var(--vp-c-brand));
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary:focus,
.btn-primary:active,
.btn-primary:visited {
  color: white !important;
}

.btn-secondary {
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  color: var(--vp-c-text-1) !important;
  border: 2px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, var(--vp-c-bg), var(--vp-c-bg-soft));
  border-color: var(--vp-c-brand);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn-secondary:focus,
.btn-secondary:active,
.btn-secondary:visited {
  color: var(--vp-c-text-1) !important;
}

.icon {
  font-size: 1.2rem;
}

.release-notes {
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
}

.release-notes h3 {
  margin-top: 0;
  color: var(--vp-c-text-1);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.all-releases h2 {
  color: var(--vp-c-text-1);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.release-item {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--vp-c-divider);
}

.release-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.release-header h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 1.3rem;
}

.pre-release {
  background: #f59e0b;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.release-body {
  word-break: break-word;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.release-downloads {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.download-link {
  background: var(--vp-c-brand);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-decoration: none !important;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.download-link:hover {
  background: var(--vp-c-brand-darker);
  transform: translateY(-1px);
  text-decoration: none !important;
}

.download-link:focus,
.download-link:active,
.download-link:visited {
  text-decoration: none !important;
}

@media (max-width: 768px) {
  .download-section {
    padding: 0;
  }
  
  .latest-release {
    padding: 0.5rem;
  }
  
  .version-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .download-buttons {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
  
  .release-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .release-item {
    padding: 0.5rem;
  }
  
  .release-downloads {
    flex-direction: column;
  }
}

.additional-downloads {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.platform-group {
  margin-bottom: 1.5rem;
}

.platform-group h4 {
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  font-weight: 600;
}

.platform-group .download-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.platform-group .download-link {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1) !important;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none !important;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.platform-group .download-link:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
  text-decoration: none !important;
}

.platform-group .download-link:focus,
.platform-group .download-link:active,
.platform-group .download-link:visited {
  text-decoration: none !important;
}
</style> 
