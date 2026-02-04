import Skeleton from "./Skeleton";

const JobDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-black pb-20">
            <div className="w-full px-4 md:px-10 py-12">
                <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-8">
                    <div className="max-w-4xl flex-1 w-full">
                        <Skeleton className="w-3/4 h-12 mb-6" />
                        <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
                            <Skeleton className="w-24 h-7 rounded-full" />
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-48 h-7 rounded-full" />
                        </div>
                    </div>
                    <div className="w-full lg:w-auto bg-gray-900 p-8 rounded-[32px] border border-gray-800 lg:min-w-[280px]">
                        <Skeleton className="w-full h-12 mb-2" />
                        <Skeleton className="w-full h-3" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 space-y-12">
                        <section className="bg-gray-900 p-8 rounded-[32px] border border-gray-800">
                            <Skeleton className="w-48 h-8 mb-6" />
                            <Skeleton className="w-full h-32 rounded-2xl" />
                        </section>
                    </div>

                    <aside className="w-full lg:w-80 space-y-6">
                        <div className="bg-gray-900 p-8 rounded-[40px] border border-gray-800">
                            <Skeleton className="w-32 h-6 mb-4" />
                            <div className="flex items-center gap-3 mb-6">
                                <Skeleton variant="circle" className="w-12 h-12" />
                                <div className="space-y-2">
                                    <Skeleton className="w-24 h-4" />
                                    <Skeleton className="w-32 h-3" />
                                </div>
                            </div>
                            <Skeleton className="w-full h-40" />
                        </div>
                        <Skeleton className="w-full h-14 rounded-3xl" />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsSkeleton;
