# 📐 Min-Cost Triangulation

This project implements a dynamic programming algorithm to compute the minimum-cost triangulation of a simple polygon. The goal is to split a polygon into non-overlapping triangles such that the sum of the squared lengths of all triangle edges is minimized.

---

## ▶️ Run Online

👉 [Run on JDoodle](https://www.jdoodle.com/ia/1Iay)

> To run:
> 1. Click the link above.
> 2. Open the input/output panel and uncheck "interactive mode."
> 3. Paste the sample input below into the the "Stdin Inputs" box.
> 4. Press the **Execute** button up top to run.


---

## 💻 Run Locally

If you'd like to run this program on your machine:

```bash
cd min-cost-triangulation
javac Main.java
java Main
```

Then paste the input directly into the console.

---

## 📥 Input Format

The program expects input from `System.in` in the following format:

```
N
x1 y1
x2 y2
...
xN yN
```

- `N`: The number of vertices in the polygon (must be at least 3)
- Each subsequent line provides the coordinates of a vertex in counter-clockwise order

---

## 📤 Output Format

```
<TOTAL_COST>
i j k
i j k
...
```

- The first line is the total minimum triangulation cost (rounded to a long)
- Each subsequent line represents a triangle using the indices of the polygon’s vertices (0-based)

---

## 🧪 Sample Input

```
6
0 0
1 0
1 1
0 1
-1 1
-1 0
```

### Sample Output

```
16
0 3 5
0 1 3
1 2 3
3 4 5
```

This indicates a triangulation that achieves the minimum cost of `16` by creating the triangles listed.

---
## 🔍 Code Breakdown

The program follows a bottom-up dynamic programming approach:

- **`cost()`**: A helper function that computes the squared distance cost of a triangle defined by three points. This helps reduce floating point error while preserving relative magnitudes.
- **`minCostTriangulation()`**:
  - Builds a 2D `dp[i][j]` table representing the minimum cost to triangulate the subpolygon from vertex `i` to `j`.
  - Iterates over increasing distances between `i` and `j`, and tries all possible `k` values between them to find the lowest cost split.
  - Uses an auxiliary `triangle[i][j]` table to track which `k` produced the minimum cost for reconstruction.
- **`printTriangulation()`**:
  - Recursively reconstructs the triangulation order using the `triangle[][]` table.
  - Outputs the triangles used in the optimal solution.

The main method reads polygon vertices from input, builds the point array, and calls `minCostTriangulation()` to compute and print the results.

### Notes

- This implementation assumes the input polygon is **simple** (non-intersecting) and the points are provided in **counter-clockwise** order.
- The cost function is based on the **sum of squared distances** of the triangle sides to avoid floating point instability.

---

## 👨‍💻 Author
**Tahmidul Ambia**

**Role**: Algorithm Implementer & Java Developer

- Implemented the dynamic programming solution to polygon triangulation  
- Designed clean input/output formatting for usability  
- Verified correctness with sample test cases and online demo integration
