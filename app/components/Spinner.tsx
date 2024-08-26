import '@/app/page.css'

export default function Spinner() {
    return (
        <div className="flex items-center justify-center fixed inset-0">
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    );
}
