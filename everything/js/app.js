// Main application entry point
class EverythingExplorer {
    constructor() {
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
        document.getElementById('quick-images').addEventListener('click', () => {
            window.searchManager.applyQuickFilter('*.jpg|*.png|*.gif|*.webp');
        });

        document.getElementById('quick-media').addEventListener('click', () => {
            window.searchManager.applyQuickFilter('*.mp3|*.mp4|*.avi|*.mkv');
        });

        document.getElementById('quick-documents').addEventListener('click', () => {
            window.searchManager.applyQuickFilter('*.doc|*.pdf|*.txt|*.docx');
        });

        document.getElementById('quick-folders').addEventListener('click', () => {
            window.searchManager.applyQuickFilter('folder:');
        });

        // Date filter buttons
        document.querySelectorAll('.date-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.getAttribute('data-period');
                window.filterManager.selectQuickDate(period);
            });
        });

        // Apply custom date button
        document.getElementById('applyDateBtn').addEventListener('click', () => {
            window.filterManager.applyCustomDate();
        });

        // Drive selector
        document.getElementById('driveOption').addEventListener('click', () => {
            window.filterManager.toggleDrive();
        });

        // Iframe controls
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            window.uiManager.toggleFullscreen();
        });

        document.getElementById('closeBtn').addEventListener('click', () => {
            window.uiManager.closeIframe();
        });

        // URL Converter modal
        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            window.urlConverter.closeUrlConverter();
        });

        document.getElementById('pasteBtn').addEventListener('click', () => {
            window.urlConverter.pasteFromClipboard();
        });
    }
}

// Initialize app when page loads
window.addEventListener('load', () => {
    new EverythingExplorer();
});