class RecycleBin {
    constructor() {
        // array of deleted files with their details
        this.deletedFiles = [
            {
                name: "passwords.txt",
                dateDeleted: "today, 11:42 am",
                size: "4 kb",
                icon: "../assets/images/text-file-icon.png"
            },
            {
                name: "star-trek-fanfic.doc",
                dateDeleted: "3/1/2025, 9:30 am",
                size: "32 kb",
                icon: "../assets/images/doc-file-icon.png"
            },
            {
                name: "old photos",
                dateDeleted: "2/28/2025, 5:22 pm",
                size: "folder",
                icon: "../assets/images/folder-icon.png"
            },
            {
                name: "notes.txt",
                dateDeleted: "2/28/2025, 10:05 am",
                size: "2 kb",
                icon: "../assets/images/text-file-icon.png"
            },
            {
                name: "secret.xlsx",
                dateDeleted: "2/27/2025, 4:18 pm",
                size: "48 kb",
                icon: "../assets/images/excel-file-icon.png"
            },
            {
                name: "happybday.pptx",
                dateDeleted: "2/26/2025, 2:10 pm",
                size: "1.2 mb",
                icon: "../assets/images/powerpoint-file-icon.png"
            },
            {
                name: "msn_messenger_emoticons.zip",
                dateDeleted: "2/25/2025, 3:22 pm",
                size: "1.5 mb",
                icon: "../assets/images/zip-file-icon.png"
            },
            {
                name: "emo_lyrics.doc",
                dateDeleted: "2/24/2025, 8:45 pm",
                size: "28 kb",
                icon: "../assets/images/doc-file-icon.png"
            },
            {
                name: "blog_backup.html",
                dateDeleted: "2/23/2025, 11:17 am",
                size: "56 kb",
                icon: "../assets/images/html-file-icon.png"
            },
            {
                name: "club_penguin_screenshots.png",
                dateDeleted: "2/22/2025, 7:40 pm",
                size: "340 kb",
                icon: "../assets/images/image-file-icon.png"
            },
            {
                name: "geocities_site_backup.7z",
                dateDeleted: "2/21/2025, 5:05 pm",
                size: "2.3 mb",
                icon: "../assets/images/zip-file-icon.png"
            },
            {
                name: "emo_hair_tutorial.avi",
                dateDeleted: "2/20/2025, 8:30 pm",
                size: "4.2 mb",
                icon: "../assets/images/video-file-icon.png"
            },
            {
                name: "games_saves.dat",
                dateDeleted: "2/19/2025, 1:15 pm",
                size: "256 kb",
                icon: "../assets/images/data-file-icon.png"
            },
            {
                name: "naruto_run_animation.gif",
                dateDeleted: "2/18/2025, 6:40 pm",
                size: "320 kb",
                icon: "../assets/images/image-file-icon.png"
            },
            {
                name: "dialup_isp_settings.txt",
                dateDeleted: "2/17/2025, 9:10 am",
                size: "3 kb",
                icon: "../assets/images/text-file-icon.png"
            },
            {
                name: "nyan_cat_loop.gif",
                dateDeleted: "2/16/2025, 4:20 pm",
                size: "680 kb",
                icon: "../assets/images/image-file-icon.png"
            },
            {
                name: "rickro8ll_prank.mp4",
                dateDeleted: "2/15/2025, 12:33 pm",
                size: "3.8 mb",
                icon: "../assets/images/video-file-icon.png"
            }
        ];
        
        // initialize the user interface and event listeners
        this.initializeUI();
        this.setupEventListeners();
    }
    
    initializeUI() {
        // render all files with their icons and metadata
        this.displayFiles();
        
        // set up window controls
        document.querySelector('.minimize-button').addEventListener('click', () => {
            alert('minimize clicked');
        });
        
        document.querySelector('.maximize-button').addEventListener('click', () => {
            const window = document.querySelector('.window');
            if (window.style.width === '100%') {
                window.style.width = '800px';
                window.style.height = '600px';
            } else {
                window.style.width = '100%';
                window.style.height = '100%';
            }
        });
        
        document.querySelector('.close-button').addEventListener('click', () => {
            alert('close clicked');
        });
        
        // update status bar with file count
        this.updateStatusBar();
    }
    
