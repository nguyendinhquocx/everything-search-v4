class UIManager {
    constructor() {
        this.isFullscreen = false;
    }

    showInIframe(url, query) {
        const container = document.getElementById('iframeContainer');
        const iframe = document.getElementById('everythingFrame');
        
        container.style.display = 'block';
        iframe.src = url;
        
        iframe.onload = () => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                const style = iframeDoc.createElement('style');
                style.textContent = `
                    h1 { display: none !important; }
                    input[type="text"] { display: none !important; }
                    form { display: none !important; }
                    body > * { display: none !important; }
                    table, .results { display: table !important; }
                    body > table:last-of-type { display: table !important; }
                    body > div:last-child { display: block !important; }
                    body { padding: 10px !important; margin: 0 !important; }
                `;
                
                iframeDoc.head.appendChild(style);
            } catch (e) {
                console.log('Cannot inject CSS due to CORS restrictions');
            }
        };
    }

    closeIframe() {
        const container = document.getElementById('iframeContainer');
        const iframe = document.getElementById('everythingFrame');
        
        if (this.isFullscreen) {
            this.toggleFullscreen();
        }
        
        container.style.display = 'none';
        iframe.src = '';
        iframe.onload = null;
        
        window.searchManager.hasResults = false;
        window.searchManager.resetQuickFilter();
    }    toggleFullscreen() {
        const container = document.getElementById('iframeContainer');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // Check if iframe container is visible
        if (!container || container.style.display === 'none') {
            console.log('Cannot toggle fullscreen: iframe not visible');
            return;
        }
        
        const expandIcon = fullscreenBtn.querySelector('.expand-icon');
        const collapseIcon = fullscreenBtn.querySelector('.collapse-icon');
        
        if (!this.isFullscreen) {
            container.classList.add('fullscreen');
            document.body.classList.add('fullscreen-active');
            if (expandIcon) expandIcon.style.display = 'none';
            if (collapseIcon) collapseIcon.style.display = 'block';
            fullscreenBtn.title = 'Thoát toàn màn hình';
            this.isFullscreen = true;
            console.log('Entered fullscreen mode');
        } else {
            container.classList.remove('fullscreen');
            document.body.classList.remove('fullscreen-active');
            if (expandIcon) expandIcon.style.display = 'block';
            if (collapseIcon) collapseIcon.style.display = 'none';
            fullscreenBtn.title = 'Toàn màn hình';
            this.isFullscreen = false;
            console.log('Exited fullscreen mode');
        }
    }

    updateQuickFilterUI(activeFilter) {
        // Reset all active states
        document.querySelectorAll('.quick-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (activeFilter) {
            let targetId = '';
            if (activeFilter.includes('jpg|png|gif')) targetId = 'quick-images';
            else if (activeFilter.includes('mp3|mp4|avi')) targetId = 'quick-media';
            else if (activeFilter.includes('doc|pdf|txt')) targetId = 'quick-documents';
            else if (activeFilter.includes('folder:')) targetId = 'quick-folders';
            
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            }
        }
    }

    resetQuickFilterUI() {
        document.querySelectorAll('.quick-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = message;
        
        const colors = {
            success: '#2563eb',
            error: '#dc2626',
            info: '#2563eb'
        };
        
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%) translateY(-100%)',
            padding: '8px 16px',
            color: colors[type] || colors.info,
            fontSize: '14px',
            fontWeight: '400',
            zIndex: '9999',
            transition: 'transform 0.3s ease',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2500);
    }
}