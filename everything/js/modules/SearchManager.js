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
        
        console.log('=== performUnifiedSearch called ===');
        console.log('Raw query:', query);
        console.log('Current filter:', this.currentFilter);
        console.log('Has results:', this.hasResults);
        
        if (!query && !this.currentFilter) {
            console.log('No query and no filter, closing iframe');
            window.uiManager.closeIframe();
            return;
        }
        
        this.currentQuery = this.cleanUserQuery(query);
        console.log('Cleaned query:', this.currentQuery);
        
        let searchParts = [];
        
        // Add drive filter
        const driveFilter = window.filterManager.getDriveFilter();
        if (driveFilter) {
            searchParts.push(driveFilter);
            console.log('Added drive filter:', driveFilter);
        }
        
        // Add date filter
        const dateFilter = window.filterManager.getDateFilter();
        if (dateFilter) {
            searchParts.push(dateFilter);
            console.log('Added date filter:', dateFilter);
        }
        
        // Add current quick filter
        if (this.currentFilter) {
            searchParts.push(this.currentFilter);
            console.log('Added quick filter:', this.currentFilter);
        }
        
        // Add user search query
        if (this.currentQuery.trim()) {
            searchParts.push(this.currentQuery.trim());
            console.log('Added user query:', this.currentQuery.trim());
        }
        
        const finalQuery = searchParts.join(' ');
        console.log('Final search query:', finalQuery);
        
        if (!finalQuery.trim()) {
            console.log('Final query is empty, closing iframe');
            window.uiManager.closeIframe();
            return;
        }
        
        const searchUrl = `http://localhost:8080/?s=${encodeURIComponent(finalQuery)}`;
        console.log('Search URL:', searchUrl);
        
        window.uiManager.showInIframe(searchUrl, finalQuery);
        this.hasResults = true;
        
        console.log('=== performUnifiedSearch completed ===');
    }applyQuickFilter(filter) {
        this.currentFilter = filter;
        window.uiManager.updateQuickFilterUI(filter);
        this.performUnifiedSearch();
    }

    resetQuickFilter() {
        this.currentFilter = '';
        window.uiManager.resetQuickFilterUI();
    }
}