import '@/app/page.css'

export default function Spinner() {
    return (
        <div className="flex items-center justify-center fixed inset-0">
            <span className="loader"></span>
        </div>
    );
}
