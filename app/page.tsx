export default function Home() {
	async function saveAction() {
		'use server';
		console.log('Hey');
	}
	return (
		<div className="flex justify-center items-center">
			<form action={saveAction}>
				<input
					type="text"
					name="address"
					placeholder="Address"
					className="border border-gray-400 m-64 rounded text-xl pl-2"
				/>
			</form>
		</div>
	);
}
