import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
	var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
	db = new PrismaClient();
} else {
	if (!global.__db) {
		global.__db = new PrismaClient();
	}
	db = global.__db;
}

export const createCourse = async (userId: number, courseData: { name: string, }) => {
	const course = await db.course.create({
		data: {
			name: courseData.name,
			source: "user-created",
			userId: userId,
		},
	});

	return course;
};

export const getCourses = async (userId: number) => {
	const user = await db.user.findUnique({
			where: {
				id: userId,
			}, include: {
				courses: true,
			},
		},
	);
	if (!user) throw new Error("Could not find the user");
	return user.courses;
};

export const getCourse = async (userId: number, courseId: number) => {
	// Fetch the user
	const courses = await getCourses(userId);
	return courses.find(course => course.id === courseId);
};

export const createAssignment = async (courseId: number, assignmentData: { name: string, description: string, startDate: Date, dueDate: Date }) => {
	const assignment = await db.assignment.create({
		data: {
			name: assignmentData.name,
			description: assignmentData.description,
			startDate: assignmentData.startDate,
			dueDate: assignmentData.dueDate,
			courseId: courseId,
			completed: false,
		},
	});

	return assignment;
};

export const getAssignment = async (assignmentId: number) => {
	const assignment = await db.assignment.findUnique({
		where: {
			id: assignmentId,
		},
	});

	return assignment;
};

export const getAssignments = async (courseId: number) => {
	const course = await db.course.findUnique({ where: { id: courseId }, include: { assignments: true } });
	if (!course) throw new Error("Could not find course");
	return course.assignments;
};

export const setAssignmentAsComplete = async (assignmentId: number) => {
	const assignment = await db.assignment.update({ where: { id: assignmentId }, data: { completed: true }});
	return assignment;
};

export const updateAssignment = async(assignmentId: number, name: string, description: string, dueDate: Date) => {
	const assignment = await db.assignment.update({ where: { id: assignmentId }, data: { name, description, dueDate }});
	return assignment;
}

export { db };