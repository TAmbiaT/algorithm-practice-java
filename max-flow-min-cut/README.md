# 🌊 Max Flow / Min Cut (Ford-Fulkerson)

This project implements the Ford-Fulkerson algorithm to compute the maximum flow from a source node to a sink node in a directed graph. It also outputs the edges carrying flow and the nodes on the source side of the minimum cut.

---

## ▶️ Run Online

👉 [Run on JDoodle](https://www.jdoodle.com/ia/1Iax)

> To run:
> 1. Click the link above.
> 2. Open the input/output panel and uncheck "interactive mode."
> 3. Paste the sample input below into the "Stdin Inputs" box.
> 4. Press the **Execute** button up top to run.

---

## 💻 Run Locally

If you'd like to run this program on your machine:

```bash
cd max-flow-min-cut
javac Main.java
java Main
```

Then paste the input directly into the console.

---

## 📥 Input Format

The program expects input from `System.in` in the following format:

```
8
2 7 5 9
3 6
4 5
8 10
2 1 3 2 6 8
3 3 4 6 7 3
4 2 8 5
```

- The first line contains the number of nodes `N`
- Each following line represents the outgoing edges for one node
  - Values are interpreted as: `to-node capacity [to-node capacity ...]`
  - The number of items per line must be even (pairs of destination and capacity)

---

## 📤 Output Format

```
<TOTAL_FLOW>
<USED_FLOW>
u v f
...
<NODES_IN_MIN_CUT>
...
```

- The first line is the total maximum flow from the source to the sink
- The second line is the number of edges in the flow graph that carry non-zero flow.
- The list of edges shows the flow `f` from node `u` to node `v`
- The remaining lines list node indices in the source-side of the min-cut

---

## 🧪 Sample Input

```
8
2 7 5 9
3 6
4 5
8 10
2 1 3 2 6 8
3 3 4 6 7 3
4 2 8 5
```

### Sample Output

```
13
9
1 2 5
1 5 8
2 3 5
3 4 5
4 8 10
5 6 8
6 4 5
6 7 3
7 8 3
4
1
2
3
5
```

This shows a max flow of `13`, lists the edges used with actual flow values, and identifies nodes reachable from the source in the residual graph (min-cut set).

---

## 🔍 Code Breakdown

The program builds and operates on an adjacency matrix representation of the graph:

- **Graph Representation**: A 2D array stores the capacities between each pair of nodes.
- **`dfs()`**: A recursive method that finds augmenting paths from source to sink using depth-first search. It updates the `parent` array to reconstruct paths.
- **`fordFulkerson()`**:
  - Repeatedly finds augmenting paths using `dfs()`.
  - Tracks the minimum residual capacity along each path (bottleneck).
  - Updates the residual graph by subtracting and adding flow.
  - Accumulates the total flow sent from source to sink.
- **Min-Cut Identification**:
  - After max flow is computed, performs DFS to identify nodes reachable from the source in the residual graph.
  - These nodes represent one side of the minimum cut.

The program reads the number of nodes and edge capacities from input, performs flow calculations, and prints results in a readable format.

---

## 👨‍💻 Author
**Tahmidul Ambia**

**Role**: Algorithm Implementer & Java Developer

- Implemented the Ford-Fulkerson algorithm with flow tracking and residual graph updates  
- Designed input parsing and output structure for clarity  
- Verified correctness with test cases and an interactive demo
