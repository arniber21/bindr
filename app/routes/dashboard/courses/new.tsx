import { ActionFunction, redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import { primaryButtonClasses } from "~/utils/classes";
import { createCourse } from "~/utils/assignments.server";

const formControlClasses = 'border-2 border-slate-300 text-sm rounded-lg py-3 px-5 hover:bg-slate-200 hover:border-slate-500 selection:bg-slate-400 selection:border-slate-500';

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const user = await getUser(request);
	if(!user) throw new Error("Could not find user");

	const name = formData.get("name") as string;
	const userId = user.id;

	await createCourse(userId, { name });
	return redirect("/dashboard/courses");
}

export default function NewCoursePage() {
	return (
		<div>
			<form method="post">
				<h1 className="text-lg">Create Course</h1>
				<div className="my-3">
					<input type="text" name="name" placeholder="Name: " className={formControlClasses} />
				</div>
				<div className="my-3">
					<button type="submit" className={ primaryButtonClasses }>Add Course</button>
				</div>
			</form>
		</div>
	)
}