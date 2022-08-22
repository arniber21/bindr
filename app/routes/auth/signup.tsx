import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { BsArrowRightCircle } from "react-icons/bs";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { createUser, getUser } from "~/utils/session.server";
import { formControlClasses } from "~/utils/classes";

export const action: ActionFunction = async({ request }) => {
	const formData = await request.formData();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;

	const user = await createUser(email, password, name);
	console.log(user);

	return redirect("/dashboard");
}

export default function SignupPage() {
	return (
		<div className='flex flex-row justify-center'>
			<form method="post" className="p-3 flex flex-col items-center">
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
					<button type='submit' className='text-sm rounded-full py-3 px-5 bg-green-400 text-white border-2 hover:text-black hover:border-slate-500'>
						Sign Up <BsArrowRightCircle style={{display: "inline-block", marginLeft: '0.3rem'}}/>
					</button>
				</div>
			</form>
		</div>
	)

}