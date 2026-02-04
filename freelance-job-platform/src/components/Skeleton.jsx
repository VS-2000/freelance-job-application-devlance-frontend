const Skeleton = ({ className, variant = "rect" }) => {
    const baseClass = "animate-pulse bg-gray-800/50";
    const variantClasses = {
        rect: "rounded-lg",
        circle: "rounded-full",
        text: "rounded h-4 w-full",
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`}></div>
    );
};

export default Skeleton;
