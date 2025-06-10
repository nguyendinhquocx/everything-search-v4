class EventManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search input events
        const searchInput = document.getElementById('searchInput');
        
        searchInput.addEventListener('keypress', (e) => {
            this.handleSearchKeypress(e);
        });

        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e);
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });

        // Close modal on overlay click
        document.getElementById('urlConverterModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                window.urlConverter.closeUrlConverter();
            }
        });
    }

    handleSearchKeypress(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                this.searchGoogleWithCurrentInput();
            } else {
                e.preventDefault();
                this.handleSearchOrConvert(query);
            }
        }
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();
        
        if (query === '' && window.searchManager.hasResults) {
            setTimeout(() => {
                if (e.target.value.trim() === '') {
                    window.uiManager.closeIframe();
                    window.searchManager.currentQuery = '';
                    window.searchManager.currentFilter = '';
                    window.uiManager.resetQuickFilterUI();
                }
            }, 100);
        }
    }

    handleSearchOrConvert(query) {
        if (!query) {
            window.uiManager.closeIframe();
            return;
        }
        
        if (this.isLocalhostUrl(query)) {
            this.convertUrlDirectly(query);
        } else {
            window.searchManager.performUnifiedSearch();
        }
    }

    isLocalhostUrl(input) {
        return input.includes('localhost') || input.startsWith('local-file-open://');
    }

    convertUrlDirectly(url) {
        const localPath = window.urlConverter.convertUrlToLocalPath(url);
        
        if (localPath) {
            navigator.clipboard.writeText(localPath)
                .then(() => {
                    this.showConvertSuccess(localPath);
                    document.getElementById('searchInput').value = '';
                })
                .catch(err => {
                    console.error('Cannot copy to clipboard: ', err);
                    window.uiManager.showToast('❌ Lỗi khi copy vào clipboard', 'error');
                });
        }
    }

    showConvertSuccess(localPath) {
        window.uiManager.showToast('✓ Đã copy đường dẫn', 'success');
        
        const searchInput = document.getElementById('searchInput');
        const originalPlaceholder = searchInput.placeholder;
        
        searchInput.placeholder = '✓ Đã copy đường dẫn';
        searchInput.style.color = 'var(--success-color)';
        
        setTimeout(() => {
            searchInput.placeholder = originalPlaceholder;
            searchInput.style.color = '';
        }, 2000);
    }

    searchGoogleWithCurrentInput() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (query) {
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(googleUrl, '_blank');
        } else {
            window.open('https://www.google.com', '_blank');
        }
    }

    handleGlobalKeydown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        if (e.key === 'F11' || (window.searchManager.hasResults && e.key === 'f')) {
            e.preventDefault();
            if (window.searchManager.hasResults) {
                window.uiManager.toggleFullscreen();
            }
        }
        
        if (e.key === 'Escape') {
            if (document.getElementById('urlConverterModal').classList.contains('open')) {
                window.urlConverter.closeUrlConverter();
            } else if (window.uiManager.isFullscreen) {
                window.uiManager.toggleFullscreen();
            } else if (window.searchManager.hasResults) {
                window.uiManager.closeIframe();
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            window.urlConverter.openUrlConverter();
        }
    }
}