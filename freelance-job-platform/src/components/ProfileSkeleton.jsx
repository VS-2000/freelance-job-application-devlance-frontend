import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Header / Hero Skeleton */}
            <div className="relative bg-gray-900 border-b border-gray-800 pb-12 pt-28 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
                    <Skeleton variant="circle" className="w-40 h-40 md:w-52 md:h-52" />
                    <div className="flex-1 space-y-4 w-full text-center md:text-left">
                        <Skeleton className="w-64 h-12 mx-auto md:mx-0" />
                        <Skeleton className="w-48 h-6 mx-auto md:mx-0" />
                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-32 h-5" />
                            <Skeleton className="w-32 h-5" />
                        </div>
                    </div>
                    <div className="w-full md:w-auto space-y-4">
                        <Skeleton className="w-full md:w-48 h-14 rounded-2xl" />
                        <Skeleton className="w-full md:w-48 h-20 rounded-2xl" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="space-y-8">
                    <Skeleton className="w-full h-48 rounded-3xl" />
                    <Skeleton className="w-full h-64 rounded-3xl" />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex gap-6 border-b border-gray-800 mb-8 pb-4">
                        <Skeleton className="w-24 h-6" />
                        <Skeleton className="w-24 h-6" />
                        <Skeleton className="w-24 h-6" />
                    </div>
                    <Skeleton className="w-full h-96 rounded-3xl" />
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