    setupEventListeners() {
        // empty recycle bin buttons
        const emptyButtons = document.querySelectorAll('[title="empty recycle bin"], .sidebar-item:nth-child(2)');
        emptyButtons.forEach(button => {
            button.addEventListener('click', () => this.emptyRecycleBin());
        });
        
        // restore buttons
        const restoreButtons = document.querySelectorAll('[title="restore"], .sidebar-item:nth-child(1)');
        restoreButtons.forEach(button => {
            button.addEventListener('click', () => this.restoreSelectedItems());
        });
        
        // delete button
        const deleteButton = document.querySelector('[title="delete"]');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => this.deleteSelectedItems());
        }
        
        // file selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.file-item')) {
                this.handleFileSelection(e.target.closest('.file-item'), e.ctrlKey);
            } else if (!e.target.closest('.toolbar') && !e.target.closest('.sidebar')) {
                this.clearSelection();
            }
        });
        
        // double-click to restore
        document.addEventListener('dblclick', (e) => {
            if (e.target.closest('.file-item')) {
                this.restoreItem(e.target.closest('.file-item'));
            }
        });
        
        // right-click context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.file-item') || e.target.closest('.file-list')) {
                e.preventDefault();
                this.showContextMenu(e);
            }
        });
        
        // close context menu when clicking elsewhere
        document.addEventListener('click', () => this.removeContextMenu());
    }
    
    displayFiles() {
        const fileList = document.querySelector('.file-list');
        const header = fileList.querySelector('.file-list-header');
        
        // remove existing files (if any)
        const existingFiles = document.querySelectorAll('.file-item');
        existingFiles.forEach(file => file.remove());
        
        // add files
        this.deletedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.filename = file.name;
            
            fileItem.innerHTML = `
                <img class="file-icon" src="${file.icon}" alt="file">
                <div class="file-name">${file.name}</div>
                <div class="file-date">${file.dateDeleted}</div>
                <div class="file-size">${file.size}</div>
            `;
            
            fileList.appendChild(fileItem);
        });
    }
    
    handleFileSelection(fileItem, ctrlKey) {
        // if ctrl key is not pressed, clear previous selection
        if (!ctrlKey) {
            this.clearSelection();
        }
        
        // toggle selection state of the clicked file item
        fileItem.classList.toggle('selected');
    }
    
    clearSelection() {
        // remove 'selected' class from all file items
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('selected');
        });
    }
    
    getSelectedItems() {
        return document.querySelectorAll('.file-item.selected');
    }
    
    emptyRecycleBin() {
        const confirmation = confirm('are you sure you want to permanently delete all items in the recycle bin?');
        
        if (confirmation) {
            this.deletedFiles = [];
            this.displayFiles();
            this.updateStatusBar();
            alert('recycle bin has been emptied.');
        }
    }
    
    restoreSelectedItems() {
        const selectedItems = this.getSelectedItems();
        
        if (selectedItems.length === 0) {
            alert('no items selected. please select the items you want to restore.');
            return;
        }
        
        // remove selected files from deletedFiles array
        selectedItems.forEach(item => {
            const fileName = item.dataset.filename;
            this.deletedFiles = this.deletedFiles.filter(file => file.name !== fileName);
        });
        
        this.displayFiles();
        this.updateStatusBar();
        
        alert(`${selectedItems.length} item(s) restored successfully.`);
    }
    
    restoreItem(fileItem) {
        const fileName = fileItem.dataset.filename;
        
        // remove the file from deletedFiles array
        this.deletedFiles = this.deletedFiles.filter(file => file.name !== fileName);
        
        this.displayFiles();
        this.updateStatusBar();
        
        alert(`'${fileName}' restored successfully.`);
    }
    
    deleteSelectedItems() {
        const selectedItems = this.getSelectedItems();
        
        if (selectedItems.length === 0) {
            alert('no items selected. please select the items you want to delete permanently.');
            return;
        }
        
        const confirmation = confirm('are you sure you want to permanently delete the selected items?');
        
        if (confirmation) {
            // remove selected files from deletedFiles array
            selectedItems.forEach(item => {
                const fileName = item.dataset.filename;
                this.deletedFiles = this.deletedFiles.filter(file => file.name !== fileName);
            });
            
            // update display and status bar
            this.displayFiles();
            this.updateStatusBar();
            
            alert(`${selectedItems.length} item(s) deleted permanently.`);
        }
    }
    
    showContextMenu(event) {
        // remove existing context menu
        this.removeContextMenu();
        
        // create new context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.style.top = `${event.clientY}px`;
        contextMenu.style.zIndex = '1000';
        
        const menuItems = [
            { text: 'restore', action: () => this.restoreSelectedItems() },
            { text: 'delete permanently', action: () => this.deleteSelectedItems() },
            { text: '---' }, // separator
            { text: 'select all', action: () => this.selectAll() },
            { text: 'refresh', action: () => this.displayFiles() }
        ];
        
        menuItems.forEach(item => {
            if (item.text === '---') {
                const separator = document.createElement('div');
                separator.style.height = '1px';
                separator.style.backgroundColor = '#555555';
                separator.style.margin = '3px 0';
                contextMenu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.text;
                menuItem.style.padding = '6px 20px';
                menuItem.style.cursor = 'pointer';
                menuItem.style.color = '#e0e0e0';
                
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.backgroundColor = '#316ac5';
                });
                
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.backgroundColor = '';
                });
                
                menuItem.addEventListener('click', () => {
                    item.action();
                    this.removeContextMenu();
                });
                
                contextMenu.appendChild(menuItem);
            }
        });
        
        document.body.appendChild(contextMenu);
    }
    
    removeContextMenu() {
        // find and remove any existing context menu
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }
    
    selectAll() {
        // add selected class to all file items
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.add('selected');
        });
    }
    
    updateStatusBar() {
        const statusMessage = document.querySelector('.status-message');
        const count = this.deletedFiles.length;
        
        // update status bar with the count
        statusMessage.textContent = `${count} object${count !== 1 ? 's' : ''}`;
    }
}

// initialize the recycle bin when the page loads
window.addEventListener('load', () => {
    new RecycleBin();
});