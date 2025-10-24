/**
 * Seat Generator Algorithm
 * 
 * This algorithm generates seat assignments for students taking an exam,
 * ensuring that students from the same branch are not seated adjacent to each other.
 * 
 * Algorithm Steps:
 * 1. Sort students by branch and then by registration number
 * 2. Create seat slots across all available classrooms
 * 3. Distribute students using round-robin across branch groups
 * 4. Apply local fixes to avoid same-branch adjacency
 */

const generateSeatPlan = (exam, students, classrooms) => {
  console.log(`Generating seat plan for exam: ${exam.name}`);
  console.log(`Total students: ${students.length}`);
  console.log(`Total classrooms: ${classrooms.length}`);

  // Step 1: Sort students by branch and then by registration number
  const sortedStudents = [...students].sort((a, b) => {
    if (a.branch !== b.branch) {
      return a.branch.localeCompare(b.branch);
    }
    return a.regNumber.localeCompare(b.regNumber);
  });

  // Step 2: Create seat slots across classrooms
  const seatSlots = [];
  classrooms.forEach(classroom => {
    const blockId = classroom.floor.block._id;
    const floorId = classroom.floor._id;
    const classroomId = classroom._id;
    const capacity = classroom.capacity;
    
    // Calculate rows and columns (assume 10 columns per row, or adjust based on capacity)
    const columnsPerRow = Math.min(10, Math.ceil(Math.sqrt(capacity * 2)));
    const rows = Math.ceil(capacity / columnsPerRow);
    
    for (let seatNumber = 1; seatNumber <= capacity; seatNumber++) {
      const row = Math.floor((seatNumber - 1) / columnsPerRow) + 1;
      const col = ((seatNumber - 1) % columnsPerRow) + 1;
      
      seatSlots.push({
        blockId,
        floorId,
        classroomId,
        seatNumber,
        row,
        col,
        classroomName: classroom.name,
        blockName: classroom.floor.block.name,
        floorNumber: classroom.floor.number
      });
    }
  });

  console.log(`Total seat slots available: ${seatSlots.length}`);

  // Step 3: Group students by branch and create round-robin distribution
  const branchGroups = {};
  sortedStudents.forEach(student => {
    if (!branchGroups[student.branch]) {
      branchGroups[student.branch] = [];
    }
    branchGroups[student.branch].push(student);
  });

  // Create a queue of branch groups sorted by size (largest first)
  const branchQueue = Object.keys(branchGroups)
    .map(branch => ({
      branch,
      students: branchGroups[branch],
      index: 0
    }))
    .sort((a, b) => b.students.length - a.students.length);

  // Step 4: Distribute students using round-robin
  const assignments = [];
  let slotIndex = 0;

  while (slotIndex < seatSlots.length && branchQueue.length > 0) {
    // Find the branch group with the most remaining students
    let currentBranchIndex = 0;
    for (let i = 1; i < branchQueue.length; i++) {
      if (branchQueue[i].students.length > branchQueue[currentBranchIndex].students.length) {
        currentBranchIndex = i;
      }
    }

    const currentBranch = branchQueue[currentBranchIndex];
    
    if (currentBranch.students.length > 0) {
      const student = currentBranch.students.shift();
      const seatSlot = seatSlots[slotIndex];
      
      assignments.push({
        studentId: student._id,
        blockId: seatSlot.blockId,
        floorId: seatSlot.floorId,
        classroomId: seatSlot.classroomId,
        seatNumber: seatSlot.seatNumber,
        row: seatSlot.row,
        col: seatSlot.col
      });
      
      slotIndex++;
    }

    // Remove empty branch groups
    branchQueue.forEach((group, index) => {
      if (group.students.length === 0) {
        branchQueue.splice(index, 1);
      }
    });
  }

  // Step 5: Apply local fixes to avoid same-branch adjacency
  assignments.forEach((assignment, index) => {
    const currentStudent = students.find(s => s._id.toString() === assignment.studentId.toString());
    
    // Check adjacent seats in the same row
    const sameRowAssignments = assignments.filter(a => 
      a.classroomId.toString() === assignment.classroomId.toString() && 
      a.row === assignment.row
    );
    
    const adjacentSeats = sameRowAssignments.filter(a => 
      Math.abs(a.col - assignment.col) === 1
    );
    
    // If adjacent seats have same branch students, try to swap
    adjacentSeats.forEach(adjacentSeat => {
      const adjacentStudent = students.find(s => s._id.toString() === adjacentSeat.studentId.toString());
      
      if (currentStudent.branch === adjacentStudent.branch) {
        // Find a non-same-branch student to swap with
        const swapCandidate = assignments.find(a => {
          const candidateStudent = students.find(s => s._id.toString() === a.studentId.toString());
          return candidateStudent.branch !== currentStudent.branch &&
                 a.classroomId.toString() === assignment.classroomId.toString() &&
                 !sameRowAssignments.includes(a);
        });
        
        if (swapCandidate) {
          // Perform swap
          const tempStudentId = assignment.studentId;
          assignment.studentId = swapCandidate.studentId;
          swapCandidate.studentId = tempStudentId;
          
          console.log(`Swapped students to avoid same-branch adjacency`);
        }
      }
    });
  });

  console.log(`Generated ${assignments.length} seat assignments`);
  
  return assignments;
};

module.exports = generateSeatPlan;
