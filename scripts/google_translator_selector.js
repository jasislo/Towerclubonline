/**
 * Google Translator Selector
 * This script initializes and handles the Google Translator widget
 */

// Initialize Google Translate Element
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,es,fr,ar,zh-CN,hi,pt,ru,ja,de',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// Add custom styling to Google Translate widget
function customizeGoogleTranslateWidget() {
  const translateContainer = document.getElementById('google_translate_element');
  if (!translateContainer) return;
  
  // Add custom classes if needed
  translateContainer.classList.add('towerclub-translate-widget');
  
  // Add observer for iframe changes
  const observer = new MutationObserver(function(mutations) {
    const gTransFrame = document.querySelector('.goog-te-menu-frame');
    if (gTransFrame) {
      try {
        const frameDocument = gTransFrame.contentDocument || gTransFrame.contentWindow.document;
        if (frameDocument) {
          // Add custom styling to the frame content
          const style = frameDocument.createElement('style');
          style.textContent = `
            .goog-te-menu2 {
              max-width: 100%;
              overflow: auto;
              padding: 0;
              border-radius: 4px !important;
              border-color: #ddd !important;
            }
            .goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div {
              color: #333 !important;
              font-family: 'Lexend', sans-serif;
            }
            .goog-te-menu2-item:hover div {
              background-color: #22c55e !important;
              color: white !important;
            }
          `;
          frameDocument.head.appendChild(style);
        }
      } catch (e) {
        console.error('Error styling Google Translate frame:', e);
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Check for Google Translate banner and adjust page layout if needed
function handleGoogleTranslateBanner() {
  const checkForBanner = setInterval(() => {
    const banner = document.querySelector('.skiptranslate');
    if (banner && banner.style.display !== 'none') {
      document.body.style.top = '40px';
    } else {
      document.body.style.top = '0';
    }
  }, 300);
  
  // Clean up interval after 5 seconds
  setTimeout(() => {
    clearInterval(checkForBanner);
  }, 5000);
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load Google Translate script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);
  
  // Initialize customizations
  setTimeout(customizeGoogleTranslateWidget, 1000);
  handleGoogleTranslateBanner();
});

// Export for module usage
export default {
  init: function() {
    // This function can be called explicitly if needed
    customizeGoogleTranslateWidget();
    handleGoogleTranslateBanner();
  }
};