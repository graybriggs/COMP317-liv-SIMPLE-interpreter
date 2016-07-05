# Optimizing Compiler

This project is an optimizing compiler for a rudimentary stack allocated Turing complete programming language that contains simple program constructs such as variable declarations, code blocks, loops and conditional statements. The optimized code that is generated is verified to be semantically equivalent to its unoptimized form.

# Code Generation

The compiler generates an intermediate representation (IR). It then performs lowering on that IR. The unoptimized assembly code generated from this compiler is very conservative x86-64.

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


