## -----------------------------------------------------------------
## Licensed Materials - Property of IBM
##
## SatX10
##
## (C) Copyright IBM Corporation 2012.  All Rights Reserved.
##
## Authors: Bard Bloom, David Grove, Benjamin Herta,
##          Vijay Saraswat, Ashish Sabharwal, Horst Samulowitz
## -----------------------------------------------------------------

SatX10 version 1.0 (release 20121215)

SatX10 is a framework for implementing parallel SAT solvers. It allows
several solvers (or different parameterizations of a single solver) to
run concurrently on a single or, with a simple change in the execution
command line, on multiple machines, while sharing information.

The current implementation includes six solvers as a demonstration of
this framework:

  -- Minisat 2.0
  -- Minisat 2.2.0
  -- Glucose 2.0
  -- Circuit Minisat
  -- Contrasat
  -- CryptoMinisat 2.9.2 (currently with limited functionality)

Due to copyright restrictions, this distribution does not explicitly include
any SAT solver code. Instead, a patch file for Minisat 2.2.0 is provided,
which can be applied as follows to the freely available Minisat 2.2.0 code
(http://minisat.se) in order to transform it into an X10 compatible version:

  $ cd solvers/c++
  $ # download minisat-2.2.0.tar.gz from http://minisat.se
  $ tar xvfz minisat-2.2.0.tar.gz
  $ mv minisat minisat-2.2.0
  $ cd minisat-2.2.0
  $ patch -p1 < ../minisat-2.2.0.patch

Other SAT solvers can be modified in a similar fashion, as desired.

A configuration file, specified at runtime, determines which solvers to
launch and with which command-line parameters.

The framework of X10 separates the systems engineering part of sharing
information efficiently and easily from the solver design part of determining
what to share and when. As a demonstration, the current implementation
allows sharing of clauses of a given maximum length. The sharing is done,
at the solver level, by pushing or consuming clauses into appropriate
STL queues (of STL vector<int>) provided by the framework.


ORGANIZATION OF THIS README
===========================

  (A) Setting up SatX10
  (B) Compiling SatX10
  (C) running SatX10
  (D) Configuration file format
  (E) Adding a new SAT solver to SatX10  (section writeup in progress)
  (F) Adding new kinds of information to share (section writeup in progress)


(A) SETTING UP SatX10
=====================

- Install X10 from http://x10-lang.org.  The current version of SatX10 has
  been tested with X10 2.3.0. IMPORTANT NOTE: Please install X10 2.3.0
  by compiling it *from source* available at http://x10-lang.org (e.g.,
  cd x10.dist; ant) rather than using pre-compiled binaries of X10; the
  latter may result in errors.

- SatX10 requires g++ version 4.4 or higher. It has been tested with
  versions 4.4.5 and 4.5.3.

- Assuming ${X10_HOME} is the location where X10 is installed, add the
  following to ${PATH}:
    ${X10_HOME}/bin
  If using Cygwin on Windows, you may also need to add:
    ${X10_HOME}/lib
    ${X10_HOME}/stdlib/lib
  
  
(B) COMPILING SatX10
====================  

In the main SatX10 folder (the one containing SatX10.x10), run:

  make
  
This will first compile each of the individual solvers, and then
link them together with the X10 code. If you have trouble compiling
one or more of the individual SAT solvers, you may want to comment
them out from SatX10.x10 and use only a subset of the solvers.

Running 'make' will build an executable 'SatX10' which implements
information sharing through TCP/IP sockets, on a single machine or
across multiple machines. For other ways of sharing information,
you can also use:

  make SatX10.pami
  make SatX10.standalone


(C) RUNNING SatX10
==================

USAGE:
  X10_NTHREADS=1 X10_STATIC_THREADS=true X10_NPLACES=N SatX10 <config.ppconfig> <maxLenSharedClauses> \
    <outgoingClsBufSize> <CNFfilename>

where
  N                   = number of "places" (i.e., instantiations of solvers) to run
  config.ppconfig     = a configuration file specifying which solvers+parameters to launch (see below)
  maxLenSharedClauses = maximum length of clauses that will be shared across solvers
  outgoingClsBufSize  = how many clauses to collect in a buffer before sending them to other solvers
  CNFfilename         = name of CNF file to solve

This will run SatX10 on the local machine, launching N solvers.

