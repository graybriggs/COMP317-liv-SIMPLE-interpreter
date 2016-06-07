# Optimizing Compiler

This project is an optimizing compiler for a rudimentary programming language. The optimized code that has been generated is verified to be semantically equivalent to its unoptimized equivalent.

# Code Generation

The compiler generates an intermediate representation (IR). It then performs lowering on that IR. The assembly code generated from this compiler is very conservative x86-64.

# Optimized Code Generation

The compiler attempts the following code optimizations:

The following optimzations occur in the high level intermediate representation

	- Function inlining
	- Function cloning
	- Constant folding
	- Constant propogation
	- Dead code elimination

The following optimizations occur in the lower intermediate representation

	- Loop invariant code motion
	- Common sub-expression elimination
	- Strength reduction
	- Branch prediction/optimization

The following optimizations occur in assembly code

	- Loop unrolling
	- Register allocation
	- Cache optimization


