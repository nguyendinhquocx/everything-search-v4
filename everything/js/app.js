// Main application entry point
class EverythingExplorer {
    constructor() {
        window.everythingApp = this;
        this.init();
    }

    init() {
        // Initialize all managers
        window.searchManager = new SearchManager();
        window.filterManager = new FilterManager();
        window.uiManager = new UIManager();
        window.urlConverter = new UrlConverter();
        window.eventManager = new EventManager();

        // Initialize UI
        this.setupInitialState();
        this.bindEvents();
    }

    setupInitialState() {
        document.getElementById('searchInput').focus();
        window.filterManager.initializeDateLabels();
        this.updateSearchTitle();
    }

    updateSearchTitle() {
        const searchInput = document.getElementById('searchInput');
        searchInput.title = 'Enter: Tìm kiếm hoặc Convert URL | Ctrl+Enter: Tìm Google';
    }    bindEvents() {
        // Search input event handling
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Enter key pressed, performing search');
                    window.searchManager.performUnifiedSearch();
                } else if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        window.open(googleUrl, '_blank');
                    }
                }
            });
        }

        // Quick filter buttons
        const quickImages = document.getElementById('quick-images');
        if (quickImages) {
            quickImages.addEventListener('click', () => {
                window.searchManager.applyQuickFilter('*.jpg|*.png|*.gif|*.webp');
            });
        }

        const quickMedia = document.getElementById('quick-media');
        if (quickMedia) {
            quickMedia.addEventListener('click', () => {
                window.searchManager.applyQuickFilter('*.mp3|*.mp4|*.avi|*.mkv');
            });
        }

        const quickDocuments = document.getElementById('quick-documents');
        if (quickDocuments) {
            quickDocuments.addEventListener('click', () => {
                window.searchManager.applyQuickFilter('*.doc|*.pdf|*.txt|*.docx');
            });
        }        const quickFolders = document.getElementById('quick-folders');
        if (quickFolders) {
            quickFolders.addEventListener('click', () => {
                window.searchManager.applyQuickFilter('folder:');
            });
        }

        // Date filter buttons
        document.querySelectorAll('.date-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.getAttribute('data-period');
                window.filterManager.selectQuickDate(period);
            });
        });

        // Auto-apply custom date range when dates are selected
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        if (startDateInput && endDateInput) {
            const handleDateChange = () => {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;
                
                console.log('Date changed:', { startDate, endDate });
                
                if (startDate && endDate) {
                    window.filterManager.applyCustomDate();
                }
            };
            
            startDateInput.addEventListener('change', handleDateChange);
            endDateInput.addEventListener('change', handleDateChange);
            startDateInput.addEventListener('input', handleDateChange);
            endDateInput.addEventListener('input', handleDateChange);
        }

        // Drive selector - fix event handling
        const driveOption = document.getElementById('driveOption');
        const driveCheckbox = document.getElementById('driveC');
        
        if (driveOption) {
            driveOption.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Drive option clicked');
                window.filterManager.toggleDrive();
            });
        }
        
        if (driveCheckbox) {
            driveCheckbox.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Drive checkbox clicked');
                window.filterManager.toggleDrive();
            });
        }

        // Iframe controls
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.uiManager.toggleFullscreen();
            });
        }

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.uiManager.closeIframe();
            });
        }

        // URL Converter modal (only if elements exist)
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                window.urlConverter.closeUrlConverter();
            });
        }

        const pasteBtn = document.getElementById('pasteBtn');
        if (pasteBtn) {
            pasteBtn.addEventListener('click', () => {
                window.urlConverter.pasteFromClipboard();
            });
        }
    }
}

// Initialize app when page loads
window.addEventListener('load', () => {
    new EverythingExplorer();
});

// Also try DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
    if (!window.everythingApp) {
        window.everythingApp = new EverythingExplorer();
    }
});