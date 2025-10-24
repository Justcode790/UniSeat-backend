require('dotenv').config({ path: '../.env' });
const connectDB = require('../config/db');
const User = require('../models/User');
const Block = require('../models/Block');
const Floor = require('../models/Floor');
const Classroom = require('../models/Classroom');
const Student = require('../models/Student');
const Exam = require('../models/Exam');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Block.deleteMany({});
    await Floor.deleteMany({});
    await Classroom.deleteMany({});
    await Student.deleteMany({});
    await Exam.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log('👤 Created admin user:', adminUser.email);

    // Create faculty user
    const facultyUser = await User.create({
      name: 'Faculty User',
      email: 'faculty@uniseat.local',
      password: 'Faculty@123',
      role: 'faculty'
    });
    console.log('👤 Created faculty user:', facultyUser.email);

    // Create blocks
    const blockA = await Block.create({
      name: 'Block A',
      location: 'Main Campus',
      totalFloors: 3
    });

    const blockB = await Block.create({
      name: 'Block B',
      location: 'Main Campus',
      totalFloors: 2
    });

    console.log('🏢 Created blocks:', blockA.name, blockB.name);

    // Create floors for Block A
    const floorA1 = await Floor.create({
      block: blockA._id,
      number: 1,
      totalClassrooms: 5
    });

    const floorA2 = await Floor.create({
      block: blockA._id,
      number: 2,
      totalClassrooms: 4
    });

    const floorA3 = await Floor.create({
      block: blockA._id,
      number: 3,
      totalClassrooms: 3
    });

    // Create floors for Block B
    const floorB1 = await Floor.create({
      block: blockB._id,
      number: 1,
      totalClassrooms: 3
    });

    const floorB2 = await Floor.create({
      block: blockB._id,
      number: 2,
      totalClassrooms: 2
    });

    console.log('🏗️  Created floors');

    // Create classrooms
    const classrooms = [
      // Block A Floor 1
      { floor: floorA1._id, name: 'A101', capacity: 50, layoutType: 'standard' },
      { floor: floorA1._id, name: 'A102', capacity: 60, layoutType: 'standard' },
      { floor: floorA1._id, name: 'A103', capacity: 40, layoutType: 'theater' },
      { floor: floorA1._id, name: 'A104', capacity: 30, layoutType: 'seminar' },
      { floor: floorA1._id, name: 'A105', capacity: 45, layoutType: 'standard' },
      
      // Block A Floor 2
      { floor: floorA2._id, name: 'A201', capacity: 55, layoutType: 'standard' },
      { floor: floorA2._id, name: 'A202', capacity: 35, layoutType: 'lab' },
      { floor: floorA2._id, name: 'A203', capacity: 50, layoutType: 'standard' },
      { floor: floorA2._id, name: 'A204', capacity: 25, layoutType: 'seminar' },
      
      // Block A Floor 3
      { floor: floorA3._id, name: 'A301', capacity: 60, layoutType: 'standard' },
      { floor: floorA3._id, name: 'A302', capacity: 40, layoutType: 'theater' },
      { floor: floorA3._id, name: 'A303', capacity: 30, layoutType: 'lab' },
      
      // Block B Floor 1
      { floor: floorB1._id, name: 'B101', capacity: 50, layoutType: 'standard' },
      { floor: floorB1._id, name: 'B102', capacity: 45, layoutType: 'standard' },
      { floor: floorB1._id, name: 'B103', capacity: 35, layoutType: 'seminar' },
      
      // Block B Floor 2
      { floor: floorB2._id, name: 'B201', capacity: 40, layoutType: 'standard' },
      { floor: floorB2._id, name: 'B202', capacity: 30, layoutType: 'lab' }
    ];

    const createdClassrooms = await Classroom.insertMany(classrooms);
    console.log('🏫 Created classrooms:', createdClassrooms.length);

    // Create sample students
    const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE'];
    const sections = ['A', 'B', 'C'];
    const students = [];

    for (let year = 1; year <= 4; year++) {
      for (const branch of branches) {
        for (const section of sections) {
          for (let i = 1; i <= 15; i++) {
            const regNumber = `${branch}${year}${section}${i.toString().padStart(3, '0')}`;
            students.push({
              name: `Student ${regNumber}`,
              regNumber,
              branch,
              year,
              section,
              email: `${regNumber.toLowerCase()}@university.edu`
            });
          }
        }
      }
    }

    const createdStudents = await Student.insertMany(students);
    console.log('👥 Created students:', createdStudents.length);

    // Create sample exams
    const exams = [
      {
        name: 'Mid Term Examination - CSE 2nd Year',
        date: new Date('2024-02-15'),
        subject: 'Data Structures',
        branch: 'CSE',
        year: 2,
        config: {
          seatingRules: {
            avoidAdjacentSameBranch: true,
            maxStudentsPerClassroom: 50
          }
        }
      },
      {
        name: 'Final Examination - ECE 3rd Year',
        date: new Date('2024-03-20'),
        subject: 'Digital Electronics',
        branch: 'ECE',
        year: 3,
        config: {
          seatingRules: {
            avoidAdjacentSameBranch: true,
            maxStudentsPerClassroom: 45
          }
        }
      },
      {
        name: 'Mid Term Examination - EEE 1st Year',
        date: new Date('2024-02-10'),
        subject: 'Basic Electrical Engineering',
        branch: 'EEE',
        year: 1,
        config: {
          seatingRules: {
            avoidAdjacentSameBranch: true,
            maxStudentsPerClassroom: 50
          }
        }
      }
    ];

    const createdExams = await Exam.insertMany(exams);
    console.log('📝 Created exams:', createdExams.length);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: 2 (1 admin, 1 faculty)`);
    console.log(`- Blocks: 2`);
    console.log(`- Floors: 5`);
    console.log(`- Classrooms: ${createdClassrooms.length}`);
    console.log(`- Students: ${createdStudents.length}`);
    console.log(`- Exams: ${createdExams.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log(`Admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
    console.log(`Faculty: faculty@uniseat.local / Faculty@123`);
    
    console.log('\n🚀 You can now start the backend server with: npm run dev');
    console.log('🌐 API will be available at: http://localhost:5000');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
