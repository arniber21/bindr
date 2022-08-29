import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { BsArrowRightCircle } from "react-icons/bs";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { createUser, getUser } from "~/utils/session.server";
import { formControlClasses, secondaryButtonClasses } from "~/utils/classes";

type ActionData = {
	error: string;
}

export const action: ActionFunction = async({ request }) => {
	// Get the form data
	const formData = await request.formData();

	// Individual fields
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;
	const name = formData.get("name") as string;

	// If the password doesn't match the confirmed password
	if(confirmPassword !== password) return json({ error: 'Passwords do not match '});

	// Create the user & redirect
	const user = await createUser(email, password, name);
	return redirect("/dashboard");
}

export default function SignupPage() {
	const actionData = useActionData<ActionData>();
	return (
		<div className='flex flex-row justify-center'>
			<Form method="post" className="p-3 flex flex-col items-center">
				<h1 className="text-xl font-bold">Sign Up</h1>
				<div className="m-3">
					<input type="text" name="name" placeholder='Name' className={formControlClasses} />
				</div>
				<div className="m-3">
					<input type="email" name="email" placeholder='Email' className={formControlClasses}/>
				</div>
				<div className="m-3">
					<input type="password" name="password" placeholder='Password' className={formControlClasses} />
				</div>
				<div className="m-3">
					<input type="password" name="confirmPassword" placeholder='Confirm Password' className={formControlClasses} />
				</div>
				<div className="m-3">
					<button type='submit' className={ secondaryButtonClasses }>
						Sign Up <BsArrowRightCircle style={{display: "inline-block", marginLeft: '0.3rem'}}/>
					</button>
				</div>
				{ actionData && <span className='text-red-500'> { actionData.error} </span> }
			</Form>
		</div>

	)

}