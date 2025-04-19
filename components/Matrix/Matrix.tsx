interface MetrixProps {
	priorityType: string;
	customBorder: string;
}

const Matrix = ({ priorityType, customBorder }: MetrixProps) => {
	return (
		<div
			className={`relative grid w-fit grid-cols-5 grid-rows-5 ${customBorder}`}
		>
			<p className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl text-gray-100">
				{priorityType}
			</p>
			{Array.from({ length: 25 }).map((_, index) => (
				<div key={index} className="size-[100px] border border-gray-100">
					{/* สามารถเพิ่มข้อมูล/label/props ได้ตามต้องการ */}
				</div>
			))}
		</div>
	);
};

export default Matrix;
