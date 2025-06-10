class UrlConverter {
    constructor() {
        // Setup sẽ được gọi sau khi DOM loaded
    }

    setupEventListeners() {
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.addEventListener('input', (e) => {
                this.handleUrlInput(e.target.value.trim());
            });

            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.convertAndCopyUrl();
                }
            });
        }
    }

    handleUrlInput(url) {
        const pathOutput = document.getElementById('pathOutput');
        
        if (url) {
            const localPath = this.convertUrlToLocalPath(url);
            pathOutput.value = localPath;
            this.updateCopyStatus('Press Enter', false);
        } else {
            pathOutput.value = '';
            this.resetCopyStatus();
        }
    }

    convertUrlToLocalPath(url) {
        let result = url;
        
        if (url.startsWith('local-file-open://')) {
            result = decodeURIComponent(url.replace('local-file-open://', ''));
        } else if (url.includes('localhost') && url.includes('%3A')) {
            const urlParts = url.split('localhost:');
            if (urlParts.length > 1) {
                const portAndPath = urlParts[1];
                const pathStart = portAndPath.indexOf('/', 0);
                if (pathStart !== -1) {
                    const pathPart = portAndPath.substring(pathStart + 1);
                    result = decodeURIComponent(pathPart.replace('%3A', ':'));
                }
            }
        }
        
        return result.replace(/\//g, '\\');
    }

    convertAndCopyUrl() {
        const urlInput = document.getElementById('urlInput');
        const pathOutput = document.getElementById('pathOutput');
        const url = urlInput.value.trim();
        
        if (!url) {
            pathOutput.value = '';
            this.resetCopyStatus();
            return;
        }
        
        const localPath = this.convertUrlToLocalPath(url);
        pathOutput.value = localPath;
        
        if (localPath) {
            navigator.clipboard.writeText(localPath)
                .then(() => {
                    this.updateCopyStatus('Copied!', true);
                    setTimeout(() => {
                        this.closeUrlConverter();
                    }, 1500);
                })
                .catch(err => {
                    console.error('Cannot copy to clipboard: ', err);
                    this.updateCopyStatus('Copy Failed', false);
                });
        }
    }

    openUrlConverter() {
        document.getElementById('urlConverterModal').classList.add('open');
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.focus();
        }
        this.resetCopyStatus();
        
        // Setup event listeners when modal opens
        this.setupEventListeners();
    }

    closeUrlConverter() {
        document.getElementById('urlConverterModal').classList.remove('open');
        document.getElementById('urlInput').value = '';
        document.getElementById('pathOutput').value = '';
        this.resetCopyStatus();
    }

    updateCopyStatus(text, isSuccess) {
        const copyStatus = document.getElementById('copyStatus');
        const statusText = copyStatus.querySelector('.status-text');
        const copyIcon = copyStatus.querySelector('.copy-icon');
        const checkIcon = copyStatus.querySelector('.check-icon');
        
        statusText.textContent = text;
        
        if (isSuccess) {
            copyStatus.classList.add('copied');
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'block';
        } else {
            copyStatus.classList.remove('copied');
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
        }
    }

    resetCopyStatus() {
        this.updateCopyStatus('Ready', false);
    }

    pasteFromClipboard() {
        navigator.clipboard.readText()
            .then(text => {
                document.getElementById('urlInput').value = text;
                this.convertAndCopyUrl();
            })
            .catch(err => {
                console.error('Cannot read clipboard: ', err);
                this.updateCopyStatus('Error', false);
            });
    }
}