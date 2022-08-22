import { formControlClasses, primaryButtonClasses, secondaryButtonClasses, textAreaClasses } from "~/utils/classes";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { getAssignment, updateAssignment } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";

export const action: ActionFunction = async ({ params, request }) => {
	const formData = await request.formData();
	const assignmentId = params.assignmentId;
	const courseId = params.courseId;
	if (!assignmentId || !courseId) throw new Error("Something terribly wrong has occurred");
	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const dueDate = new Date(formData.get("dueDate") as string);
	await updateAssignment(Number.parseInt(assignmentId), name, description, dueDate);
	return redirect(	`/dashboard/courses/${courseId}/assignments/${assignmentId}`);
};

type LoaderData = {
	assignment: {
		name: string,
		description: string,
		dueDate: string
	}
}

export const loader: LoaderFunction = async ({ params, request }) => {
	const assingmentId = params.assignmentId;
	if (!assingmentId) throw new Error("Something horribly wrong has occurred");
	const assignment = await getAssignment(Number.parseInt(assingmentId));
	return json({ assignment });

};
export default function EditAssignmentPage() {
	const data = useLoaderData<LoaderData>();
	return (
		<div className="py-3">
			<form method="post">
				<div className="my-3">
					<input type="text" defaultValue={data.assignment.name} name="name" placeholder="Assignment Name"
						   className={formControlClasses} />
				</div>
				<div className="my-3">
					<textarea name="description" defaultValue={data.assignment.description}
							  placeholder="Assignment Description" rows={10} cols={40}
							  className={textAreaClasses} />
				</div>
				<div className="my-3">
					Due Date: <input placeholder="Due Date"
									 defaultValue={new Date(data.assignment.dueDate).toISOString().split("T")[0]}
									 type="date" name="dueDate" className={formControlClasses} />
				</div>
				<div className="my-3">
					<button type="submit" className={secondaryButtonClasses}>Edit Assignment</button>
				</div>
			</form>
		</div>
	);
}