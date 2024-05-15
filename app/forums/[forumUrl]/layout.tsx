export default function ForumsPage ({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <div className="lg:container lg:max-w-[86rem] lg:mx-auto mt-3">
            {children}
        </div>
    )
}