// Main application logic for the Algorithm Calculator

class AlgorithmCalculator {
    constructor() {
        this.currentAlgorithm = 'triangulation';
        this.currentTheme = this.getStoredTheme() || 'light';
        this.initializeEventListeners();
        this.setupMaxFlowInputs();
        this.applyTheme();
    }
    
    initializeEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Algorithm selector buttons
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchAlgorithm(e.target.dataset.algorithm);
            });
        });
        
        // Triangulation controls
        document.getElementById('add-vertex').addEventListener('click', () => {
            this.addVertex();
        });
        
        document.getElementById('clear-vertices').addEventListener('click', () => {
            this.clearVertices();
        });
        
        document.getElementById('calculate-triangulation').addEventListener('click', () => {
            this.calculateTriangulation();
        });
        
        // Max Flow controls
        document.getElementById('node-count').addEventListener('change', () => {
            this.updateMaxFlowInputs();
        });
        
        document.getElementById('calculate-maxflow').addEventListener('click', () => {
            this.calculateMaxFlow();
        });
    }
    
    switchAlgorithm(algorithm) {
        // Update button states
        document.querySelectorAll('.algo-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add('active');
        
        // Update calculator visibility
        document.querySelectorAll('.calculator').forEach(calc => {
            calc.classList.remove('active');
        });
        document.getElementById(`${algorithm}-calc`).classList.add('active');
        
        // Hide results
        document.querySelectorAll('.result-section').forEach(result => {
            result.classList.add('hidden');
        });
        
        this.currentAlgorithm = algorithm;
    }
    
    // ============================================================================
    // MIN-COST TRIANGULATION FUNCTIONS
    // ============================================================================
    
    addVertex() {
        const vertexList = document.getElementById('vertex-list');
        const vertexCount = vertexList.children.length + 1;
        
        const vertexDiv = document.createElement('div');
        vertexDiv.className = 'vertex-input';
        vertexDiv.innerHTML = `
            <label>Vertex ${vertexCount}:</label>
            <input type="number" class="x-coord" placeholder="X" value="0">
            <input type="number" class="y-coord" placeholder="Y" value="0">
            <button type="button" class="btn btn-secondary remove-vertex" style="padding: 8px 12px; font-size: 0.9rem;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        vertexList.appendChild(vertexDiv);
        
        // Add remove event listener
        vertexDiv.querySelector('.remove-vertex').addEventListener('click', () => {
            vertexDiv.remove();
            this.updateVertexLabels();
        });
    }
    
    clearVertices() {
        const vertexList = document.getElementById('vertex-list');
        vertexList.innerHTML = '';
        
        // Add back the minimum 3 vertices
        for (let i = 1; i <= 3; i++) {
            const vertexDiv = document.createElement('div');
            vertexDiv.className = 'vertex-input';
            vertexDiv.innerHTML = `
                <label>Vertex ${i}:</label>
                <input type="number" class="x-coord" placeholder="X" value="${i === 1 ? 0 : i === 2 ? 1 : 1}">
                <input type="number" class="y-coord" placeholder="Y" value="${i === 1 ? 0 : i === 2 ? 0 : 1}">
            `;
            vertexList.appendChild(vertexDiv);
        }
    }
    
    updateVertexLabels() {
        const vertexInputs = document.querySelectorAll('.vertex-input');
        vertexInputs.forEach((input, index) => {
            const label = input.querySelector('label');
            label.textContent = `Vertex ${index + 1}:`;
        });
    }
    
    calculateTriangulation() {
        try {
            const vertexInputs = document.querySelectorAll('.vertex-input');
            const vertices = [];
            
            // Collect vertex coordinates
            vertexInputs.forEach(input => {
                const x = parseInt(input.querySelector('.x-coord').value);
                const y = parseInt(input.querySelector('.y-coord').value);
                
                if (isNaN(x) || isNaN(y)) {
                    throw new Error('Please enter valid coordinates for all vertices');
                }
                
                vertices.push(new Point(x, y));
            });
            
            if (vertices.length < 3) {
                throw new Error('At least 3 vertices are required for triangulation');
            }
            
            // Run algorithm
            const triangulation = new Algorithms.MinCostTriangulation();
            const result = triangulation.minCostTriangulation(vertices);
            
            // Display results
            document.getElementById('min-cost').textContent = result.minCost;
            document.getElementById('triangles-list').textContent = result.triangles.join('\n');
            
            // Show results section
            document.getElementById('triangulation-result').classList.remove('hidden');
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    // ============================================================================
    // MAX FLOW / MIN CUT FUNCTIONS
    // ============================================================================
    
    setupMaxFlowInputs() {
        this.updateMaxFlowInputs();
    }
    
    updateMaxFlowInputs() {
        const nodeCount = parseInt(document.getElementById('node-count').value);
        const edgeList = document.getElementById('edge-list');
        edgeList.innerHTML = '';
        
        // Create input fields for each node (except the last one which is the sink)
        for (let i = 1; i < nodeCount; i++) {
            const edgeDiv = document.createElement('div');
            edgeDiv.className = 'edge-input';
            edgeDiv.innerHTML = `
                <label>Node ${i}:</label>
                <input type="text" class="edge-data" placeholder="e.g., 2 7 5 9" 
                       value="${this.getDefaultEdgeValue(i, nodeCount)}">
            `;
            edgeList.appendChild(edgeDiv);
        }
    }
    
    getDefaultEdgeValue(nodeIndex, totalNodes) {
        // Provide sensible default values based on the sample input
        const defaults = {
            1: "2 7 5 9",
            2: "3 6",
            3: "4 5",
            4: "8 10",
            5: "2 1 3 2 6 8",
            6: "3 3 4 6 7 3",
            7: "4 2 8 5"
        };
        return defaults[nodeIndex] || "";
    }
    
    calculateMaxFlow() {
        try {
            const nodeCount = parseInt(document.getElementById('node-count').value);
            const edgeInputs = document.querySelectorAll('.edge-data');
            const edges = [];
            
            // Parse edge data for each node
            for (let i = 0; i < edgeInputs.length; i++) {
                const edgeData = edgeInputs[i].value.trim();
                if (edgeData === '') {
                    edges.push([]);
                    continue;
                }
                
                const numbers = edgeData.split(/\s+/).map(num => parseInt(num));
                
                // Validate that we have pairs of numbers
                if (numbers.length % 2 !== 0) {
                    throw new Error(`Node ${i + 1}: Edge data must have pairs of numbers (destination capacity)`);
                }
                
                // Validate destination nodes
                for (let j = 0; j < numbers.length; j += 2) {
                    const dest = numbers[j];
                    if (dest < 1 || dest > nodeCount) {
                        throw new Error(`Node ${i + 1}: Invalid destination node ${dest}`);
                    }
                }
                
                edges.push(numbers);
            }
            
            // Add empty edge list for the sink node
            edges.push([]);
            
            // Run algorithm
            const maxFlow = new Algorithms.MaxFlowMinCut();
            const result = maxFlow.computeMaxFlowMinCut(nodeCount, edges);
            
            // Display results
            document.getElementById('max-flow-value').textContent = result.maxFlow;
            document.getElementById('flow-edges').textContent = 
                result.flowEdges.map(edge => `${edge[0]} ${edge[1]} ${edge[2]}`).join('\n');
            document.getElementById('min-cut-nodes').textContent = result.sourceSide.join('\n');
            
            // Show results section
            document.getElementById('maxflow-result').classList.remove('hidden');
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    
    showError(message) {
        // Create a simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // ============================================================================
    // THEME MANAGEMENT FUNCTIONS
    // ============================================================================
    
    getStoredTheme() {
        return localStorage.getItem('algorithm-calculator-theme');
    }
    
    setStoredTheme(theme) {
        localStorage.setItem('algorithm-calculator-theme', theme);
    }
    
    applyTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setStoredTheme(this.currentTheme);
        this.applyTheme();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmCalculator();
});
