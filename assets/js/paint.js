class Paint {
    constructor() {
        this.canvas = document.getElementById('canvas'); // create the space for drawing
        this.ctx = canvas.getContext('2d'); // allows to draw on the canvas
        this.isDrawing = false; // track if the mouse button is pressed
        this.currentTool = 'pencil'; // default tool
        // mouse coordinates
        this.lastX = 0; 
        this.lastY = 0;

        this.history = []; // save canvas states for undo/redo
        this.historyIndex = -1;
        this.primaryColor = '#000000'; // default color -- drawing
        this.secondaryColor = '#ffffff'; // default color -- fill
        
        // mouse coordinates
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initializeCanvas();
        this.setupEventListeners();
        this.addMenuFunctionality();
        this.saveState();
    }

    initializeCanvas() {
        // default white bg
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // drawing configs
        this.ctx.strokeStyle = this.primaryColor;
        this.ctx.lineWidth = 1; // thin line for pencil
        this.ctx.lineCap = 'round'; // rounded line ends for smoother lines
        
        // shape properties
        this.isDrawingShape = false; // track if a shape is being drawn
        this.shapeStartX = 0;
        this.shapeStartY = 0;
        
        document.querySelector('.primary-color').style.background = this.primaryColor;
        document.querySelector('.secondary-color').style.background = this.secondaryColor;
    }

    setupEventListeners() {
        // mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', (e) => {
            this.trackMouse(e); // update mouse coordinates
            this.draw(e); // draw if mouse button is pressed
        });
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // toolbox -- connect tool to method
        document.getElementById('pencilButton').addEventListener('click', () => this.setTool('pencil'));
        document.getElementById('brushButton').addEventListener('click', () => this.setTool('brush'));
        document.getElementById('eraserButton').addEventListener('click', () => this.setTool('eraser'));
        document.getElementById('fillButton').addEventListener('click', () => this.setTool('fill'));
        document.getElementById('textButton').addEventListener('click', () => this.setTool('text'));
        document.getElementById('rectangleButton').addEventListener('click', () => this.setTool('rectangle'));
        document.getElementById('circleButton').addEventListener('click', () => this.setTool('circle'));
        document.getElementById('lineButton').addEventListener('click', () => this.setTool('line'));

        // history controls
        document.getElementById('undoButton').addEventListener('click', () => this.undo());
        document.getElementById('redoButton').addEventListener('click', () => this.redo());
        
        // color swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                if (e.button === 0) { // left click -- primary color
                    this.primaryColor = swatch.style.background;
                    document.querySelector('.primary-color').style.background = this.primaryColor;
                    this.ctx.strokeStyle = this.primaryColor; // update drawing color
                } else { // right click -- secondary color
                    this.secondaryColor = swatch.style.background;
                    document.querySelector('.secondary-color').style.background = this.secondaryColor;
                }
            });
            
            // prevent context menu on right-click
            swatch.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.secondaryColor = swatch.style.background;
                document.querySelector('.secondary-color').style.background = this.secondaryColor;
            });
        });
        
        // custom color picker
        document.querySelector('.primary-color').addEventListener('click', () => {
            document.getElementById('colorPicker').click();
        });
        
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            this.primaryColor = e.target.value;
            document.querySelector('.primary-color').style.background = this.primaryColor;
            this.ctx.strokeStyle = this.primaryColor;
        });
    }

    trackMouse(e) {
        // update mouse coordinates
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left; // relative to left
        this.mouseY = e.clientY - rect.top; // relative to top
        
        // update status bar
        document.querySelector('.coordinates').textContent = `${this.mouseX}, ${this.mouseY}px`;
    }

    setTool(tool) {
        this.currentTool = tool;
        
        // highlight active tool
        document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${tool}Button`).classList.add('active');
        
        // set tool properties
        switch(tool) {
            case 'pencil':
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = this.primaryColor;
                break;
            case 'brush':
                this.ctx.lineWidth = 3;
                this.ctx.strokeStyle = this.primaryColor;
                break;
            case 'eraser':
                this.ctx.lineWidth = 8;
                this.ctx.strokeStyle = '#ffffff';
                break;
            case 'text':
                // later
                break;
            default:
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = this.primaryColor;
                break;
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect(); // get the size of the canvas
        this.shapeStartX = e.clientX - rect.left;
        this.shapeStartY = e.clientY - rect.top;
        this.ctx.beginPath(); // start drawing path
        this.ctx.moveTo(this.shapeStartX, this.shapeStartY); // move to the starting point
        
        // fill tool -> execute immediately
        if (this.currentTool === 'fill') {
            this.floodFill(this.shapeStartX, this.shapeStartY, this.primaryColor);
            this.isDrawing = false;
            this.saveState(); 
        }
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        // get mouse coordinates
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        switch(this.currentTool) {
            case 'pencil':
            case 'brush':
            case 'eraser':
                this.ctx.lineTo(x, y); // draw a line to the current mouse position
                this.ctx.stroke(); // render that line
                this.ctx.beginPath(); // start a new path to prevent lines connecting
                this.ctx.moveTo(x, y); // set the starting point for the new path
                break;
                
            case 'rectangle':
            case 'circle':
            case 'line':
                // shape preview while dragging
                this.drawShapePreview(x, y);
                break;
        }
    }

    drawShapePreview(x, y) {
        // clear any previous shape preview
        this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
        
        switch(this.currentTool) {
            case 'rectangle':
                this.ctx.beginPath();
                this.ctx.rect(
                    this.shapeStartX,
                    this.shapeStartY,
                    x - this.shapeStartX,
                    y - this.shapeStartY
                );
                break;
                
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(x - this.shapeStartX, 2) + 
                    Math.pow(y - this.shapeStartY, 2)
                ); // pythagorean theorem -- radius from center to mouse
                this.ctx.beginPath();
                this.ctx.arc(this.shapeStartX, this.shapeStartY, radius, 0, Math.PI * 2);
                break;
                
            case 'line':
                this.ctx.beginPath();
                this.ctx.moveTo(this.shapeStartX, this.shapeStartY);
                this.ctx.lineTo(x, y);
                break;
        }
        
        this.ctx.stroke();
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveState();
        }
    }

    floodFill(startX, startY, fillColor) {
        // get the entire canvas pixel data for direct pixel manipulation
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data; // array with 4 values per pixel (rgba)
        
        // get the target color
        const startPos = (startY * this.canvas.width + startX) * 4; // start position in the pixel array
        const startR = pixels[startPos]; // red
        const startG = pixels[startPos + 1]; // green
        const startB = pixels[startPos + 2]; // blue
        
        // convert fill color from hex to RGB
        const fill = document.createElement('div'); // html/css color conversion -- create a div with the color
        fill.style.color = fillColor; // set the color
        document.body.appendChild(fill); // add to the body to get the computed color
        const computed = window.getComputedStyle(fill).color; // get the computed color
        document.body.removeChild(fill); // remove the div
        const [r, g, b] = computed.match(/\d+/g).map(Number); // extract rgb values
        
        // stack for flood fill
        const pixelsToCheck = [[startX, startY]]; // start with the initial pixel
        const seen = new Set(); // track seen pixels to avoid duplicates
        
        // loop through pixels
        while (pixelsToCheck.length > 0) {
            const [x, y] = pixelsToCheck.pop();
            const pos = (y * this.canvas.width + x) * 4;
            
            // check if we're out of bounds
            if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) {
                continue;
            }
            
            // check if we've seen this pixel or if it's different from start color
            if (seen.has(`${x},${y}`) || 
                pixels[pos] !== startR || 
                pixels[pos + 1] !== startG || 
                pixels[pos + 2] !== startB) {
                continue;
            }
            
            // fill the pixel
            pixels[pos] = r;
            pixels[pos + 1] = g;
            pixels[pos + 2] = b;
            seen.add(`${x},${y}`);
            
            // add adjacent pixels
            pixelsToCheck.push([x + 1, y]);
            pixelsToCheck.push([x - 1, y]);
            pixelsToCheck.push([x, y + 1]);
            pixelsToCheck.push([x, y - 1]);
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    saveState() {
        this.historyIndex++;
        this.history = this.history.slice(0, this.historyIndex);
        this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    undo() {
        if (this.historyIndex > 0) { // as it starts from 0, check if there's a previous state
            this.historyIndex--;
            this.ctx.putImageData(this.history[this.historyIndex], 0, 0); // restore the previous state
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.ctx.putImageData(this.history[this.historyIndex], 0, 0); // restore the next state
        }
    }

    addMenuFunctionality() {
        // file menu functionality
        const fileMenu = document.querySelector('.menu-bar li:nth-child(1)');
        const menuItems = this.createDropdownMenu([
            { name: 'New', action: () => this.newCanvas() },
            { name: 'Open...', action: () => this.openImage() },
            { name: 'Save', action: () => this.saveImage() },
            { name: 'Save As...', action: () => this.saveImageAs() },
            { name: 'Print...', action: () => window.print() },
            { name: 'Exit', action: () => window.close() }
        ]);
        
        fileMenu.addEventListener('click', () => this.toggleMenu(fileMenu, menuItems));
        
        // edit menu functionality
        const editMenu = document.querySelector('.menu-bar li:nth-child(2)');
        const editItems = this.createDropdownMenu([
            { name: 'Undo', action: () => this.undo() },
            { name: 'Redo', action: () => this.redo() },
            { name: 'Cut', action: () => document.execCommand('cut') },
            { name: 'Copy', action: () => document.execCommand('copy') },
            { name: 'Paste', action: () => document.execCommand('paste') },
            { name: 'Clear Selection', action: () => this.clearSelection() }
        ]);
        
        editMenu.addEventListener('click', () => this.toggleMenu(editMenu, editItems));
        
        // other menus
        this.setupSubMenu(3, 'View', ['Zoom In', 'Zoom Out', 'Actual Size', 'Status Bar']);
        this.setupSubMenu(4, 'Image', ['Flip Horizontal', 'Flip Vertical', 'Rotate', 'Stretch/Skew']);
        this.setupSubMenu(5, 'Colors', ['Edit Colors...', 'Color Palette']);
        this.setupSubMenu(6, 'Help', ['Help Topics', 'About Paint']);
    }

    createDropdownMenu(items) {
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.style.display = 'none';
        menu.style.position = 'absolute';
        menu.style.backgroundColor = '#2a2a2a';
        menu.style.border = '1px solid #555555';
        menu.style.zIndex = '1000';
        menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
        
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.textContent = item.name;
            menuItem.style.padding = '5px 15px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.color = '#e0e0e0';
            
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.backgroundColor = '#316AC5';
            });
            
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.backgroundColor = 'transparent';
            });
            
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                item.action();
                this.closeAllMenus();
            });
            
            menu.appendChild(menuItem);
        });
        
        document.body.appendChild(menu);
        return menu;
    }

    setupSubMenu(index, name, items) {
        const menuItem = document.querySelector(`.menu-bar li:nth-child(${index})`);
        const subItems = this.createDropdownMenu(
            items.map(item => ({ name: item, action: () => console.log(`${name} > ${item} clicked`) }))
        );
        menuItem.addEventListener('click', () => this.toggleMenu(menuItem, subItems));
    }

    toggleMenu(parent, menu) {
        this.closeAllMenus();
        
        const rect = parent.getBoundingClientRect();
        menu.style.top = `${rect.bottom}px`;
        menu.style.left = `${rect.left}px`;
        menu.style.display = 'block';
        
        // close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.closeAllMenus.bind(this), { once: true });
        }, 0);
    }

    closeAllMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    newCanvas() {
        if (confirm('Do you want to save changes to Untitled?')) {
            this.saveImage();
        }
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.history = [];
        this.historyIndex = -1;
        this.saveState();
    }

    saveImage() { // as .png
        const link = document.createElement('a');
        link.download = 'my-drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    saveImageAs() {
        const filename = prompt('Enter file name:', 'my-drawing'); // first set the filename
        if (filename) {
            const link = document.createElement('a');
            link.download = filename + '.png';
            link.href = this.canvas.toDataURL();
            link.click();
        }
    }

    openImage() {
        const input = document.createElement('input'); // open image from pc
        input.type = 'file';
        input.accept = 'image/*'; // accept any image file, limit to images only
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image(); // create an image element
                    img.onload = () => {
                        this.ctx.fillStyle = 'white';
                        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    
                        // draw the image on the canvas, fitting to the canvas size
                        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                        this.saveState();
                    };
                    img.src = event.target.result; // set the image source
                };
                reader.readAsDataURL(file); // read the file as a data url
            }
        };

        // click the input to open file dialog
        input.click();
    }
}

// initialize paint when the page loads
window.addEventListener('load', () => new Paint());