To run SatX10 across machines, create a file (e.g., hostfile.txt) with
names or IP addresses of machines on the network, one per line. These
machines must be set up for password-less SSH. Tell SatX10 the location
of this file as follows:

  X10_NTHREADS=1 X10_STATIC_THREADS=true X10_NPLACES=N X10_HOSTFILE=hostfile.txt SatX10 <config.ppconfig> \
    <maxLenSharedClauses> <outgoingClsBufSize> <CNFfilename>

The number of hosts in the hostfile need not match the number of places.

EXAMPLES:

  X10_NTHREADS=1 X10_STATIC_THREADS=true X10_NPLACES=4 ./SatX10 ppconfigs/example.ppconfig 10 100 example.cnf

  X10_NTHREADS=1 X10_STATIC_THREADS=true X10_NPLACES=16 X10_HOSTFILE=hostfile.txt ./SatX10 ppconfigs/example.ppconfig 10 1000 example.cnf

SAMPLE OUTPUT:

$ X10_NTHREADS=1 X10_STATIC_THREADS=true X10_NPLACES=4 ./SatX10 ppconfigs/example.ppconfig 10 100 example.cnf
c ==== SatX10 Parallel SAT Solver 1.0 (release 20121215) ====
c SatX10 parameters:
c   CNF filename              : example.cnf
c   ppconfig file             : ppconfigs/example.ppconfig
c   maxLengthSharedClauses    : 10
c   outgoingClausesBufSize    : 100
c   printSolution             : true
c Place(0): will run solver Minisat_2_2_0 [-verb=0]
c Place(1): will run solver Minisat_2_2_0 [-verb=0,-ccmin-mode=0]
c Place(2): will run solver Minisat_2_2_0 [-verb=0,-no-luby]
c Place(3): will run solver Minisat_2_2_0 [-verb=0,-rinc=1.75]
c Instance information:
c   filename                  : example.cnf
c   number of variables       : 684
c   number of clauses         : 2297
c Place(0): starting master process for restart sequence
c Place(1): starting solver
c Place(0): starting solver
c Place(2): starting solver
c Place(3): starting solver
c Place(0): INSTANCE SOLVED!
c Solver Wall-Clock Time       : 6.287760029 seconds
c Place(1): aborting
c Place(2): aborting
c Place(3): aborting
s UNSATISFIABLE
c restarts              : 444
c conflicts             : 162546         (25957 /sec)
c decisions             : 192733         (0.00 % random) (30778 /sec)
c propagations          : 26536797       (4237719 /sec)
c conflict literals     : 3097028        (45.07 % deleted)
c CPU time              : 6.26205 s
c x10 shared clause %         : 22.39
c x10 outgoing clauses        : 36400 [ 9 151 1255 1358 2348 3645 4724 6061 7949 8900 ]
c x10 incoming clauses        : 96000 [ 11 327 3378 3614 6855 10413 13722 16552 20022 21106 ]
c x10 incoming with self ID   : 36400
c Total time till full exit   : 6.297390888 seconds


(D) CONFIGURATION FILE FORMAT
=============================

Configuration files have names of the form whatever.ppconfig. They must
contain one line per solver to launch, starting with the names of the
solver (as it appears in SatX10.x10, e.g., Minisat_2_2_0) followed by
the usual command-line arguments that the solver takes (except for the
CNF filename). Lines starting with '#' are treated as comments and
ignored.

Some examples are given in the 'ppconfigs' folder. Here are the top few
lines of one of them (MiMiGlCi.ppconfig) :

# Solvers: Minisat_2_0, Minisat_2_2_0, Glucose_2_0, CirMinisat
# the first 10 solvers:
Glucose_2_0   -verb=0
Minisat_2_2_0 -verb=0
CirMinisat    -verb=0
Minisat_2_0   -verb=0
Glucose_2_0   -verb=0 -no-luby
CirMinisat    -verb=0 -no-luby
Glucose_2_0   -verb=0 -phase-saving=1
CirMinisat    -verb=0 -phase-saving=1
Minisat_2_2_0 -verb=0 -phase-saving=1
Glucose_2_0   -verb=0 -ccmin-mode=0

This tells SatX10 to launch glucose 2.0 with parameter -verb=0 at place 0,
solver minisat 2.2.0 with parameter -verb=0 at place 1, and so on.

If there are fewer solvers indicated in the .ppconfig file than the value
of the variable X10_NPLACES specified at the command line, only as many solvers
are launched as there are uncommented lines in the .ppconfig file. Conversely,
if X10_NPLACES is smaller than the number of solvers specified in the .ppconfig
file, extra lines in the file are ignored.

