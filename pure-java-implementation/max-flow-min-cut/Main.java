import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.Scanner;


public class Main {

    static int[][] capacity;
    static int[][] flow;
    static boolean[] visited;
    static ArrayList<int[]> nonZeroEdges;

    public static void main(String[] args) {
       
        /*** PROCESSING INPUTS ***/
        Scanner in = new Scanner(System.in);
        // Set number of vertices
        int vertices = in.nextInt();
        in.nextLine(); 

        // Create and populate edges array
        int[][] edges = new int[vertices][];
        for (int i = 0; i < vertices-1; i++) {
            String line = in.nextLine();
            try{
                String[] parts = line.split("\\s+"); // Split the line by whitespace
                int[] nums = new int[parts.length];
                for (int j = 0; j < parts.length; j++) {
                    nums[j] = Integer.parseInt(parts[j]);
                }
                edges[i] = nums;
            }
            catch(NumberFormatException nfe){
                edges[i] = new int[]{};
            }
        }
        // Set last edge as empty array
        edges[vertices-1] = new int[]{};
        in.close();
        
        // Create and populate capacity matrix
        capacity = new int[vertices][vertices];
        for (int i = 0; i < vertices; i++) {
            for (int j = 0; j < edges[i].length; j += 2) {
                capacity[i][edges[i][j] - 1] = edges[i][j + 1]; 
            }
        }

        // Calculate the max flow and flow matrix
        int maxFlow = fordFulkerson(0, vertices - 1); 

        int[][] flowMatrix = new int[vertices][vertices];
        System.arraycopy(flow, 0, flowMatrix, 0, vertices);

        // Extracting the flow edges and calculating min cut via DFS
        nonZeroEdges = new ArrayList<>();
        visited = new boolean[vertices];
        dfs(0); // Start DFS from the source

        ArrayList<Integer> sourceSide = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            if (visited[i]) {
                sourceSide.add(i + 1); 
            }
        }

        int nonZeroCount = 0;
        for (int u = 0; u < vertices; u++) {
            for (int v = 0; v < vertices; v++) {
                if (flowMatrix[u][v] > 0) {
                    nonZeroEdges.add(new int[]{u + 1, v + 1, flowMatrix[u][v]}); 
                    nonZeroCount++;
                }
            }
        }

        // Print out results
        System.out.println(maxFlow);
        System.out.println(nonZeroCount);
        for (int[] edge : nonZeroEdges) {
            for (int i = 0; i < edge.length; i++) {
                System.out.print(edge[i]);
                if (i < edge.length - 1) {
                    System.out.print(" ");
                }
            }
            System.out.println(); // Print a newline at the end
        }
        System.out.println(sourceSide.size());
        for (int vertex : sourceSide) {
            System.out.println(vertex);
        }
    
    }

    /*** HELPER METHODS ***/

    // Ford-Fulkerson implementation
    static int fordFulkerson(int source, int sink) {
        int n = capacity.length;
        flow = new int[n][n];
        int maxFlow = 0;

        while (true) {
            Deque<Integer> queue = new ArrayDeque<>();
            queue.offer(source);
            int[] parent = new int[n];
            Arrays.fill(parent, -1);
            parent[source] = source;

            while (!queue.isEmpty()) {
                int u = queue.poll();
                if (u == sink) break;
                for (int v = 0; v < n; v++) {
                    if (capacity[u][v] - flow[u][v] > 0 && parent[v] == -1) {
                        parent[v] = u;
                        queue.offer(v);
                    }
                }
            }

            if (parent[sink] == -1) break; // No more augmenting paths

            // Find the bottleneck capacity
            int pathFlow = Integer.MAX_VALUE;
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, capacity[u][v] - flow[u][v]);
            }

            // Update the flow network
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                flow[u][v] += pathFlow;
                flow[v][u] -= pathFlow;
            }

            maxFlow += pathFlow;
        }

        return maxFlow;
    }

    // DFS to find vertices reachable from the source
    static void dfs(int u) {
        visited[u] = true;
        for (int v = 0; v < capacity.length; v++) {
            if (!visited[v] && capacity[u][v] - flow[u][v] > 0) {
                dfs(v);
            }
        }
    }
}
