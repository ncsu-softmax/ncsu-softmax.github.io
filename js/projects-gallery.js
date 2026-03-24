/**
 * Projects Gallery JavaScript
 * Handles rendering project cards that link to individual project pages
 */

$(document).ready(function() {
  console.log('Projects Gallery initialized');
  console.log('Projects data available:', window.projectsData && window.projectsData.length);
  
  renderProjects();
});

/**
 * Render project cards as links to detail pages
 */
function renderProjects() {
  const projectsData = window.projectsData || [];
  
  if (!projectsData || projectsData.length === 0) {
    $('#projects-container').html(
      '<div class="empty-state">' +
        '<div class="empty-state-icon">📭</div>' +
        '<p>No projects available yet.</p>' +
      '</div>'
    );
    return;
  }

  let html = '<div class="projects-grid">';
  
  projectsData.forEach(function(project) {
    const imageUrl = project.image || 'images/placeholder.jpg';
    html += `
      <a href="project-detail.html?id=${encodeURIComponent(project.id)}" class="project-card-link">
        <div class="project-card">
          <img src="${imageUrl}" alt="${project.title}" class="project-card-image" onerror="this.onerror=null; this.style.display='none';">
          <div class="project-card-body">
            <h3 class="project-card-title">${escapeHtml(project.title)}</h3>
            <p class="project-card-abstract">${escapeHtml(project.abstract)}</p>
            <div class="project-card-footer">
              <span class="project-card-btn">View Details</span>
            </div>
          </div>
        </div>
      </a>
    `;
  });
  
  html += '</div>';
  $('#projects-container').html(html);
  
  console.log('Rendered', projectsData.length, 'projects');
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