To find out which parameters a particular solver supports, you can look into
the documentation for that solver or invoke its "help" method, if normally
available through the commandline, by simply creating a one-line .ppconfig
file with that parameter:

Minisat_2_2_0    --help


(E) ADDING A NEW SAT SOLVER TO SatX10
=====================================

Adding a new SAT solver to SatX10 requires minimal effort, assuming the goal
is to support the same kind of sharing that is already being done by the
solvers currently incorporated in SatX10. (For information about how to go
about adding new kinds of information to share, please refer to the corresponding
section later in this README.)

This task is best done by example. Please refer to the file

  solver/c++/minisat-2.2.0.patch
  
to get a sense of what changes are needed to a usual CDCL solver.

Below are, roughly speaking, the steps to add a new solver. We will assume that
the solver is written in C++ and compiles fine with the version of g++ that the
X10 installation on the system is linked to.

  - Add the solver code to the folder solvers/c++/

  - Place everything in the solver code inside its own unique namespace, something
    like Minisat_2_2_0 or Glucose_2_0.
    
  - Assuming the solver has a "Solver" class, have the class inherit from a base
    class provided by the framework called SolverSatX10Base (in SolverSatX10Base.h).
    Implement the pure virtual methods of this base class, which include methods
    like:
    
      virtual void x10_parseDIMACS(const char * filename) = 0;
      virtual int  x10_nVars(void) = 0;
      virtual int  x10_nClauses(void) = 0;
      virtual int  x10_solve(void) = 0; // return values: 0: unsolved, 1: satisfiable; 2: unsatisfiable
      virtual void x10_printSolution(void) = 0;
      virtual void x10_printStats(void) = 0;
      
      virtual void x10_processIncomingClauses(void) = 0; // incorporate externally generated clauses available in a queue<vector<int>>

    In most cases, this will involve calling an appropriate method already implemented
    in the new solver.
    
  - Implement one additional method in the new Solver class:

      // push outgoing clause into a queue<vector<int>> provided by the base class
      void x10_bufferOutgoingClause(<clause in the solver's format>) 

  - Implement a C++ class through which X10 will interact with the new solver:
  
      solvers/c++_x10_wrappers/SatX10__Solver_NewSolver.h
      
    This class should be modeled along the lines of similar classes, e.g.,
    
      solvers/c++_x10_wrappers/SatX10__Solver_Minisat_2_2_0.h
      
    In particular, it needs to have a constructor that takes appropriate parameters
    as defined in the sample file above, parses the CNF file, parses any
    solver-specific (argc, argv) arguments provided to it, and sets up a Solver object
    for the new solver. It also needs a static _make method that simply creates
    an object by calling the constructor and returns a pointer to it.
    
  - Add a few lines to the main X10 file, SatX10.x10, to create a simple X10 class
    for the new solver and extend the 'launching' part to launch this solver as needed.
    A good example is the way Minisat 2.2.0 is currently handled in SatX10.x10.
    
  - Extend Makefile to include compilation of the newly added solver. It is easiest
    to model this extension after the Makefile constructs for existing solvers such
    as Minisat 2.2.0.
    
This should extend SatX10 with your new solver!  In order to start using the new solver,
create an appropriate .ppconfig file that calls this solver by the name defined for it
in SatX10.x10 above.


(F) ADDING NEW KINDS OF INFORMATION TO SHARE
============================================

(note: section writeup in progress)

This functionality needs to be added at the level of the X10 interface itself and
requires a reasonable level of understanding of X10 itself, namely the notion of
"callbacks" to have X10 perform a certain function as and when desired by the
solver. Below is a brief, high-level description of the process. More details
are available from the authors.

In particular, one would create a new "X10 Callback" method, similar to the
x10_processOutgoingClauses() callback used for sharing clauses as defined in the
class SolverX10Callback (in file SolverX10Callback.h), implement it in
SatX10__Solver.h if generic or in SatX10__Solver_YourSolver.h if solver-specific,
and use it to send the new kind of information to all other solvers. Sending
information through X10 is done by "serializing" it into, e.g., an X10 array of
integers, and then deserializating this at the receiving end.

Similarly, one would create a new method for the receiving end, similar to
bufferIncomingClause(<x10-array-int>) defined in SatX10__Solver.h for X10 to put
all incoming clauses in a queue<vector<int>> to be later processed by the solver
at will.

Finally, in the SAT solver itself, one would call the new callback method whenever
information is ready to be sent out, and would periodically call a method to process
incoming information that X10 has been gathering (e.g., currently in an incoming
clauses queue).


===============================================================================
