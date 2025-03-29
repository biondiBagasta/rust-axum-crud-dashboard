
interface PaginationProps {
	page: number;
	totalPage: number;
	onPaginate: (page: number) => void
}

export default function PaginationComponent(props: PaginationProps) {
	return (
		<div className="join">
			{
				Array.from({ length: props.totalPage }, (_, index) => (
					<button key={ index } onClick={
						() => {
							const paginationPage = index + 1;
							props.onPaginate(paginationPage);
						}
					}
						className={
							index + 1 == props.page ? 'join-item btn btn-sm btn-active' :
							'join-item btn btn-sm'
						}
					>{ index + 1 }</button>
				))
			}
		</div>
	)
}