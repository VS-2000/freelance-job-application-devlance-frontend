import Skeleton from "./Skeleton";

const JobCardSkeleton = () => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1 w-full">
                    <Skeleton className="w-20 h-5 mb-2 rounded-full" />
                    <Skeleton className="w-3/4 h-7" />
                </div>
                <Skeleton className="w-24 h-10 rounded-xl" />
            </div>

            <div className="mb-6 space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                    <Skeleton variant="circle" className="w-8 h-8" />
                    <div className="space-y-1">
                        <Skeleton className="w-16 h-3" />
                        <Skeleton className="w-10 h-2" />
                    </div>
                </div>
                <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
        </div>
    );
};

export default JobCardSkeleton;
