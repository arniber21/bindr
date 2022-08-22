import { formControlClasses, secondaryButtonClasses, textAreaClasses } from "~/utils/classes";
import { ActionFunction, redirect } from "@remix-run/node";
import { createAssignment } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
	const courseId = params.courseId;
	if(!courseId) throw new Error("Something horribly wrong occured");
	const formData = await request.formData();
	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const startDate = new Date();
	const dueDate = new Date(formData.get("dueDate") as string);
	const assignment = await createAssignment(Number.parseInt(courseId), { name, description, startDate, dueDate });
	return redirect(`/dashboard/courses/${courseId}/assignments/${assignment.id}`);
}

export default function NewAssignmentPage() {
	return (
		<div className='py-3'>
			<form method="post">
				<div className="m-3">
					<input type="text" name="name" placeholder="Assignment Name" className={formControlClasses} />
				</div>
				<div className="m-3">
					<textarea name="description" placeholder="Assignment Description" rows={10} cols={40} className={textAreaClasses}/>
				</div>
				<div className="m-3">
					Due Date: <input placeholder="Due Date" type="date" name="dueDate" className={formControlClasses} />
				</div>
				<div className="m-3">
					<button type="submit" className={secondaryButtonClasses}>Add Assignment</button>
				</div>
			</form>
		</div>
	)
}