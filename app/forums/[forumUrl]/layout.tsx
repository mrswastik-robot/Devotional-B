export default function ForumsPage ({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <div className="lg:container lg:max-w-[86rem] lg:mx-auto font-dmsans mt-1">
            {children}
        </div>
    )
}