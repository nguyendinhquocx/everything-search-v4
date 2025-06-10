class SearchManager {
    constructor() {
        this.currentQuery = '';
        this.currentFilter = '';
        this.hasResults = false;
    }

    cleanUserQuery(query) {
        let cleaned = query;
        
        // Remove various filter patterns
        cleaned = cleaned.replace(/\*\.[a-zA-Z0-9]+(\|\*\.[a-zA-Z0-9]+)*/g, '');
        cleaned = cleaned.replace(/size:[^\s]+/g, '');
        cleaned = cleaned.replace(/dm:[^\s]+/g, '');
        cleaned = cleaned.replace(/dc:[^\s]+/g, '');
        cleaned = cleaned.replace(/da:[^\s]+/g, '');
        cleaned = cleaned.replace(/folder:/g, '');
        cleaned = cleaned.replace(/[A-Z]:/g, '');
        cleaned = cleaned.replace(/\([^)]*\)/g, '');
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        return cleaned;
    }    performUnifiedSearch() {
        const query = document.getElementById('searchInput').value.trim();
        
        if (!query && !this.currentFilter) {
            window.uiManager.closeIframe();
            return;
        }
        
        this.currentQuery = this.cleanUserQuery(query);
        
        let searchParts = [];
        
        // Add drive filter
        const driveFilter = window.filterManager.getDriveFilter();
        if (driveFilter) {
            searchParts.push(driveFilter);
        }
        
        // Add date filter
        const dateFilter = window.filterManager.getDateFilter();
        if (dateFilter) {
            searchParts.push(dateFilter);
        }
        
        // Add current quick filter
        if (this.currentFilter) {
            searchParts.push(this.currentFilter);
        }
        
        // Add user search query
        if (this.currentQuery.trim()) {
            searchParts.push(this.currentQuery.trim());
        }
        
        const finalQuery = searchParts.join(' ');
        
        if (!finalQuery.trim()) {
            window.uiManager.closeIframe();
            return;
        }
        
        console.log('Final Search Query:', finalQuery);
        
        const searchUrl = `http://localhost:8080/?s=${encodeURIComponent(finalQuery)}`;
        window.uiManager.showInIframe(searchUrl, finalQuery);
        this.hasResults = true;
    }    applyQuickFilter(filter) {
        this.currentFilter = filter;
        window.uiManager.updateQuickFilterUI(filter);
        this.performUnifiedSearch();
    }

    resetQuickFilter() {
        this.currentFilter = '';
        window.uiManager.resetQuickFilterUI();
    }
}