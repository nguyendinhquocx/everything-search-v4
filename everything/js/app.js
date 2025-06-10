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
    }

    bindEvents() {
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
        }

        const quickFolders = document.getElementById('quick-folders');
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

        // Apply custom date button
        const applyDateBtn = document.getElementById('applyDateBtn');
        if (applyDateBtn) {
            applyDateBtn.addEventListener('click', () => {
                window.filterManager.applyCustomDate();
            });
        }

        // Drive selector
        const driveOption = document.getElementById('driveOption');
        if (driveOption) {
            driveOption.addEventListener('click', () => {
                window.filterManager.toggleDrive();
            });
        }

        // Iframe controls
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                window.uiManager.toggleFullscreen();
            });
        }

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
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