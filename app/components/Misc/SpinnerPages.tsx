import '@/app/page.css'

export default function SpinnerPages() {
    return (
        <div className="flex ml-[15rem] items-center justify-center fixed inset-0">
            <span className="loader"></span>
        </div>
    );
}
