import { db } from "~/utils/db.server";

/**
 * Create a course in the database.
 * @param userId the userId of the user that the coures should be attatched to
 * @param courseData the courseData that you are creating the course out of
 */
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

/**
 * Returns a list of courses for a given user
 * @param userId the userId of the user
 */
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

/**
 * Get a single course
 * @param courseId the id of the course to retrieve
 */
export const getCourse = async (courseId: number) => {
	// Fetch the user
	return db.course.findUnique({ where: { id: courseId }});
};

/**
 * Creates an assignment
 * @param courseId
 * @param assignmentData
 */
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

/**
 * Retrieves an assignment from the database
 * @param assignmentId the id of the assignment to retrieve
 */
export const getAssignment = async (assignmentId: number) => {
	const assignment = await db.assignment.findUnique({
		where: {
			id: assignmentId,
		},
	});

	return assignment;
};

/**
 * Retrieves every assignment of a particular course
 * @param courseId the id of the course
 */
export const getAssignments = async (courseId: number) => {
	const course = await db.course.findUnique({ where: { id: courseId }, include: { assignments: true } });
	if (!course) throw new Error("Could not find course");
	return course.assignments;
};

/**
 * Set an assignment as complete
 * @param assignmentId the assignment
 */
export const setAssignmentAsComplete = async (assignmentId: number) => {
	const assignment = await db.assignment.update({ where: { id: assignmentId }, data: { completed: true } });
	return assignment;
};

/**
 * Update the contents of the assignment
 * @param assignmentId the id of the assignment
 * @param name the new name, or the same one
 * @param description the new description, or the same one
 * @param dueDate the new dueDate, or the new one
 */
export const updateAssignment = async (assignmentId: number, name: string, description: string, dueDate: Date) => {
	const assignment = await db.assignment.update({
		where: { id: assignmentId },
		data: { name, description, dueDate },
	});
	return assignment;
};