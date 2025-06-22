import java.awt.Point;
import java.util.Scanner;


public class Main {

    // Helper function to caculate cost of creating a given triangle
    private static double cost(Point[] vertices, int i, int j, int k) {
        Point p1 = vertices[i];
        Point p2 = vertices[j];
        Point p3 = vertices[k];
        
        double a = p1.distance(p2);
        double b = p2.distance(p3);
        double c = p3.distance(p1);

        return a * a + b * b + c * c; 
    }

    // Recrusive method: computes the minimum-cost triangulation
    public static double minCostTriangulation(Point[] vertices) {
        int n = vertices.length; 
        double[][] dp = new double[n][n]; 
        int[][] triangle = new int[n][n]; 
        for (int dist = 2; dist < n; dist++) { 
            for (int i = 0; i < n - dist; i++) {
                int j = i + dist;
                dp[i][j] = Double.MAX_VALUE;
                for (int k = i + 1; k < j; k++) {
                    double cost = dp[i][k] + dp[k][j] + cost(vertices, i, k, j);
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        triangle[i][j] = k; 
                    }
                }
            }
        }

        // Reconstructs the triangulation
        boolean[] used = new boolean[n]; 
        StringBuilder sb = new StringBuilder();
        printTriangulation(triangle, 0, n - 1, used, sb);
        System.out.println((long) dp[0][n - 1]); 
        System.out.print(sb.toString()); 

        return dp[0][n - 1]; 
    }

    // Method to reconstruct the triangulation from the triangle[][] array
    private static void printTriangulation(int[][] triangle, int i, int j, boolean[] used, StringBuilder sb) {
        if (j - i < 2) return; 
        
        int k = triangle[i][j];
        if (!used[k]) { 
            sb.append(i).append(' ').append(k).append(' ').append(j).append("\n"); // Add the triangle to the output
            used[k] = true;
        }
        printTriangulation(triangle, i, k, used, sb); 
        printTriangulation(triangle, k, j, used, sb); 
    }

    public static void main(String[] args) {
       
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Point[] points = new Point[n];
        for (int i = 0; i < n; i++) {
            int x = in.nextInt();
            int y = in.nextInt();
            points[i] = new Point(x, y);
        }
        minCostTriangulation(points);
        in.close();
    }

}
