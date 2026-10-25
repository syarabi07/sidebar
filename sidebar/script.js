const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

// Check if screen is mobile
const isMobile = () => window.innerWidth <= 800

// Restore sidebar closed state on page load (desktop only)
if (!isMobile() && localStorage.getItem('sidebarState') === 'closed') {
  sidebar.classList.add('close')
  toggleButton.classList.add('rotate')
}

// Toggle sidebar open/close
function toogleSidebar() {
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  // Save sidebar state to localStorage (desktop only)
  if (!isMobile()) {
    localStorage.setItem('sidebarState', sidebar.classList.contains('close') ? 'closed' : 'open')
  }

  closeAllSubMenus()
}

// Toggle sub-menu open/close
function toogleSubMenu(button) {
  // Close other open sub-menus before opening a new one
  if (!button.nextElementSibling.classList.contains('show')) closeAllSubMenus()

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')

  // If sidebar is closed, force it open when a sub-menu is opened
  if (sidebar.classList.contains('close')) {
    sidebar.classList.remove('close')
    toggleButton.classList.remove('rotate')
    if (!isMobile()) localStorage.setItem('sidebarState', 'open')
  }
}

// Close all open sub-menus
function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

// Track whether screen started above or below 800px
let wasAbove800 = !isMobile()

// Reset sidebar when user crosses the 800px breakpoint during resizing
window.addEventListener('resize', () => {
  const isNowAbove800 = !isMobile()

  if (wasAbove800 !== isNowAbove800) {
    sidebar.classList.remove('close')
    toggleButton.classList.remove('rotate')
    closeAllSubMenus()

    // Re-apply saved closed state if returning to desktop
    if (isNowAbove800 && localStorage.getItem('sidebarState') === 'closed') {
      sidebar.classList.add('close')
      toggleButton.classList.add('rotate')
    }

    wasAbove800 = isNowAbove800
  }
})

// On mobile, close sub-menus when tapping anywhere outside the sidebar
document.addEventListener('click', (e) => {
  if (isMobile() && !e.target.closest('#sidebar')) {
    closeAllSubMenus()
  }
})