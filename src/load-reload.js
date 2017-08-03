document.addEventListener('DOMContentLoaded', () => {
  if (Array.from(document.scripts).find(script => script.src.endsWith('/reload/reload.js')) === undefined) {
    const script = document.createElement('script')
    script.src = '/reload/reload.js'
    document.head.appendChild(script)
  }
})
