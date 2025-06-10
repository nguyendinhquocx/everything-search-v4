class FilterManager {
    constructor() {
        this.selectedDateFilter = 'all';
        this.customDateRange = '';
        this.searchOnCDrive = false;
    }

    initializeDateLabels() {
        const today = new Date();
        
        document.getElementById('todayDate').textContent = this.formatDate(today);
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        document.getElementById('thisWeekRange').textContent = 
            `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        document.getElementById('thisMonthRange').textContent = 
            `${this.formatDate(startOfMonth)} - ${this.formatDate(endOfMonth)}`;
    }

    formatDate(date) {
        return date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit'
        });
    }

    selectQuickDate(period) {
        this.selectedDateFilter = period;
        
        // Update active state
        document.querySelectorAll('.date-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        if (window.searchManager.hasResults) {
            window.searchManager.performUnifiedSearch();
        }
    }

    getDateFilter() {
        if (!this.selectedDateFilter || this.selectedDateFilter === 'all') {
            return '';
        }
        
        let dateValue = '';
        if (this.selectedDateFilter === 'custom') {
            dateValue = this.customDateRange;
        } else {
            const dateFilters = {
                'today': 'today',
                'thisweek': 'thisweek', 
                'thismonth': 'thismonth',
                'thisyear': 'thisyear'
            };
            dateValue = dateFilters[this.selectedDateFilter] || '';
        }
        
        if (!dateValue) return '';
        
        return `(dm:${dateValue}|dc:${dateValue}|da:${dateValue})`;
    }

    toggleDrive() {
        this.searchOnCDrive = !this.searchOnCDrive;
        
        const checkbox = document.getElementById('driveC');
        const driveOption = checkbox.closest('.drive-option');
        
        if (this.searchOnCDrive) {
            checkbox.classList.add('active');
            driveOption.classList.add('active');
        } else {
            checkbox.classList.remove('active');
            driveOption.classList.remove('active');
        }
        
        if (window.searchManager.hasResults) {
            window.searchManager.performUnifiedSearch();
        }
    }

    getDriveFilter() {
        return this.searchOnCDrive ? 'C:' : 'D:';
    }

    applyCustomDate() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            this.selectedDateFilter = 'custom';
            this.customDateRange = `${startDate}..${endDate}`;
            
            // Update display
            const displayText = `${this.formatInputDate(startDate)} - ${this.formatInputDate(endDate)}`;
            document.getElementById('customDateDisplay').textContent = displayText;
            
            // Update active state
            document.querySelectorAll('.date-option').forEach(option => {
                option.classList.remove('active');
            });
            document.querySelector('[data-period="custom"]').classList.add('active');
            
            if (window.searchManager.hasResults) {
                window.searchManager.performUnifiedSearch();
            }
        }
    }

    formatInputDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit',
            year: 'numeric'
        });
    }
}