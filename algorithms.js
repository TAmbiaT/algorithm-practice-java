// Algorithm implementations ported from Java to JavaScript

// ============================================================================
// MIN-COST TRIANGULATION ALGORITHM
// ============================================================================

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class MinCostTriangulation {
    constructor() {
        this.triangles = [];
    }
    
    // Helper function to calculate cost of creating a given triangle
    cost(vertices, i, j, k) {
        const p1 = vertices[i];
        const p2 = vertices[j];
        const p3 = vertices[k];
        
        const a = p1.distance(p2);
        const b = p2.distance(p3);
        const c = p3.distance(p1);
        
        return a * a + b * b + c * c;
    }
    
    // Recursive method to reconstruct the triangulation
    printTriangulation(triangle, i, j, used, sb) {
        if (j - i < 2) return;
        
        const k = triangle[i][j];
        if (!used[k]) {
            sb.push(`${i} ${k} ${j}`);
            used[k] = true;
        }
        this.printTriangulation(triangle, i, k, used, sb);
        this.printTriangulation(triangle, k, j, used, sb);
    }
    
    // Main algorithm: computes the minimum-cost triangulation
    minCostTriangulation(vertices) {
        const n = vertices.length;
        const dp = Array(n).fill().map(() => Array(n).fill(0));
        const triangle = Array(n).fill().map(() => Array(n).fill(0));
        
        // Initialize dp table
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                dp[i][j] = Number.MAX_VALUE;
            }
        }
        
        // Base cases: no triangulation needed for adjacent vertices
        for (let i = 0; i < n - 1; i++) {
            dp[i][i + 1] = 0;
        }
        
        // Fill dp table using bottom-up approach
        for (let dist = 2; dist < n; dist++) {
            for (let i = 0; i < n - dist; i++) {
                const j = i + dist;
                dp[i][j] = Number.MAX_VALUE;
                
                for (let k = i + 1; k < j; k++) {
                    const cost = dp[i][k] + dp[k][j] + this.cost(vertices, i, k, j);
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        triangle[i][j] = k;
                    }
                }
            }
        }
        
        // Reconstruct the triangulation
        const used = Array(n).fill(false);
        const sb = [];
        this.printTriangulation(triangle, 0, n - 1, used, sb);
        
        return {
            minCost: Math.round(dp[0][n - 1]),
            triangles: sb
        };
    }
}

// ============================================================================
// MAX FLOW / MIN CUT ALGORITHM (Ford-Fulkerson)
// ============================================================================

class MaxFlowMinCut {
    constructor() {
        this.capacity = [];
        this.flow = [];
        this.visited = [];
        this.nonZeroEdges = [];
    }
    
    // Depth-first search to find augmenting paths
    dfs(graph, source, sink, parent) {
        const n = graph.length;
        this.visited = Array(n).fill(false);
        
        const stack = [source];
        this.visited[source] = true;
        parent[source] = -1;
        
        while (stack.length > 0) {
            const u = stack.pop();
            
            for (let v = 0; v < n; v++) {
                if (!this.visited[v] && graph[u][v] > 0) {
                    this.visited[v] = true;
                    parent[v] = u;
                    stack.push(v);
                    
                    if (v === sink) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Ford-Fulkerson algorithm implementation
    fordFulkerson(graph, source, sink) {
        const n = graph.length;
        this.flow = Array(n).fill().map(() => Array(n).fill(0));
        this.capacity = graph.map(row => [...row]);
        
        const parent = Array(n).fill(-1);
        let maxFlow = 0;
        
        // Find augmenting paths and update flow
        while (this.dfs(this.capacity, source, sink, parent)) {
            // Find bottleneck capacity
            let pathFlow = Number.MAX_VALUE;
            for (let v = sink; v !== source; v = parent[v]) {
                const u = parent[v];
                pathFlow = Math.min(pathFlow, this.capacity[u][v]);
            }
            
            // Update residual capacities and flow
            for (let v = sink; v !== source; v = parent[v]) {
                const u = parent[v];
                this.capacity[u][v] -= pathFlow;
                this.capacity[v][u] += pathFlow;
                this.flow[u][v] += pathFlow;
            }
            
            maxFlow += pathFlow;
        }
        
        return maxFlow;
    }
    
    // Find nodes reachable from source in residual graph (min-cut)
    findMinCut(graph, source) {
        const n = graph.length;
        this.visited = Array(n).fill(false);
        this.dfs(graph, source, -1, []); // Use DFS to find reachable nodes
        
        const sourceSide = [];
        for (let i = 0; i < n; i++) {
            if (this.visited[i]) {
                sourceSide.push(i + 1); // Convert to 1-based indexing
            }
        }
        
        return sourceSide;
    }
    
    // Main method to compute max flow and min cut
    computeMaxFlowMinCut(vertices, edges) {
        // Create capacity matrix from input
        const n = vertices;
        const capacity = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < edges.length; i++) {
            const edgeList = edges[i];
            for (let j = 0; j < edgeList.length; j += 2) {
                const dest = edgeList[j] - 1; // Convert to 0-based
                const cap = edgeList[j + 1];
                capacity[i][dest] = cap;
            }
        }
        
        // Compute max flow
        const maxFlow = this.fordFulkerson(capacity, 0, n - 1);
        
        // Extract non-zero flow edges
        this.nonZeroEdges = [];
        for (let u = 0; u < n; u++) {
            for (let v = 0; v < n; v++) {
                if (this.flow[u][v] > 0) {
                    this.nonZeroEdges.push([u + 1, v + 1, this.flow[u][v]]);
                }
            }
        }
        
        // Find min cut
        const sourceSide = this.findMinCut(this.capacity, 0);
        
        return {
            maxFlow: maxFlow,
            nonZeroCount: this.nonZeroEdges.length,
            flowEdges: this.nonZeroEdges,
            sourceSide: sourceSide
        };
    }
}

// ============================================================================
// EXPORT ALGORITHMS FOR USE IN MAIN APP
// ============================================================================

window.Algorithms = {
    MinCostTriangulation: MinCostTriangulation,
    MaxFlowMinCut: MaxFlowMinCut
};
