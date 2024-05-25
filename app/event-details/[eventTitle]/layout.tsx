import './custom.css'

export default function EventDetailsPage ({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <div className=" md:container md:max-w-[74rem]  md:mx-auto">
            {children}
        </div>
    )
}